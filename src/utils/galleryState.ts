import type { CatalogItem, Pokemon, Resource } from '../types/pokemon'
import { isPokemonType } from './pokemonTypes'

export function parseGalleryTypes(params: URLSearchParams): string[] {
  return [...new Set(params.getAll('type').map((type) => type.trim().toLowerCase())
    .filter(isPokemonType))].sort()
}

export function gallerySearchParams(types: readonly string[]): URLSearchParams {
  const params = new URLSearchParams()
  const normalized = new URLSearchParams()
  types.forEach((type) => normalized.append('type', type))
  parseGalleryTypes(normalized).forEach((type) => params.append('type', type))
  return params
}

export function galleryHref(types: readonly string[]): string {
  const params = gallerySearchParams(types)
  return `/gallery/${params.size ? `?${params}` : ''}`
}

export function galleryDetailHref(id: number, types: readonly string[]): string {
  const params = new URLSearchParams({ from: 'gallery' })
  gallerySearchParams(types).forEach((value, key) => params.append(key, value))
  return `/pokemon/${id}/?${params}`
}

export function selectGalleryItems(items: readonly Pokemon[], types: readonly string[]): Pokemon[] {
  return items.filter((item) => !types.length || item.types.some((type) => types.includes(type)))
    .sort((a, b) => a.id - b.id)
}

export function galleryProgress(catalog: readonly CatalogItem[], details: Readonly<Record<number, Resource<Pokemon>>>) {
  const items: Pokemon[] = []
  const failures: { id: number; error: Error }[] = []
  let pending = 0
  for (const item of catalog) {
    const resource = details[item.id]
    if (resource?.status === 'success') items.push(resource.data)
    else if (resource?.status === 'error') failures.push({ id: item.id, error: resource.error })
    else pending += 1
  }
  items.sort((a, b) => a.id - b.id)
  return {
    items, failures, pending, total: catalog.length,
    ready: catalog.length > 0 && items.length === catalog.length,
    types: [...new Set(items.flatMap((item) => item.types))].sort(),
  }
}
