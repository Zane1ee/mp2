import axios from 'axios'
import { ApiError } from './client'
import { normalizePokemon } from './pokemon'
import type { PokemonApi } from './pokemon'
import type { Pokemon } from '../types/pokemon'
import { SAMPLE_IDS } from '../utils/dataMode'

export interface SampleBundle {
  source: string
  capturedAt: string
  pokemon: Pokemon[]
}

export function normalizeSampleBundle(raw: unknown): SampleBundle {
  if (!raw || typeof raw !== 'object') throw new ApiError('invalid-data', 'Invalid sample file.')
  const value = raw as Record<string, unknown>
  if (value.source !== 'https://pokeapi.co/api/v2/' || typeof value.capturedAt !== 'string'
    || !Number.isFinite(Date.parse(value.capturedAt)) || !Array.isArray(value.ids)
    || value.ids.length !== SAMPLE_IDS.length || value.ids.some((id, index) => id !== SAMPLE_IDS[index])
    || !Array.isArray(value.pokemon) || value.pokemon.length !== SAMPLE_IDS.length) {
    throw new ApiError('invalid-data', 'The six-item sample file is incomplete or has no valid source.')
  }
  const pokemon = value.pokemon.map((item, index) => normalizePokemon(item, SAMPLE_IDS[index]))
  return { source: value.source, capturedAt: value.capturedAt, pokemon }
}

export function createSampleApi(read: () => Promise<unknown>): PokemonApi {
  let request: Promise<SampleBundle> | null = null
  function bundle() {
    if (!request) {
      request = read().then(normalizeSampleBundle).catch((error: unknown) => {
        request = null
        if (error instanceof ApiError) throw error
        throw new ApiError('network', 'Unable to load the local sample file. Check your connection and retry.')
      })
    }
    return request
  }
  return {
    async catalog() {
      return (await bundle()).pokemon.map(({ id, name }) => ({ id, name }))
    },
    async detail(id) {
      const item = (await bundle()).pokemon.find((pokemon) => pokemon.id === id)
      if (!item) throw new ApiError('not-found', 'This Pokémon is outside the six-item sample collection.')
      return item
    },
  }
}

const sampleClient = axios.create({ baseURL: import.meta.env.BASE_URL, timeout: 10_000 })
export const sampleApi = createSampleApi(async () => {
  return (await sampleClient.get<unknown>('data/pokemon-sample.json')).data
})
