import { useEffect, useRef } from 'react'
import type Lenis from 'lenis'

export function useLenis() {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    // Dynamically import Lenis so it doesn't block the critical request chain.
    // The actual init is deferred to idle time after first paint.
    const id = requestIdleCallback(() => {
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
      cancelIdleCallback(id)
      if (lenisRef.current) {
        lenisRef.current.destroy()
        lenisRef.current = null
      }
    }
  }, [])

  return lenisRef
}
