import { readFileSync } from 'node:fs'
import { describe, expect, it, vi } from 'vitest'
import { ApiError, readableError, retryAfterTime } from '../src/api/client'
import { createSampleApi, normalizeSampleBundle } from '../src/api/sample'
import { createPokemonRepository } from '../src/state/pokemonRepository'
import type { Pokemon } from '../src/types/pokemon'
import { galleryDetailHref, galleryHref, galleryProgress, parseGalleryTypes, selectGalleryItems } from '../src/utils/galleryState'
import { detailBackLink, resolveDetailNavigation } from '../src/utils/detailNavigation'
import { isInDataScope, parseDataMode, SAMPLE_IDS, withMode } from '../src/utils/dataMode'

const rawSample = JSON.parse(readFileSync('public/data/pokemon-sample.json', 'utf8'))
const sample = normalizeSampleBundle(rawSample).pokemon
const catalog = sample.map(({ id, name }) => ({ id, name }))

describe('gallery filtering and source URLs', () => {
  it('uses OR, deduplicates dual types, and sorts by ID without mutation', () => {
    const before = sample.map(({ id }) => id)
    expect(selectGalleryItems(sample, ['grass', 'poison']).map(({ id }) => id)).toEqual([1])
    expect(selectGalleryItems(sample, ['fire', 'water']).map(({ id }) => id)).toEqual([4, 7, 60])
    expect(selectGalleryItems(sample, [])).toHaveLength(6)
    expect(selectGalleryItems(sample, ['dragon'])).toHaveLength(0)
    expect(sample.map(({ id }) => id)).toEqual(before)
  })
  it('validates external filters and preserves repeated type values', () => {
    expect(parseGalleryTypes(new URLSearchParams('type=FIRE&type=water&type=fire&type=garbage'))).toEqual(['fire', 'water'])
    const url = new URL(galleryDetailHref(7, ['water', 'fire', 'water']), 'https://example.test')
    expect(url.searchParams.getAll('type')).toEqual(['fire', 'water'])
    expect(detailBackLink(url.searchParams).backHref).toBe(galleryHref(['fire', 'water']))
  })
  it('rebuilds filtered gallery navigation, wraps, and retains types and mode', () => {
    const params = new URLSearchParams('from=gallery&type=fire&type=water&mode=sample')
    const nav = resolveDetailNavigation(catalog, 4, params, sample)
    expect(nav).toMatchObject({ position: 1, count: 3, previousId: 60, nextId: 7, fallback: false, label: 'Gallery results' })
    const next = new URL(nav.nextHref!, 'https://example.test')
    expect(next.searchParams.getAll('type')).toEqual(['fire', 'water'])
    expect(next.searchParams.get('mode')).toBe('sample')
    expect(resolveDetailNavigation(catalog, 60, params, sample).nextId).toBe(4)
    expect(nav.backHref).toBe('/gallery/?type=fire&type=water&mode=sample')
  })
  it('disables a single result and persists full-collection fallback for mismatches', () => {
    expect(resolveDetailNavigation(catalog, 25, new URLSearchParams('from=gallery&type=electric'), sample))
      .toMatchObject({ count: 1, previousHref: null, nextHref: null })
    const params = new URLSearchParams('from=gallery&type=fire')
    const nav = resolveDetailNavigation(catalog, 1, params, sample)
    expect(nav).toMatchObject({ count: 6, fallback: true })
    const next = new URL(nav.nextHref!, 'https://example.test')
    expect(next.searchParams.get('browse')).toBe('all')
    expect(resolveDetailNavigation(catalog, 4, next.searchParams, sample).count).toBe(6)
    expect(detailBackLink(next.searchParams).backHref).toBe('/gallery/?type=fire')
  })
  it('keeps pending and failed profiles distinct from a valid empty result', () => {
    const progress = galleryProgress(catalog, {
      1: { status: 'success', data: sample[0], error: null },
      4: { status: 'error', data: null, error: new Error('Offline') },
      7: { status: 'loading', data: null, error: null },
    })
    expect(progress).toMatchObject({ total: 6, pending: 4, ready: false })
    expect(progress.items.map(({ id }) => id)).toEqual([1])
    expect(progress.failures.map(({ id }) => id)).toEqual([4])
    const loaded = Object.fromEntries(sample.map((pokemon) => [pokemon.id, { status: 'success' as const, data: pokemon, error: null }]))
    expect(galleryProgress(catalog, loaded).ready).toBe(true)
    expect(galleryProgress([], {}).ready).toBe(false)
  })
})

