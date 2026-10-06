import { apiClient, ApiError } from './client'
import type { CatalogItem, Pokemon } from '../types/pokemon'
import { CATALOG_SIZE, parsePokemonId } from '../utils/catalog'
import { isPokemonType } from '../utils/pokemonTypes'

type JsonObject = Record<string, unknown>

function object(value: unknown): JsonObject {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as JsonObject
  }
  throw new ApiError('invalid-data', 'PokéAPI returned an unexpected data format.')
}

function array(value: unknown): unknown[] {
  if (!Array.isArray(value)) {
    throw new ApiError('invalid-data', 'PokéAPI returned an incomplete response.')
  }
  return value
}

function name(value: unknown): string {
  if (typeof value !== 'string' || !value.trim()) {
    throw new ApiError('invalid-data', 'PokéAPI returned an invalid name.')
  }
  return value
}

function nonnegativeNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : null
}

function imageUrl(value: unknown): string | null {
  if (typeof value !== 'string') return null
  try {
    return new URL(value).protocol === 'https:' ? value : null
  } catch {
    return null
  }
}

export function normalizeCatalog(raw: unknown): CatalogItem[] {
  const rows = array(object(raw).results)
  const items = rows.map((row) => {
    const value = object(row)
    if (typeof value.url !== 'string') {
      throw new ApiError('invalid-data', 'PokéAPI returned an invalid Pokémon address.')
    }
    let address: URL
    try { address = new URL(value.url) } catch {
      throw new ApiError('invalid-data', 'PokéAPI returned an invalid Pokémon address.')
    }
    const match = /^\/api\/v2\/pokemon\/(\d+)\/$/.exec(address.pathname)
    const id = parsePokemonId(match?.[1])
    if (address.origin !== 'https://pokeapi.co' || id === null) {
      throw new ApiError('invalid-data', 'PokéAPI returned an unexpected catalog item.')
    }
    return { id, name: name(value.name) }
  }).sort((a, b) => a.id - b.id)

  if (items.length !== CATALOG_SIZE || items.some((item, index) => item.id !== index + 1)) {
    throw new ApiError('invalid-data', 'The #001–#060 catalog is incomplete. Please retry.')
  }
  return items
}

export function normalizePokemon(raw: unknown, expectedId: number): Pokemon {
  const value = object(raw)
  if (value.id !== expectedId || parsePokemonId(String(value.id)) === null) {
    throw new ApiError('invalid-data', 'PokéAPI returned a different Pokémon than requested.')
  }
  // Media is optional: a missing sprite group must not hide an otherwise valid profile.
  const sprites = value.sprites && typeof value.sprites === 'object' && !Array.isArray(value.sprites)
    ? value.sprites as JsonObject : {}
  const other = sprites.other
  const artwork = other && typeof other === 'object'
    ? (other as JsonObject)['official-artwork'] : null
  const artworkImage = artwork && typeof artwork === 'object'
    ? (artwork as JsonObject).front_default : null
  const height = nonnegativeNumber(value.height)
  const weight = nonnegativeNumber(value.weight)
  const types = array(value.types).map((entry) => name(object(object(entry).type).name))
  if (!types.length || types.some((type) => !isPokemonType(type)) || new Set(types).size !== types.length) {
    throw new ApiError('invalid-data', 'PokéAPI returned invalid types. Please retry this profile.')
  }
  return {
    id: expectedId,
    name: name(value.name),
    imageUrl: imageUrl(artworkImage) ?? imageUrl(sprites.front_default),
    types,
    heightMeters: height === null ? null : height / 10,
    weightKilograms: weight === null ? null : weight / 10,
    abilities: array(value.abilities).map((entry) => name(object(object(entry).ability).name)),
    stats: array(value.stats).map((entry) => {
      const stat = object(entry)
      const statValue = nonnegativeNumber(stat.base_stat)
      if (statValue === null) throw new ApiError('invalid-data', 'PokéAPI returned an invalid stat.')
      return { name: name(object(stat.stat).name), value: statValue }
    }),
  }
}

export interface PokemonApi {
  catalog: () => Promise<CatalogItem[]>
  detail: (id: number) => Promise<Pokemon>
}

export const pokemonApi: PokemonApi = {
  async catalog() {
    const response = await apiClient.get<unknown>('pokemon', {
      params: { limit: CATALOG_SIZE, offset: 0 },
    })
    return normalizeCatalog(response.data)
  },
  async detail(id) {
    const response = await apiClient.get<unknown>(`pokemon/${id}/`)
    return normalizePokemon(response.data, id)
  },
}
