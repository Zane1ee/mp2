import { useEffect } from 'react'
import { useLocation } from 'react-router'

export function RouteFocus() {
  const { pathname } = useLocation()
  useEffect(() => {
    const target = document.querySelector<HTMLElement>('#main h1')
      ?? document.getElementById('main')
    target?.focus({ preventScroll: true })
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [pathname])
  // Query edits keep focus in their controls; only a different view resets it.
  return null
}
