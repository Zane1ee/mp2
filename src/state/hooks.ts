import { useEffect, useSyncExternalStore } from 'react'
import { useSearchParams } from 'react-router'
import { repositoryFor } from './dataSources'
import { idleResource } from '../types/pokemon'
import type { Pokemon } from '../types/pokemon'
import { isInDataScope, parseDataMode } from '../utils/dataMode'
import { galleryProgress } from '../utils/galleryState'

const emptyDetail = idleResource<Pokemon>()

export function useDataSource() {
  const [params] = useSearchParams()
  const mode = parseDataMode(params)
  return { mode, repository: repositoryFor(mode) }
}

export function useCatalog(enabled = true) {
  const { repository } = useDataSource()
  const { catalog } = useSyncExternalStore(repository.subscribe, repository.getSnapshot)
  useEffect(() => {
    if (enabled) void repository.loadCatalog().catch(() => { /* Snapshot exposes the error. */ })
  }, [enabled, repository])
  return catalog
}

export function usePokemon(id: number | null) {
  const { mode, repository } = useDataSource()
  const { details } = useSyncExternalStore(repository.subscribe, repository.getSnapshot)
  const allowed = id !== null && isInDataScope(id, mode)
  useEffect(() => {
    if (allowed && id !== null) void repository.loadDetail(id).catch(() => { /* Snapshot exposes the error. */ })
  }, [id, allowed, repository])
  return !allowed || id === null ? emptyDetail : details[id] ?? emptyDetail
}

export function useGallery(enabled = true) {
  const { repository } = useDataSource()
  const snapshot = useSyncExternalStore(repository.subscribe, repository.getSnapshot)
  useEffect(() => {
    if (enabled) void repository.loadGallery().catch(() => { /* Catalog/details expose failures. */ })
  }, [enabled, repository])
  return { catalog: snapshot.catalog,
    ...galleryProgress(snapshot.catalog.data ?? [], snapshot.details) }
}
