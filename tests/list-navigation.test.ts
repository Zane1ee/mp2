import { describe, expect, it } from 'vitest'
import { listDetailHref, listHref, listSearchParams, parseListState, selectListItems } from '../src/utils/listState'
import { detailBackLink, resolveDetailNavigation } from '../src/utils/detailNavigation'
import type { CatalogItem } from '../src/types/pokemon'

const catalog: readonly CatalogItem[] = Object.freeze([
  { id: 1, name: 'bulbasaur' }, { id: 4, name: 'charmander' },
  { id: 5, name: 'charmeleon' }, { id: 6, name: 'charizard' },
  { id: 9, name: 'blastoise' }, { id: 10, name: 'caterpie' },
  { id: 25, name: 'pikachu' }, { id: 29, name: 'nidoran-f' },
])
const ids = (items: readonly CatalogItem[]) => items.map((item) => item.id)

describe('list selector and URL state', () => {
  it('uses case-insensitive substring filtering with trimmed whitespace', () => {
    expect(ids(selectListItems(catalog, { query: '  CHAR  ', sort: 'id', order: 'asc' }))).toEqual([4, 5, 6])
    expect(selectListItems(catalog, { query: '   ', sort: 'id', order: 'asc' })).toHaveLength(8)
    expect(selectListItems(catalog, { query: 'no-such-pokemon', sort: 'id', order: 'asc' })).toEqual([])
    expect(ids(selectListItems(catalog, { query: 'nidoran f', sort: 'id', order: 'asc' }))).toEqual([29])
  })
  it.each([
    ['id', 'asc', [4, 5, 6]], ['id', 'desc', [6, 5, 4]],
    ['name', 'asc', [6, 4, 5]], ['name', 'desc', [5, 4, 6]],
  ] as const)('sorts char results by %s %s', (sort, order, expected) => {
    expect(ids(selectListItems(catalog, { query: 'char', sort, order }))).toEqual(expected)
  })
  it('uses numeric ID ordering, stable name ties, and never mutates its input', () => {
    const before = ids(catalog)
    expect(ids(selectListItems(catalog, { query: '', sort: 'id', order: 'asc' }))).toEqual([1, 4, 5, 6, 9, 10, 25, 29])
    expect(ids(catalog)).toEqual(before)
    expect(ids(selectListItems([{ id: 10, name: 'same' }, { id: 2, name: 'Same' }],
      { query: '', sort: 'name', order: 'desc' }))).toEqual([2, 10])
  })
  it('round-trips special characters and validates sort/order before use', () => {
    const state = { query: ' + & /? Pokémon ', sort: 'name', order: 'desc' } as const
    expect(parseListState(listSearchParams(state))).toEqual(state)
    expect(parseListState(new URLSearchParams('sort=unknown&order=sideways'))).toEqual({ query: '', sort: 'id', order: 'asc' })
    expect(parseListState(new URLSearchParams())).toEqual({ query: '', sort: 'id', order: 'asc' })
    const href = listDetailHref(25, state)
    const parsed = new URL(href, 'https://example.test')
    expect(parsed.searchParams.get('from')).toBe('list')
    expect(parseListState(parsed.searchParams)).toEqual(state)
    expect(detailBackLink(parsed.searchParams).backHref).toBe(listHref(state))
  })
  it('clears the query without changing the chosen ordering', () => {
    const state = { query: '', sort: 'name', order: 'desc' } as const
    expect(listSearchParams(state).has('q')).toBe(false)
    expect(parseListState(listSearchParams(state))).toEqual(state)
  })
})

describe('detail sequence', () => {
  it('follows filtered name ordering and wraps at both ends', () => {
    const params = new URLSearchParams('from=list&q=char&sort=name&order=asc')
    const first = resolveDetailNavigation(catalog, 6, params)
    expect(first).toMatchObject({ position: 1, count: 3, previousId: 5, nextId: 4, fallback: false })
    const last = resolveDetailNavigation(catalog, 5, params)
    expect(last).toMatchObject({ position: 3, previousId: 4, nextId: 6 })
    const target = new URL(first.nextHref!, 'https://example.test')
    expect(target.pathname).toBe('/pokemon/4/')
    expect(target.searchParams.get('q')).toBe('char')
    expect(resolveDetailNavigation(catalog, 4, target.searchParams).position).toBe(2)
    expect(first.backHref).toBe('/list/?q=char&sort=name&order=asc')
  })
  it('disables navigation for a single list result', () => {
    expect(resolveDetailNavigation(catalog, 25, new URLSearchParams('from=list&q=pikachu')))
      .toMatchObject({ position: 1, count: 1, previousHref: null, nextHref: null })
  })
  it('uses the default numeric collection on a direct detail URL', () => {
    expect(resolveDetailNavigation(catalog, 9, new URLSearchParams()))
      .toMatchObject({ previousId: 6, nextId: 10, label: 'Full collection', fallback: false })
  })
  it('falls back for an empty or nonmatching source and persists that choice across navigation', () => {
    for (const query of ['char', 'no-such-pokemon']) {
      const params = new URLSearchParams({ from: 'list', q: query, sort: 'name', order: 'desc' })
      const result = resolveDetailNavigation(catalog, 1, params)
      expect(result).toMatchObject({ fallback: true, count: 8, nextId: 4 })
      const target = new URL(result.nextHref!, 'https://example.test')
      expect(target.searchParams.get('browse')).toBe('all')
      expect(resolveDetailNavigation(catalog, 4, target.searchParams))
        .toMatchObject({ fallback: true, count: 8, nextId: 5 })
      expect(detailBackLink(target.searchParams).backHref).toBe(`/list/?q=${query}&sort=name&order=desc`)
    }
  })
  it('handles no usable catalog without index -1 arithmetic', () => {
    expect(resolveDetailNavigation([], 1, new URLSearchParams()))
      .toMatchObject({ position: null, count: 0, previousHref: null, nextHref: null })
  })
  it('ignores an unknown source instead of applying its unrelated query to the return link', () => {
    expect(resolveDetailNavigation(catalog, 1, new URLSearchParams('from=unknown&q=char')))
      .toMatchObject({ count: 8, nextId: 4, backHref: '/list/', label: 'Full collection' })
  })
  it('restores validated gallery filters in the return link', () => {
    expect(detailBackLink(new URLSearchParams('from=gallery&type=water&type=fire')))
      .toMatchObject({ backHref: '/gallery/?type=fire&type=water', backLabel: 'Back to gallery' })
  })
})
