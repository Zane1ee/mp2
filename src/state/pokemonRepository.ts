import { ApiError, readableError } from '../api/client'
import { pokemonApi } from '../api/pokemon'
import type { PokemonApi } from '../api/pokemon'
import type { CatalogItem, Pokemon, Resource } from '../types/pokemon'
import { idleResource } from '../types/pokemon'
import { parsePokemonId } from '../utils/catalog'
import { createRequestQueue } from './requestQueue'

export interface RepositorySnapshot {
  catalog: Resource<CatalogItem[]>
  details: Readonly<Record<number, Resource<Pokemon>>>
}

export function createPokemonRepository(api: PokemonApi) {
  let snapshot: RepositorySnapshot = { catalog: idleResource(), details: {} }
  let catalogRequest: Promise<CatalogItem[]> | null = null
  const detailRequests = new Map<number, Promise<Pokemon>>()
  const listeners = new Set<() => void>()
  const queue = createRequestQueue(4)
  let galleryRequest: Promise<void> | null = null
  let rateLimitUntil = 0

  function blockedError(): ApiError | null {
    return rateLimitUntil > Date.now()
      ? new ApiError('rate-limit', 'PokéAPI asked us to wait before sending more requests.', rateLimitUntil) : null
  }

  function recordError(error: unknown) {
    const problem = readableError(error)
    if (problem instanceof ApiError && problem.kind === 'rate-limit' && problem.retryAt !== null) {
      rateLimitUntil = Math.max(rateLimitUntil, problem.retryAt)
    }
    return problem
  }

  function coolingDown(resource: Resource<unknown> | undefined) {
    return resource?.status === 'error' && resource.error instanceof ApiError
      && resource.error.retryAt !== null && resource.error.retryAt > Date.now()
  }

  function publish(next: RepositorySnapshot) {
    snapshot = next
    listeners.forEach((listener) => listener())
  }

  function setDetail(id: number, state: Resource<Pokemon>) {
    publish({ ...snapshot, details: { ...snapshot.details, [id]: state } })
  }

  const repository = {
    getSnapshot: () => snapshot,
    subscribe: (listener: () => void) => {
      listeners.add(listener)
      return () => { listeners.delete(listener) }
    },
    loadCatalog(): Promise<CatalogItem[]> {
      if (snapshot.catalog.status === 'success') return Promise.resolve(snapshot.catalog.data)
      if (catalogRequest) return catalogRequest
      if (coolingDown(snapshot.catalog)) return Promise.reject(snapshot.catalog.error)
      const blocked = blockedError()
      if (blocked) {
        publish({ ...snapshot, catalog: { status: 'error', data: null, error: blocked } })
        return Promise.reject(blocked)
      }
      publish({ ...snapshot, catalog: { status: 'loading', data: null, error: null } })
      catalogRequest = Promise.resolve().then(api.catalog).then((data) => {
        publish({ ...snapshot, catalog: { status: 'success', data, error: null } })
        return data
      }).catch((error: unknown) => {
        const problem = recordError(error)
        publish({ ...snapshot, catalog: { status: 'error', data: null, error: problem } })
        throw problem
      }).finally(() => { catalogRequest = null })
      return catalogRequest
    },
    loadDetail(id: number): Promise<Pokemon> {
      if (parsePokemonId(String(id)) === null) return Promise.reject(new Error('Invalid Pokémon ID'))
      const cached = snapshot.details[id]
      if (cached?.status === 'success') return Promise.resolve(cached.data)
      const pending = detailRequests.get(id)
      if (pending) return pending
      if (coolingDown(cached)) return Promise.reject(cached?.error)
      setDetail(id, { status: 'loading', data: null, error: null })
      const request = queue.run(() => {
        const blocked = blockedError()
        return blocked ? Promise.reject(blocked) : api.detail(id)
      }).then((data) => {
        setDetail(id, { status: 'success', data, error: null })
        return data
      }).catch((error: unknown) => {
        const problem = recordError(error)
        setDetail(id, { status: 'error', data: null, error: problem })
        throw problem
      }).finally(() => { detailRequests.delete(id) })
      detailRequests.set(id, request)
      return request
    },
    loadGallery(retryFailed = false): Promise<void> {
      if (galleryRequest) return galleryRequest
      galleryRequest = repository.loadCatalog().then(async (catalog) => {
        const targets = catalog.filter(({ id }) => {
          const state = snapshot.details[id]
          return !state || state.status === 'idle' || state.status === 'loading'
            || (retryFailed && state.status === 'error')
        })
        // loadDetail owns the four-slot queue, de-duplication, and per-ID errors.
        // Settled failures remain visible; remounting never silently retries them.
        await Promise.allSettled(targets.map(({ id }) => repository.loadDetail(id)))
      }).finally(() => { galleryRequest = null })
      return galleryRequest
    },
  }
  return repository
}

// Shared requests belong to the repository, not an individual route component.
// Unmounting a view removes its subscription; it does not cancel another view's request.
export const pokemonRepository = createPokemonRepository(pokemonApi)
