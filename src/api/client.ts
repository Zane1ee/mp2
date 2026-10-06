import axios from 'axios'

export const apiClient = axios.create({
  baseURL: 'https://pokeapi.co/api/v2/',
  timeout: 10_000,
})

export class ApiError extends Error {
  kind: 'network' | 'timeout' | 'rate-limit' | 'invalid-data' | 'not-found' | 'unknown'
  retryAt: number | null

  constructor(kind: ApiError['kind'], message: string, retryAt: number | null = null) {
    super(message)
    this.name = 'ApiError'
    this.kind = kind
    this.retryAt = retryAt
  }
}

export function retryAfterTime(value: unknown, now = Date.now()): number | null {
  if (typeof value !== 'string' && typeof value !== 'number') return null
  const text = String(value).trim()
  if (!text) return null
  if (/^\d+(\.\d+)?$/.test(text)) {
    const seconds = Number(text)
    const until = now + Math.ceil(seconds * 1000)
    return Number.isFinite(until) ? until : null
  }
  const date = Date.parse(text)
  return Number.isFinite(date) && date > now ? date : null
}

export function readableError(error: unknown): Error {
  if (error instanceof ApiError) return error
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 429) {
      return new ApiError('rate-limit', 'PokéAPI is busy. Please wait a moment, then retry.',
        retryAfterTime(error.response.headers['retry-after']))
    }
    if (error.response?.status === 404) {
      return new ApiError('not-found', 'This Pokémon could not be found on PokéAPI.')
    }
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      return new ApiError('timeout', 'The request timed out. Check your connection and retry.')
    }
    if (!error.response) {
      return new ApiError('network', 'Unable to reach PokéAPI. Check your connection and retry.')
    }
  }
  return new ApiError('unknown', 'Unable to load Pokémon data. Please try again.')
}
