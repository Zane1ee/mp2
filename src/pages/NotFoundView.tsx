import { Link } from 'react-router'
import { useEffect } from 'react'
import { useDataSource } from '../state/hooks'
import { withMode } from '../utils/dataMode'
import styles from './Views.module.css'

export function NotFoundView() {
  const { mode } = useDataSource()
  useEffect(() => { document.title = 'Page not found | Pokémon Explorer' }, [])
  return (
    <section className={styles.heading}>
      <p className="eyebrow">NOT FOUND</p>
      <h1 tabIndex={-1}>Let’s find your way back.</h1>
      <p>This page is not in the {mode === 'sample' ? 'six-item sample' : 'Pokémon #001–#060'} collection.</p>
      <Link className="text-link" to={withMode('/list/', mode)}>Browse the collection →</Link>
    </section>
  )
}
