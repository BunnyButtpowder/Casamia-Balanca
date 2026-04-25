import { useEffect, useRef } from 'react'
import type Lenis from 'lenis'

// Safari < 16.4 (incl. older iOS) doesn't implement requestIdleCallback.
// Without a fallback, calling it throws and crashes the React tree, leaving
// the page completely blank on those devices.
const requestIdle: (cb: () => void) => number =
  typeof window !== 'undefined' && typeof window.requestIdleCallback === 'function'
    ? (cb) => window.requestIdleCallback(cb)
    : (cb) => window.setTimeout(cb, 1) as unknown as number

const cancelIdle: (id: number) => void =
  typeof window !== 'undefined' && typeof window.cancelIdleCallback === 'function'
    ? (id) => window.cancelIdleCallback(id)
    : (id) => window.clearTimeout(id)

export function useLenis() {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    // Dynamically import Lenis so it doesn't block the critical request chain.
    // The actual init is deferred to idle time after first paint.
    const id = requestIdle(() => {
      import('lenis').then(({ default: Lenis }) => {
        const lenis = new Lenis({
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          touchMultiplier: 2,
        })

        lenisRef.current = lenis

        function raf(time: number) {
          lenis.raf(time)
          requestAnimationFrame(raf)
        }

        requestAnimationFrame(raf)
      })
    })

    return () => {
      cancelIdle(id)
      if (lenisRef.current) {
        lenisRef.current.destroy()
        lenisRef.current = null
      }
    }
  }, [])

  return lenisRef
}
