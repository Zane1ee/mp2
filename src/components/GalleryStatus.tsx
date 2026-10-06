import type { useGallery } from '../state/hooks'
import { useDataSource } from '../state/hooks'
import { useRetryCooldown } from '../state/retryCooldown'
import { formatNumber } from '../utils/catalog'
import styles from '../pages/Views.module.css'

export function GalleryStatus({ gallery }: { gallery: ReturnType<typeof useGallery> }) {
  const { repository } = useDataSource()
  const remaining = useRetryCooldown(gallery.failures.map(({ error }) => error))
  if (gallery.ready) return null
  return (
    <div className={styles.galleryStatus}>
      <p role="status">{gallery.items.length} of {gallery.total} profiles loaded
        {gallery.pending > 0 ? ` · ${gallery.pending} pending` : ''}.
        {' '}Filters and gallery navigation unlock when every profile is available.</p>
      {gallery.failures.length > 0 && (
        <div>
          <div role="alert">
            <p>{gallery.failures.length} {gallery.failures.length === 1 ? 'profile' : 'profiles'} failed: {gallery.failures.map(({ id }) => formatNumber(id)).join(', ')}.</p>
            <p>{gallery.failures[0].error.message}</p>
          </div>
          <button type="button" disabled={gallery.pending > 0 || remaining > 0}
            onClick={() => {
              document.querySelector<HTMLElement>('#main h1')?.focus({ preventScroll: true })
              void repository.loadGallery(true).catch(() => { /* Snapshot exposes the error. */ })
            }}>
            {remaining ? `Retry failed profiles in ${remaining}s` : 'Retry failed profiles'}
          </button>
        </div>
      )}
    </div>
  )
}
