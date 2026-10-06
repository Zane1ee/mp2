import { useState } from 'react'
import styles from './PokemonImage.module.css'

interface PokemonImageProps {
  url: string | null
  name: string
  lazy?: boolean
}

export function PokemonImage({ url, name, lazy = false }: PokemonImageProps) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null)
  return (
    <div className={styles.frame}>
      {url && url !== failedUrl ? (
        <img src={url} alt={name} width="320" height="320" loading={lazy ? 'lazy' : 'eager'}
          onError={() => setFailedUrl(url)} />
      ) : <p className={styles.placeholder}>Image unavailable</p>}
    </div>
  )
}
