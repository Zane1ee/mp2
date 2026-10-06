import { useRetryCooldown } from '../state/retryCooldown'

interface StatusMessageProps {
  error?: Error
  onRetry?: () => void
}

export function StatusMessage({ error, onRetry }: StatusMessageProps) {
  const remaining = useRetryCooldown(error ? [error] : [])
  if (!error) return <p role="status" className="status-message">Loading Pokémon…</p>
  return (
    <div className="status-message status-error">
      <p role="alert">{error.message}</p>
      {onRetry && <button type="button" disabled={remaining > 0} onClick={() => {
        document.querySelector<HTMLElement>('#main h1')?.focus({ preventScroll: true })
        onRetry()
      }}>
        {remaining ? `Retry in ${remaining}s` : 'Retry'}
      </button>}
    </div>
  )
}
