import { useEffect, useRef } from 'react'
import { useParams, useSearchParams, Link } from 'react-router'
import { useCatalog, useDataSource, useGallery, usePokemon } from '../state/hooks'
import { StatusMessage } from '../components/StatusMessage'
import { PokemonImage } from '../components/PokemonImage'
import { DetailNavigation } from '../components/DetailNavigation'
import { detailBackLink } from '../utils/detailNavigation'
import { NotFoundView } from './NotFoundView'
import { displayName, formatNumber, parsePokemonId } from '../utils/catalog'
import { isInDataScope } from '../utils/dataMode'
import styles from './Views.module.css'

export function DetailView() {
  const params = useParams()
  const [searchParams] = useSearchParams()
  const id = parsePokemonId(params.id)
  const { mode, repository } = useDataSource()
  const allowed = id !== null && isInDataScope(id, mode)
  const resource = usePokemon(id)
  const catalog = useCatalog(allowed)
  const gallery = useGallery(allowed && searchParams.get('from') === 'gallery' && searchParams.get('browse') !== 'all')
  const titleRef = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    if (id === null) {
      document.title = 'Page not found | Pokémon Explorer'
    } else if (!allowed) {
      document.title = 'Outside the sample collection | Pokémon Explorer'
    } else if (resource.status === 'success') {
      document.title = `${displayName(resource.data.name)} | Pokémon Explorer`
      titleRef.current?.focus({ preventScroll: true })
      window.scrollTo({ top: 0, behavior: 'auto' })
    } else if (resource.status === 'error') {
      document.title = 'Profile unavailable | Pokémon Explorer'
      titleRef.current?.focus({ preventScroll: true })
    } else {
      document.title = 'Loading profile | Pokémon Explorer'
    }
    return () => { document.title = 'Pokémon Explorer' }
  }, [id, allowed, resource])
  if (id === null) return <NotFoundView />
  const back = detailBackLink(searchParams)
  if (!allowed) return (
    <section aria-labelledby="sample-missing-title">
      <h1 id="sample-missing-title" tabIndex={-1}>Outside the sample collection.</h1>
      <p>This sample includes six Pokémon only. Switch to live data for #001–#060.</p>
      <Link className="text-link" to={back.backHref}>← {back.backLabel}</Link>
    </section>
  )
  return (
    <section aria-label="Pokémon profile">
      <Link className="text-link" to={back.backHref}>
        ← {back.backLabel}
      </Link>
      {resource.status === 'idle' || resource.status === 'loading' ? (
        <div className={styles.profileState}>
          <h1 ref={titleRef} tabIndex={-1}>Loading profile…</h1>
          <StatusMessage />
        </div>
      ) :
        resource.status === 'error' ? (
          <div className={styles.profileState}>
            <h1 ref={titleRef} tabIndex={-1}>Profile unavailable.</h1>
            <StatusMessage error={resource.error} onRetry={() => {
              void repository.loadDetail(id).catch(() => { /* Snapshot handles errors. */ })
            }} />
          </div>
        ) : (
          <div className={styles.detail}>
            <PokemonImage url={resource.data.imageUrl} name={displayName(resource.data.name)} />
            <div>
              <p className="eyebrow">{formatNumber(resource.data.id)} · POKÉMON PROFILE</p>
              <h1 id="detail-title" ref={titleRef} tabIndex={-1}>{displayName(resource.data.name)}</h1>
              <div className={styles.badges}>
                {resource.data.types.map((type) => <span key={type}>{displayName(type)}</span>)}
              </div>
              <dl className={styles.facts}>
                <div><dt>Height</dt><dd>{resource.data.heightMeters === null ? 'Unavailable' : `${resource.data.heightMeters} m`}</dd></div>
                <div><dt>Weight</dt><dd>{resource.data.weightKilograms === null ? 'Unavailable' : `${resource.data.weightKilograms} kg`}</dd></div>
                <div className={styles.wide}><dt>Abilities</dt><dd>{resource.data.abilities.map(displayName).join(', ') || 'Unavailable'}</dd></div>
              </dl>
              <h2>Base stats</h2>
              {resource.data.stats.length ? <dl className={styles.stats}>
                {resource.data.stats.map((stat) => (
                  <div key={stat.name}><dt>{displayName(stat.name)}</dt><dd>{stat.value}</dd></div>
                ))}
              </dl> : <p className={styles.unavailable}>Unavailable</p>}
            </div>
          </div>
        )}
      <DetailNavigation id={id} params={searchParams} catalog={catalog} gallery={gallery} />
    </section>
  )
}
