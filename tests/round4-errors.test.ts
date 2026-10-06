import { describe, expect, it } from 'vitest'
import { retryAfterTime } from '../src/api/client'
import { normalizePokemon } from '../src/api/pokemon'

describe('release review response boundaries', () => {
  it('rejects an overflowing Retry-After instead of creating a permanent cooldown', () => {
    expect(retryAfterTime('9'.repeat(306), 1_700_000_000_000)).toBeNull()
  })
  it('keeps a valid profile with missing media and measurements available', () => {
    const profile = normalizePokemon({ id: 1, name: 'bulbasaur',
      types: [{ type: { name: 'grass' } }], abilities: [], stats: [] }, 1)
    expect(profile).toMatchObject({ id: 1, imageUrl: null, heightMeters: null,
      weightKilograms: null, types: ['grass'], abilities: [], stats: [] })
  })
})
