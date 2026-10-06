export interface CatalogItem {
  id: number
  name: string
}

export interface PokemonStat {
  name: string
  value: number
}

export interface Pokemon extends CatalogItem {
  imageUrl: string | null
  types: string[]
  heightMeters: number | null
  weightKilograms: number | null
  abilities: string[]
  stats: PokemonStat[]
}

export type Resource<T> =
  | { status: 'idle'; data: null; error: null }
  | { status: 'loading'; data: null; error: null }
  | { status: 'success'; data: T; error: null }
  | { status: 'error'; data: null; error: Error }

export const idleResource = <T>(): Resource<T> => ({
  status: 'idle', data: null, error: null,
})
