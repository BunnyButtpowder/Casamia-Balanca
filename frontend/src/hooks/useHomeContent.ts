import { useState, useEffect } from 'react'
import { api } from '../services/api'
import type { AllSections } from '../types/sections'

export function useHomeContent() {
  const [data, setData] = useState<AllSections | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    api.getSections()
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