describe('sample provenance, transport, and mode isolation', () => {
  it('validates the actual saved API sample and rejects wrong scope, source or payloads', () => {
    expect(sample.map(({ id }) => id)).toEqual([...SAMPLE_IDS])
    expect(sample[0]).toMatchObject({ name: 'bulbasaur', heightMeters: .7, weightKilograms: 6.9 })
    for (const patch of [{ source: 'invented' }, { capturedAt: 'unknown' }, { ids: [1] }, { pokemon: [] }]) {
      expect(() => normalizeSampleBundle({ ...rawSample, ...patch })).toThrow()
    }
    const wrongId = structuredClone(rawSample)
    wrongId.pokemon[0].id = 2
    expect(() => normalizeSampleBundle(wrongId)).toThrow('different Pokémon')
    for (const types of [[], [{ type: { name: 'invented-type' } }]]) {
      const unknownTypes = structuredClone(rawSample)
      unknownTypes.pokemon[0].types = types
      expect(() => normalizeSampleBundle(unknownTypes)).toThrow('invalid types')
    }
  })
  it('shares one sample-file read and retries a failed read instead of caching rejection', async () => {
    const read = vi.fn().mockRejectedValueOnce(new Error('Offline')).mockResolvedValue(rawSample)
    const api = createSampleApi(read)
    await expect(api.catalog()).rejects.toThrow('local sample file')
    const [items, detail] = await Promise.all([api.catalog(), api.detail(25)])
    expect(items).toHaveLength(6)
    expect(detail.id).toBe(25)
    expect(read).toHaveBeenCalledTimes(2)
    await expect(api.detail(2)).rejects.toThrow('outside')
  })
  it('isolates live and sample caches even for the same ID and concurrent responses', async () => {
    let resolve!: (value: Pokemon) => void
    const pending = new Promise<Pokemon>((yes) => { resolve = yes })
    const live = createPokemonRepository({ catalog: async () => catalog, detail: () => pending })
    const saved = createPokemonRepository(createSampleApi(async () => rawSample))
    const liveRequest = live.loadDetail(1)
    await saved.loadDetail(1)
    expect(live.getSnapshot().details[1].status).toBe('loading')
    resolve({ ...sample[0], name: 'live-only' })
    await liveRequest
    expect(live.getSnapshot().details[1].data?.name).toBe('live-only')
    expect(saved.getSnapshot().details[1].data?.name).toBe('bulbasaur')
    await saved.loadGallery()
    expect(saved.getSnapshot().catalog.data).toHaveLength(6)
  })
  it('propagates mode across list/gallery/default/fallback links and checks sample scope', () => {
    expect(parseDataMode(new URLSearchParams('mode=unknown'))).toBe('live')
    expect(withMode('/list/?q=char&mode=sample', 'live')).toBe('/list/?q=char')
    expect(isInDataScope(2, 'sample')).toBe(false)
    const nav = resolveDetailNavigation(catalog, 1, new URLSearchParams('mode=sample'))
    expect(nav.previousHref).toBe('/pokemon/60/?mode=sample')
    expect(nav.backHref).toBe('/list/?mode=sample')
    const fromList = resolveDetailNavigation(catalog, 4, new URLSearchParams('mode=sample&from=list&q=char'))
    expect(fromList).toMatchObject({ count: 1, nextHref: null })
    expect(fromList.backHref).toContain('mode=sample')
  })
})

