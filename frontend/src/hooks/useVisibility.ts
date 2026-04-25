import { useEffect, useState } from 'react'

/**
 * Returns whether the page is currently visible (tab is active).
 * Used to pause expensive work (carousel timers) when the user switches tabs.
 */
export function usePageVisible() {
  const [visible, setVisible] = useState(!document.hidden)

  useEffect(() => {
    const onChange = () => setVisible(!document.hidden)
    document.addEventListener('visibilitychange', onChange)
    return () => document.removeEventListener('visibilitychange', onChange)
  }, [])

  return visible
}
