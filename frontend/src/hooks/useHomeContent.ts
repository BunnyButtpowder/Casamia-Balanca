import { useState, useEffect } from 'react'
import { api } from '../services/api'
import type { AllSections } from '../types/sections'

// Start fetching immediately at module-load time (before React mounts)
// so the API call runs in parallel with React hydration
let prefetchPromise: Promise<Record<string, unknown>> | null = api.getSections()

export function useHomeContent() {
  const [data, setData] = useState<AllSections | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    // Use the prefetched promise if available, otherwise fetch fresh
    const dataPromise = prefetchPromise ?? api.getSections()
    // Clear so subsequent mounts do a fresh fetch
    prefetchPromise = null

    dataPromise
      .then((sections) => {
        if (!cancelled) {
          setData(sections as unknown as AllSections)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          console.error('Failed to load home content:', err)
          setError(err.message)
          setLoading(false)
        }
      })

    return () => { cancelled = true }
  }, [])

  return { data, loading, error }
}