describe('bulk loading, partial errors, and rate limiting', () => {
  it('recovers the entire type index when retrying a failed catalog load', async () => {
    const readCatalog = vi.fn().mockRejectedValueOnce(new ApiError('network', 'Offline'))
      .mockResolvedValueOnce(catalog)
    const detail = vi.fn(async (id: number) => sample.find((pokemon) => pokemon.id === id)!)
    const store = createPokemonRepository({ catalog: readCatalog, detail })
    await expect(store.loadGallery()).rejects.toThrow('Offline')
    expect(detail).not.toHaveBeenCalled()
    await store.loadGallery(true)
    expect(galleryProgress(catalog, store.getSnapshot().details).ready).toBe(true)
    expect(detail).toHaveBeenCalledTimes(6)
  })
  it('shares bulk work, preserves successes, and retries only failures when requested', async () => {
    const attempts = new Map<number, number>()
    const detail = vi.fn(async (id: number) => {
      attempts.set(id, (attempts.get(id) ?? 0) + 1)
      if (id === 4 && attempts.get(id) === 1) throw new ApiError('network', 'Offline')
      return sample.find((pokemon) => pokemon.id === id)!
    })
    const store = createPokemonRepository({ catalog: async () => catalog, detail })
    const first = store.loadGallery()
    expect(store.loadGallery()).toBe(first)
    await first
    expect(galleryProgress(catalog, store.getSnapshot().details)).toMatchObject({ ready: false, pending: 0 })
    await store.loadGallery()
    expect(detail).toHaveBeenCalledTimes(6)
    await store.loadGallery(true)
    expect(detail).toHaveBeenCalledTimes(7)
    expect(attempts.get(1)).toBe(1)
    expect(galleryProgress(catalog, store.getSnapshot().details).ready).toBe(true)
  })
  it('bounds full-gallery network concurrency to four', async () => {
    let active = 0
    let peak = 0
    const detail = vi.fn(async (id: number) => {
      active += 1
      peak = Math.max(peak, active)
      await new Promise((resolve) => setTimeout(resolve, 2))
      active -= 1
      return { ...sample[0], id }
    })
    const full = Array.from({ length: 60 }, (_, i) => ({ id: i + 1, name: `item-${i + 1}` }))
    const store = createPokemonRepository({ catalog: async () => full, detail })
    await store.loadGallery()
    expect(peak).toBe(4)
    expect(detail).toHaveBeenCalledTimes(60)
  })
  it('parses Retry-After delay/date and normalizes timeout, 429, and network failures', () => {
    const now = Date.parse('2026-10-06T00:00:00Z')
    expect(retryAfterTime('3', now)).toBe(now + 3000)
    expect(retryAfterTime('Tue, 06 Oct 2026 00:00:05 GMT', now)).toBe(now + 5000)
    expect(retryAfterTime('bad', now)).toBeNull()
    expect(retryAfterTime('-5', now)).toBeNull()
    expect(readableError({ isAxiosError: true, response: { status: 429, headers: { 'retry-after': '2' } } }))
      .toMatchObject({ kind: 'rate-limit', retryAt: expect.any(Number) })
    expect(readableError({ isAxiosError: true, code: 'ECONNABORTED' })).toMatchObject({ kind: 'timeout' })
    expect(readableError({ isAxiosError: true })).toMatchObject({ kind: 'network' })
  })
  it('prevents new queued requests and early retries during a server cooldown', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-10-06T00:00:00Z'))
    try {
      const detail = vi.fn(async (id: number) => {
        if (id === 1) throw new ApiError('rate-limit', 'Wait', Date.now() + 3000)
        return { ...sample[0], id }
      })
      const full = Array.from({ length: 8 }, (_, i) => ({ id: i + 1, name: `item-${i + 1}` }))
      const store = createPokemonRepository({ catalog: async () => full, detail })
      await store.loadGallery()
      expect(detail.mock.calls.length).toBeLessThanOrEqual(4)
      const before = detail.mock.calls.length
      await expect(store.loadDetail(1)).rejects.toThrow('Wait')
      await expect(store.loadDetail(8)).rejects.toThrow('wait')
      expect(detail.mock.calls.length).toBe(before)
      detail.mockImplementation(async (id) => ({ ...sample[0], id }))
      vi.advanceTimersByTime(3001)
      await store.loadGallery(true)
      expect(galleryProgress(full, store.getSnapshot().details).ready).toBe(true)
    } finally { vi.useRealTimers() }
  })
})
