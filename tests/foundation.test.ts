import { describe, expect, it, vi } from 'vitest'
import { ApiError } from '../src/api/client'
import { normalizeCatalog, normalizePokemon } from '../src/api/pokemon'
import type { PokemonApi } from '../src/api/pokemon'
import type { Pokemon } from '../src/types/pokemon'
import { createPokemonRepository } from '../src/state/pokemonRepository'
import { parsePokemonId } from '../src/utils/catalog'

function deferred<T>() {
  let resolve!: (value: T) => void
  let reject!: (error: Error) => void
  const promise = new Promise<T>((yes, no) => { resolve = yes; reject = no })
  return { promise, resolve, reject }
}

function pokemon(id: number): Pokemon {
  return { id, name: `pokemon-${id}`, imageUrl: null, types: [], heightMeters: null,
    weightKilograms: null, abilities: [], stats: [] }
}

const sample = {
  id: 1, name: 'bulbasaur', height: 7, weight: 69,
  sprites: { front_default: 'https://example.com/sprite.png', other: {} },
  types: [{ type: { name: 'grass' } }, { type: { name: 'poison' } }],
  abilities: [{ ability: { name: 'overgrow' } }],
  stats: [{ base_stat: 45, stat: { name: 'hp' } }],
}

describe('response validation and catalog boundaries', () => {
  it('checks ID identity and converts documented units', () => {
    expect(normalizePokemon(sample, 1)).toMatchObject({ id: 1, heightMeters: .7,
      weightKilograms: 6.9, types: ['grass', 'poison'] })
    expect(() => normalizePokemon(sample, 25)).toThrow('different Pokémon')
  })
  it('keeps missing measurements and image explicit instead of inventing values', () => {
    const result = normalizePokemon({ ...sample, height: null, weight: undefined,
      sprites: { front_default: null } }, 1)
    expect(result.heightMeters).toBeNull()
    expect(result.weightKilograms).toBeNull()
    expect(result.imageUrl).toBeNull()
  })
  it('rejects malformed payloads and unsafe image addresses', () => {
    expect(() => normalizePokemon({ ...sample, types: null }, 1)).toThrow()
    expect(normalizePokemon({ ...sample, sprites: { front_default: 'javascript:alert(1)' } }, 1).imageUrl).toBeNull()
  })
  it('requires exactly the approved catalog, with no duplicate or missing IDs', () => {
    const results = Array.from({ length: 60 }, (_, i) => ({ name: `pokemon-${i + 1}`,
      url: `https://pokeapi.co/api/v2/pokemon/${i + 1}/` }))
    expect(normalizeCatalog({ results }).map((item) => item.id)).toEqual(Array.from({ length: 60 }, (_, i) => i + 1))
    expect(() => normalizeCatalog({ results: results.slice(0, 59) })).toThrow('incomplete')
    expect(() => normalizeCatalog({ results: [...results.slice(0, 59), results[0]] })).toThrow('incomplete')
  })
  it('rejects invalid route IDs before requesting the API', () => {
    expect(parsePokemonId('1')).toBe(1)
    expect(parsePokemonId('60')).toBe(60)
    for (const id of ['0', '61', '-1', 'abc', '1x', '01', undefined]) {
      expect(parsePokemonId(id)).toBeNull()
    }
  })
})

describe('shared repository', () => {
  it('deduplicates catalog and detail requests, then reuses successful cache', async () => {
    const catalog = deferred<{ id: number; name: string }[]>()
    const detail = deferred<Pokemon>()
    const api: PokemonApi = { catalog: vi.fn(() => catalog.promise), detail: vi.fn(() => detail.promise) }
    const store = createPokemonRepository(api)
    const firstCatalog = store.loadCatalog()
    expect(store.loadCatalog()).toBe(firstCatalog)
    const first = store.loadDetail(1)
    expect(store.loadDetail(1)).toBe(first)
    catalog.resolve([{ id: 1, name: 'bulbasaur' }])
    detail.resolve(pokemon(1))
    await Promise.all([first, firstCatalog])
    await store.loadCatalog()
    await store.loadDetail(1)
    expect(api.catalog).toHaveBeenCalledTimes(1)
    expect(api.detail).toHaveBeenCalledTimes(1)
  })
  it('bounds detail concurrency to four and drains all queued requests', async () => {
    const tasks = Array.from({ length: 9 }, () => deferred<Pokemon>())
    const detail = vi.fn((id: number) => tasks[id - 1].promise)
    const store = createPokemonRepository({ catalog: async () => [], detail })
    const requests = tasks.map((_, i) => store.loadDetail(i + 1))
    await vi.waitFor(() => expect(detail).toHaveBeenCalledTimes(4))
    tasks.forEach((task, i) => task.resolve(pokemon(i + 1)))
    await Promise.all(requests)
    expect(detail).toHaveBeenCalledTimes(9)
    expect(Object.values(store.getSnapshot().details).every((state) => state.status === 'success')).toBe(true)
  })
  it('keeps late responses isolated by ID and removes unmounted subscribers', async () => {
    const one = deferred<Pokemon>()
    const two = deferred<Pokemon>()
    const store = createPokemonRepository({ catalog: async () => [], detail: (id) => id === 1 ? one.promise : two.promise })
    const listener = vi.fn()
    const unsubscribe = store.subscribe(listener)
    const first = store.loadDetail(1)
    const second = store.loadDetail(25)
    two.resolve(pokemon(25))
    await second
    const beforeUnsubscribe = listener.mock.calls.length
    unsubscribe()
    one.resolve(pokemon(1))
    await first
    expect(store.getSnapshot().details[25].data?.id).toBe(25)
    expect(store.getSnapshot().details[1].data?.id).toBe(1)
    expect(listener).toHaveBeenCalledTimes(beforeUnsubscribe)
  })
  it('allows manual retry after an error instead of caching a rejected promise forever', async () => {
    const detail = vi.fn().mockRejectedValueOnce(new ApiError('network', 'Offline'))
      .mockResolvedValueOnce(pokemon(1))
    const store = createPokemonRepository({ catalog: async () => [], detail })
    await expect(store.loadDetail(1)).rejects.toThrow('Offline')
    expect(store.getSnapshot().details[1].status).toBe('error')
    await store.loadDetail(1)
    expect(store.getSnapshot().details[1].status).toBe('success')
    expect(detail).toHaveBeenCalledTimes(2)
  })
  it('rejects out-of-scope IDs without adding them to the queue', async () => {
    const detail = vi.fn()
    const store = createPokemonRepository({ catalog: async () => [], detail })
    await expect(store.loadDetail(61)).rejects.toThrow('Invalid')
    expect(detail).not.toHaveBeenCalled()
  })
})
