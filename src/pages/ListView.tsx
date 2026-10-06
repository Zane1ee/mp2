import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router'
import { useCatalog, useDataSource } from '../state/hooks'
import { StatusMessage } from '../components/StatusMessage'
import { displayName, formatNumber } from '../utils/catalog'
import { listDetailHref, listSearchParams, parseListState, selectListItems } from '../utils/listState'
import type { ListState } from '../utils/listState'
import { withMode } from '../utils/dataMode'
import styles from './Views.module.css'

export function ListView() {
  const { mode, repository } = useDataSource()
  const catalog = useCatalog()
  const [params, setParams] = useSearchParams()
  const state = parseListState(params)
  const items = catalog.status === 'success' ? selectListItems(catalog.data, state) : []
  useEffect(() => { document.title = 'Collection | Pokémon Explorer' }, [])

  function update(patch: Partial<ListState>) {
    const next = listSearchParams({ ...state, ...patch })
    if (mode === 'sample') next.set('mode', 'sample')
    setParams(next, { replace: true })
  }

  return (
    <section aria-labelledby="list-title">
      <div className={styles.heading}>
        <p className="eyebrow">THE COLLECTION</p>
        <h1 id="list-title" tabIndex={-1}>Find your next favorite.</h1>
        <p>{mode === 'sample' ? 'Explore six saved API samples.' : 'Explore Pokémon #001–#060.'} Search by name and choose a Pokémon to see its profile.</p>
      </div>
      <div className={styles.toolbar}>
        <div className={styles.searchField}>
          <label htmlFor="pokemon-search">Search Pokémon</label>
          <input id="pokemon-search" type="search" placeholder="Try char or pikachu"
            value={state.query} onChange={(event) => update({ query: event.target.value })} />
        </div>
        <div className={styles.selectField}>
          <label htmlFor="pokemon-sort">Sort by</label>
          <select id="pokemon-sort" value={state.sort} onChange={(event) => {
            update({ sort: event.target.value === 'name' ? 'name' : 'id' })
          }}><option value="id">Number</option><option value="name">Name</option></select>
        </div>
        <div className={styles.selectField}>
          <label htmlFor="pokemon-order">Order</label>
          <select id="pokemon-order" value={state.order} onChange={(event) => {
            update({ order: event.target.value === 'desc' ? 'desc' : 'asc' })
          }}><option value="asc">Ascending</option><option value="desc">Descending</option></select>
        </div>
        <button type="button" className={styles.clearButton} disabled={!state.query}
          onClick={() => update({ query: '' })}>Clear search</button>
      </div>
      {catalog.status === 'idle' || catalog.status === 'loading' ? <StatusMessage /> :
        catalog.status === 'error' ? (
          <StatusMessage error={catalog.error} onRetry={() => {
            void repository.loadCatalog().catch(() => { /* Snapshot handles errors. */ })
          }} />
        ) : (
          <>
            <p className={styles.count} role="status">
              {items.length} of {catalog.data.length} Pokémon · {state.sort === 'id' ? 'Number' : 'Name'} · {state.order === 'asc' ? 'Ascending' : 'Descending'}
            </p>
            {items.length ? (
              <ul className={styles.list}>
                {items.map((item) => (
                  <li key={item.id}>
                    <Link className={styles.row} to={withMode(listDetailHref(item.id, state), mode)}>
                      <span className={styles.number}>{formatNumber(item.id)}</span>
                      <span>{displayName(item.name)}</span>
                      <span className={styles.arrow} aria-hidden="true">↗</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className={styles.empty}>
                <h2>No Pokémon found.</h2>
                <p>Try another name or clear your search to explore the collection.</p>
              </div>
            )}
          </>
        )}
    </section>
  )
}
