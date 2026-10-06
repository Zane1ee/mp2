import { useSyncExternalStore } from 'react'
import { ApiError } from '../api/client'

function subscribeClock(listener: () => void) {
  const timer = window.setInterval(listener, 1000)
  return () => window.clearInterval(timer)
}
const clockSnapshot = () => Math.floor(Date.now() / 1000)
const zeroSnapshot = () => 0
const noSubscription = () => () => {}

export function useRetryCooldown(errors: readonly Error[]) {
  const retryAt = Math.max(0, ...errors.map((error) => error instanceof ApiError ? error.retryAt ?? 0 : 0))
  const now = useSyncExternalStore(retryAt ? subscribeClock : noSubscription, retryAt ? clockSnapshot : zeroSnapshot)
  return Math.max(0, Math.ceil(retryAt / 1000) - now)
}
