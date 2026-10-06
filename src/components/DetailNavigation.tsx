import { Link } from 'react-router'
import type { Resource, CatalogItem } from '../types/pokemon'
import { resolveDetailNavigation } from '../utils/detailNavigation'
import { displayName } from '../utils/catalog'
import { StatusMessage } from './StatusMessage'
import { GalleryStatus } from './GalleryStatus'
import { useDataSource } from '../state/hooks'
import type { useGallery } from '../state/hooks'
import styles from '../pages/Views.module.css'

interface DetailNavigationProps {
  id: number
  params: URLSearchParams
  catalog: Resource<CatalogItem[]>
  gallery: ReturnType<typeof useGallery>
}

export function DetailNavigation({ id, params, catalog, gallery }: DetailNavigationProps) {
  const { repository } = useDataSource()
  if (catalog.status === 'idle' || catalog.status === 'loading') {
    return <p role="status" className={styles.navigationStatus}>Loading browsing order…</p>
  }
  if (catalog.status === 'error') {
    return <StatusMessage error={catalog.error} onRetry={() => {
      const request = params.get('from') === 'gallery' && params.get('browse') !== 'all'
        ? repository.loadGallery(true) : repository.loadCatalog()
      void request.catch(() => { /* Snapshot handles errors. */ })
    }} />
  }
  if (params.get('from') === 'gallery' && params.get('browse') !== 'all' && !gallery.ready) {
    return <GalleryStatus gallery={gallery} />
  }
  const navigation = resolveDetailNavigation(catalog.data, id, params, gallery.items)
  function accessibleLabel(direction: string, targetId: number | null) {
    const target = catalog.status === 'success' ? catalog.data.find((item) => item.id === targetId) : null
    return target ? `${direction} Pokémon: ${displayName(target.name)}` : `${direction} Pokémon`
  }
  return (
    <div className={styles.navigationBlock}>
      {navigation.fallback && (
        <p className={styles.contextNotice}>Browsing the full collection instead of the original results.</p>
      )}
      <nav aria-label="Pokémon navigation" className={styles.detailNavigation}>
        {navigation.previousHref ? (
          <Link className={styles.navigationLink} to={navigation.previousHref}
            aria-label={accessibleLabel('Previous', navigation.previousId)}>← Previous</Link>
        ) : <button type="button" disabled aria-label="Previous Pokémon">← Previous</button>}
        <p aria-live="polite">
          <strong>{navigation.position ?? '—'} of {navigation.count}</strong>
          <span>{navigation.label}</span>
        </p>
        {navigation.nextHref ? (
          <Link className={styles.navigationLink} to={navigation.nextHref}
            aria-label={accessibleLabel('Next', navigation.nextId)}>Next →</Link>
        ) : <button type="button" disabled aria-label="Next Pokémon">Next →</button>}
      </nav>
    </div>
  )
}
