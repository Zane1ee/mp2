import { useSearchParams } from 'react-router'
import { useDataSource } from '../state/hooks'
import styles from '../App.module.css'

export function DataModeNotice() {
  const [params, setParams] = useSearchParams()
  const { mode } = useDataSource()
  return (
    <aside className={mode === 'sample' ? styles.sampleNotice : styles.dataNotice} aria-label="Data source">
      <div>
        <strong>{mode === 'sample' ? 'Sample mode · 6 saved Pokémon' : 'Live data · Pokémon #001–#060'}</strong>
        <p>{mode === 'sample'
          ? 'Saved PokéAPI responses, not live data. Images still need a network connection.'
          : 'Using PokéAPI. If it is unavailable, you can explicitly switch to six saved samples.'}</p>
        {mode === 'sample' && <a href={`${import.meta.env.BASE_URL}data/pokemon-sample.json`} target="_blank" rel="noreferrer">View source data & capture date ↗</a>}
      </div>
      <button type="button" onClick={() => {
        const next = new URLSearchParams(params)
        if (mode === 'live') next.set('mode', 'sample')
        else next.delete('mode')
        setParams(next)
      }}>{mode === 'sample' ? 'Use live data' : 'Use sample data'}</button>
    </aside>
  )
}
