import { createPokemonRepository, pokemonRepository } from './pokemonRepository'
import { sampleApi } from '../api/sample'
import type { DataMode } from '../utils/dataMode'

const sampleRepository = createPokemonRepository(sampleApi)

export function repositoryFor(mode: DataMode) {
  return mode === 'sample' ? sampleRepository : pokemonRepository
}
