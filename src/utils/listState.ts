import type { CatalogItem } from '../types/pokemon'
import { displayName } from './catalog'

export type SortKey = 'id' | 'name'
export type SortOrder = 'asc' | 'desc'
export interface ListState {
  query: string
  sort: SortKey
  order: SortOrder
}

const nameOrder = new Intl.Collator('en', { sensitivity: 'base' })

export function parseListState(params: URLSearchParams): ListState {
  return {
    query: params.get('q') ?? '',
    sort: params.get('sort') === 'name' ? 'name' : 'id',
    order: params.get('order') === 'desc' ? 'desc' : 'asc',
  }
}

export function listSearchParams(state: ListState): URLSearchParams {
  const params = new URLSearchParams()
  if (state.query) params.set('q', state.query)
  params.set('sort', state.sort)
  params.set('order', state.order)
  return params
}

export function listHref(state: ListState): string {
  return `/list/?${listSearchParams(state)}`
}

export function listDetailHref(id: number, state: ListState): string {
  const params = new URLSearchParams({ from: 'list' })
  listSearchParams(state).forEach((value, key) => params.set(key, value))
  return `/pokemon/${id}/?${params}`
}

export function selectListItems(items: readonly CatalogItem[], state: ListState): CatalogItem[] {
  const query = state.query.trim().toLowerCase()
  const direction = state.order === 'asc' ? 1 : -1
  return items.filter((item) => item.name.toLowerCase().includes(query)
    || displayName(item.name).toLowerCase().includes(query)).sort((a, b) => {
    const comparison = state.sort === 'id' ? a.id - b.id : nameOrder.compare(a.name, b.name)
    return comparison * direction || a.id - b.id
  })
}
