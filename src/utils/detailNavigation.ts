import type { CatalogItem, Pokemon } from '../types/pokemon'
import { listDetailHref, listHref, parseListState, selectListItems } from './listState'
import { galleryDetailHref, galleryHref, parseGalleryTypes, selectGalleryItems } from './galleryState'
import { parseDataMode, withMode } from './dataMode'

export interface DetailNavigation {
  previousId: number | null
  nextId: number | null
  previousHref: string | null
  nextHref: string | null
  position: number | null
  count: number
  fallback: boolean
  label: string
  backHref: string
  backLabel: string
}

export function detailBackLink(params: URLSearchParams) {
  const mode = parseDataMode(params)
  if (params.get('from') === 'gallery') {
    return { backHref: withMode(galleryHref(parseGalleryTypes(params)), mode), backLabel: 'Back to gallery' }
  }
  return { backHref: withMode(params.get('from') === 'list' ? listHref(parseListState(params)) : '/list/', mode), backLabel: 'Back to list' }
}

export function resolveDetailNavigation(
  catalog: readonly CatalogItem[], id: number, params: URLSearchParams,
  gallery: readonly Pokemon[] = [],
): DetailNavigation {
  const source = params.get('from')
  const state = parseListState(params)
  const mode = parseDataMode(params)
  const types = parseGalleryTypes(params)
  const all = [...catalog].sort((a, b) => a.id - b.id)
  const selection = source === 'list' ? selectListItems(catalog, state)
    : source === 'gallery' ? selectGalleryItems(gallery, types) : all
  const forcedFull = params.get('browse') === 'all' && (source === 'list' || source === 'gallery')
  const fallback = forcedFull || !selection.some((item) => item.id === id)
  const items = fallback ? all : selection
  const index = items.findIndex((item) => item.id === id)
  const canCycle = index >= 0 && items.length > 1
  const previousId = canCycle ? items[(index + items.length - 1) % items.length].id : null
  const nextId = canCycle ? items[(index + 1) % items.length].id : null

  function href(targetId: number | null): string | null {
    if (targetId === null) return null
    if (source !== 'list' && source !== 'gallery') return withMode(`/pokemon/${targetId}/`, mode)
    const target = source === 'list' ? listDetailHref(targetId, state)
      : galleryDetailHref(targetId, types)
    const address = withMode(target, mode)
    if (!fallback) return address
    // Keep the original return context, but make full-catalog browsing explicit
    // so a later ID cannot silently switch back into the original selection.
    return `${address}&browse=all`
  }

  return {
    previousId, nextId, previousHref: href(previousId), nextHref: href(nextId),
    position: index < 0 ? null : index + 1, count: items.length, fallback,
    label: fallback || (source !== 'list' && source !== 'gallery') ? 'Full collection'
      : source === 'list' ? 'List results' : 'Gallery results',
    ...detailBackLink(params),
  }
}
