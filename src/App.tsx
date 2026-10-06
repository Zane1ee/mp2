import { NavLink, Route, Routes, useLocation } from 'react-router'
import { ListView } from './pages/ListView'
import { GalleryView } from './pages/GalleryView'
import { DetailView } from './pages/DetailView'
import { NotFoundView } from './pages/NotFoundView'
import { DataModeNotice } from './components/DataModeNotice'
import { RouteFocus } from './components/RouteFocus'
import { useDataSource } from './state/hooks'
import { withMode } from './utils/dataMode'
import styles from './App.module.css'

function App() {
  const { mode } = useDataSource()
  const { pathname } = useLocation()
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <NavLink className={styles.brand} to={withMode('/list/', mode)}>Pokémon <span>Explorer</span></NavLink>
          <nav aria-label="Primary navigation">
            <NavLink to={withMode(pathname === '/' ? '/' : '/list/', mode)}
              className={({ isActive }) => isActive ? styles.active : styles.navLink}>List</NavLink>
            <NavLink to={withMode('/gallery/', mode)} className={({ isActive }) => isActive ? styles.active : styles.navLink}>Gallery</NavLink>
          </nav>
        </div>
      </header>
      <main id="main" className={styles.main} tabIndex={-1}>
        <DataModeNotice />
        <Routes>
          <Route index element={<ListView />} />
          <Route path="list" element={<ListView />} />
          <Route path="gallery" element={<GalleryView />} />
          <Route path="pokemon/:id" element={<DetailView />} />
          <Route path="*" element={<NotFoundView />} />
        </Routes>
        <RouteFocus />
      </main>
      <footer className={styles.footer}>
        <span>CS409 MP2 · {mode === 'sample' ? '6 saved API samples' : 'Pokémon #001–#060'}</span>
        <a href="https://pokeapi.co/" target="_blank" rel="noreferrer">Data & images via PokéAPI ↗</a>
      </footer>
    </>
  )
}

export default App
