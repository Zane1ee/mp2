import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router'
import { useDataSource, useGallery } from '../state/hooks'
import { StatusMessage } from '../components/StatusMessage'
import { GalleryStatus } from '../components/GalleryStatus'
import { PokemonImage } from '../components/PokemonImage'
import { displayName, formatNumber } from '../utils/catalog'
import { galleryDetailHref, gallerySearchParams, parseGalleryTypes, selectGalleryItems } from '../utils/galleryState'
import { withMode } from '../utils/dataMode'
import styles from './Views.module.css'

export function GalleryView() {
  const { mode, repository } = useDataSource()
  const gallery = useGallery()
  const [params, setParams] = useSearchParams()
  const selected = parseGalleryTypes(params)
  const items = gallery.ready ? selectGalleryItems(gallery.items, selected) : gallery.items
  const unavailable = selected.filter((type) => !gallery.types.includes(type))
  useEffect(() => { document.title = 'Gallery | Pokémon Explorer' }, [])

  function update(types: string[]) {
    const next = gallerySearchParams(types)
    if (mode === 'sample') next.set('mode', 'sample')
    setParams(next, { replace: true })
  }

  return (
    <section aria-labelledby="gallery-title">
      <div className={styles.heading}>
        <p className="eyebrow">THE GALLERY</p>
        <h1 id="gallery-title" tabIndex={-1}>A closer look.</h1>
        <p>{mode === 'sample' ? 'Browse six saved API samples.' : 'Browse Pokémon #001–#060.'}
          {' '}Choose types to explore their portraits. Multiple types match any selected type.</p>
      </div>
      {gallery.catalog.status === 'idle' || gallery.catalog.status === 'loading' ? <StatusMessage /> :
        gallery.catalog.status === 'error' ? (
          <StatusMessage error={gallery.catalog.error} onRetry={() => {
            void repository.loadGallery(true).catch(() => { /* Snapshot exposes the error. */ })
          }} />
        ) : (
          <>
            <div className={styles.filters}>
              <fieldset disabled={!gallery.ready}>
                <legend>Filter by type</legend>
                <p className={styles.filterHint}>Match any selected type (OR). No selection shows all.</p>
                <div className={styles.typeOptions}>
                  {gallery.types.map((type) => (
                    <label key={type} className={selected.includes(type) ? styles.typeSelected : styles.typeOption}>
                      <input type="checkbox" checked={selected.includes(type)} onChange={(event) => {
                        update(event.target.checked ? [...selected, type] : selected.filter((value) => value !== type))
                      }} />{displayName(type)}
                    </label>
                  ))}
                </div>
              </fieldset>
              <button type="button" disabled={!selected.length} onClick={() => update([])}>Clear filters</button>
            </div>
            <GalleryStatus gallery={gallery} />
            {gallery.ready && unavailable.length > 0 && (
              <p className={styles.contextNotice}>Requested types not present in this collection: {unavailable.map(displayName).join(', ')}. Clear filters to see all.</p>
            )}
            <p className={styles.count} role="status">{gallery.ready
              ? `${items.length} of ${gallery.total} Pokémon · ${selected.length ? selected.map(displayName).join(' or ') : 'All types'}`
              : `${items.length} loaded cards · original filter results are not available yet`}</p>
            {gallery.ready && !items.length ? (
              <div className={styles.empty}><h2>No Pokémon match these types.</h2><p>Clear filters to explore this collection.</p></div>
            ) : (
              <ul className={styles.galleryGrid} aria-busy={gallery.pending > 0}>
                {items.map((item) => (
                  <li key={item.id}>
                    <Link className={styles.galleryCard} to={withMode(galleryDetailHref(item.id, selected), mode)}
                      aria-label={`${formatNumber(item.id)} ${displayName(item.name)} — ${item.types.map(displayName).join(', ')}. View profile`}>
                      <PokemonImage url={item.imageUrl} name={displayName(item.name)} lazy />
                      <div className={styles.cardLabel}>
                        <span className={styles.number}>{formatNumber(item.id)}</span>
                        <h2>{displayName(item.name)}</h2>
                        <p>{item.types.map(displayName).join(' · ')}</p>
                        <span>View profile ↗</span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
    </section>
  )
}
