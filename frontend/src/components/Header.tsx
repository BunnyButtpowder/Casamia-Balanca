import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Lenis from 'lenis'

const NAV_LEFT = ['Giới thiệu', 'Vị trí', 'Tiện ích']
const NAV_RIGHT = ['Sản phẩm', 'Giá trị', 'Liên hệ']
const NAV_LINK_CLASS =
  'relative text-sm uppercase font-semibold tracking-widest text-[#0F4672] transition-colors hover:text-[#0F4672] after:absolute after:bottom-[-4px] after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 hover:after:scale-x-100'

const navHref = (item: string) => {
  if (item === 'Giới thiệu') return '#about'
  if (item === 'Vị trí') return '#map'
  if (item === 'Tiện ích') return '#features'
  if (item === 'Sản phẩm') return '#products'
  if (item === 'Giá trị') return '#value'
  if (item === 'Liên hệ') return '#contact'
  return '#hero'
}

export default function Header({ lenisRef }: { lenisRef?: React.RefObject<Lenis | null> }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [showDesktopNav, setShowDesktopNav] = useState(true)
  const location = useLocation()
  const navigate = useNavigate()
  const isHome = location.pathname === '/'

  useEffect(() => {
    if (!menuOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [menuOpen])

  useEffect(() => {
    let lastScrollY = window.scrollY

    const updateHeaderState = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY < 24) {
        setShowDesktopNav(true)
      } else if (currentScrollY < lastScrollY) {
        setShowDesktopNav(true)
      } else if (currentScrollY > lastScrollY) {
        setShowDesktopNav(false)
      }

      lastScrollY = currentScrollY
    }

    updateHeaderState()
    window.addEventListener('scroll', updateHeaderState, { passive: true })

    return () => {
      window.removeEventListener('scroll', updateHeaderState)
    }
  }, [])

  const handleNavClick = (href: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!href.startsWith('#') || href === '#') return
    e.preventDefault()
    setMenuOpen(false)

    if (!isHome) {
      navigate('/' + href)
      return
    }

    if (href === '#contact') {
      const target = document.documentElement.scrollHeight - window.innerHeight
      if (lenisRef?.current) {
        lenisRef.current.scrollTo(target, { duration: 1.2 })
      } else {
        window.scrollTo({ top: target, behavior: 'smooth' })
      }
      return
    }

    const el = document.querySelector(href) as HTMLElement | null
    if (!el) return
    if (lenisRef?.current) {
      lenisRef.current.scrollTo(el, { offset: -88 })
    } else {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const logoHref = isHome ? '#hero' : '/'

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-xs">
      <nav className="relative mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4 md:justify-center">
        {/* Mobile: balances hamburger on the right so logo stays centered */}
        <div className="w-10 shrink-0 md:hidden" aria-hidden />

        <div
          className={`hidden items-center gap-8 transition-all duration-300 md:flex ${showDesktopNav ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        >
          {NAV_LEFT.map((item) => (
            <a
              key={item}
              href={navHref(item)}
              className={NAV_LINK_CLASS}
              onClick={handleNavClick(navHref(item))}
            >
              {item}
            </a>
          ))}
        </div>

        <a
          href={logoHref}
          onClick={!isHome ? (e: React.MouseEvent) => { e.preventDefault(); navigate('/') } : undefined}
          className="absolute left-1/2 top-1/2 block -translate-x-1/2 -translate-y-1/2 md:static md:translate-x-0 md:translate-y-0 md:mx-10"
        >
          <img
            src="/logo.png"
            alt="Casamia Balance Hoi An"
            className="h-10 w-auto object-contain sm:h-14"
          />
        </a>

        <div
          className={`hidden items-center gap-8 transition-all duration-300 md:flex ${showDesktopNav ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        >
          {NAV_RIGHT.map((item) => (
            <a
              key={item}
              href={navHref(item)}
              className={NAV_LINK_CLASS}
              onClick={handleNavClick(navHref(item))}
            >
              {item}
            </a>
          ))}
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          className="z-50 flex h-10 w-10 shrink-0 flex-col items-center justify-center gap-1.5 md:hidden"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span
            className={`h-0.5 w-6 rounded bg-secondary transition-transform duration-300 ${menuOpen ? 'translate-y-2 rotate-45' : ''}`}
          />
          <span
            className={`h-0.5 w-6 rounded bg-secondary transition-opacity duration-300 ${menuOpen ? 'opacity-0' : ''}`}
          />
          <span
            className={`h-0.5 w-6 rounded bg-secondary transition-transform duration-300 ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`}
          />
        </button>
      </nav>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-40 flex min-h-dvh flex-col items-center justify-center gap-6 overflow-y-auto bg-white/95 px-6 py-8 pt-[max(2rem,env(safe-area-inset-top))] pb-[max(2rem,env(safe-area-inset-bottom))] backdrop-blur-sm transition-opacity duration-300 md:hidden ${menuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
        aria-hidden={!menuOpen}
      >
        {[...NAV_LEFT, ...NAV_RIGHT].map((item) => (
          <a
            key={item}
            href={navHref(item)}
            className="shrink-0 text-center text-lg font-medium tracking-widest text-secondary"
            onClick={handleNavClick(navHref(item))}
          >
            {item}
          </a>
        ))}
      </div>
    </header>
  )
}
