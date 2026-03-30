import { useState, useRef, useEffect } from 'react'
import { useLenis } from './hooks/useLenis'
import { MapPin, ChevronLeft, ChevronRight, Phone } from 'lucide-react'

const NAV_LEFT = ['Giới thiệu', 'Vị trí', 'Tiện ích']
const NAV_RIGHT = ['Sản phẩm', 'Giá trị', 'Liên hệ']
const NAV_LINK_CLASS =
  'relative text-sm uppercase font-semibold tracking-widest text-[#0F4672] transition-colors hover:text-[#0F4672] after:absolute after:bottom-[-4px] after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 hover:after:scale-x-100'

function App() {
  useLenis()
  const [menuOpen, setMenuOpen] = useState(false)
  const [carouselCat, setCarouselCat] = useState('all')
  const contentRef = useRef<HTMLDivElement>(null)
  const footerRef = useRef<HTMLElement>(null)
  const spacerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const content = contentRef.current
    const footer = footerRef.current
    const spacer = spacerRef.current
    if (!content || !footer || !spacer) return

    const updateLayout = () => {
      const contentH = content.offsetHeight
      const footerH = footer.offsetHeight
      spacer.style.height = `${footerH}px`
      content.style.top = `${-(contentH - window.innerHeight)}px`
    }
    updateLayout()

    const ro = new ResizeObserver(updateLayout)
    ro.observe(content)
    ro.observe(footer)
    window.addEventListener('resize', updateLayout)

    let rafId = 0
    const handleScroll = () => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        const spacerRect = spacer.getBoundingClientRect()
        const fh = footer.offsetHeight
        if (spacerRect.top < window.innerHeight) {
          const p = Math.min((window.innerHeight - spacerRect.top) / fh, 1)
          const eased = 1 - (1 - p) * (1 - p) * (1 - p)
          footer.style.transform = `translateY(${(1 - eased) * 100}%)`
        } else {
          footer.style.transform = 'translateY(100%)'
        }
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', updateLayout)
      ro.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [menuOpen])

  const allSlides = [
    {
      src: '/carousel-1.png',
      title: 'Công viên chủ đề và các tuyến phố cây xanh',
      desc: 'Hệ thống cây xanh, mặt nước được kết nối, xếp lớp  tạo nên lá phổi xanh, đảm bảo chất lượng không khí thuần khiết cho khu đô thị.',
      cat: 'landscape',
    },
    {
      src: '/carousel-2.jpg',
      title: 'Tiện ích sống chăm sóc sức khoẻ hàng ngày',
      desc: 'Hồ bơi tràn viền hướng biển, mang đến trải nghiệm nghỉ dưỡng đẳng cấp quốc tế.',
      cat: 'service',
    },
    {
      src: '/carousel-3.jpg',
      title: 'Tiện ích nghỉ dưỡng chuyên sâu',
      desc: 'Không gian giải trí thượng lưu với tầm nhìn toàn cảnh sông nước và hoàng hôn.',
      cat: 'service',
    },
  ]

  const carouselSlides = carouselCat === 'all' ? allSlides : allSlides.filter((s) => s.cat === carouselCat)

  const [slideIdx, setSlideIdx] = useState(1)
  const [animate, setAnimate] = useState(true)

  // Exterior carousel
  const exteriorImages = [
    '/carousel-1.png',
    '/carousel-2.jpg',
    '/carousel-3.jpg',
  ]
  const [extIdx, setExtIdx] = useState(0)
  const extMax = exteriorImages.length - 1
  const extPrev = () => setExtIdx((i) => Math.max(0, i - 1))
  const extNext = () => setExtIdx((i) => Math.min(extMax, i + 1))

  const [extDragOffset, setExtDragOffset] = useState(0)
  const extDragRef = useRef<{ startX: number; startY: number; locked: boolean | null; startTime: number } | null>(null)
  const extTrackRef = useRef<HTMLDivElement>(null)
  const extIsFirst = extIdx === 0
  const extIsLast = extIdx === extMax

  const handleExtTouchStart = (e: React.TouchEvent) => {
    extDragRef.current = { startX: e.touches[0].clientX, startY: e.touches[0].clientY, locked: null, startTime: Date.now() }
  }
  const handleExtTouchMove = (e: React.TouchEvent) => {
    if (!extDragRef.current) return
    const dx = e.touches[0].clientX - extDragRef.current.startX
    const dy = e.touches[0].clientY - extDragRef.current.startY
    if (extDragRef.current.locked === null) {
      if (Math.abs(dx) > 8 || Math.abs(dy) > 8) {
        extDragRef.current.locked = Math.abs(dx) > Math.abs(dy)
      }
      return
    }
    if (!extDragRef.current.locked) return
    e.preventDefault()
    const atEdge = (extIsFirst && dx > 0) || (extIsLast && dx < 0)
    setExtDragOffset(atEdge ? dx * 0.2 : dx)
  }
  const handleExtTouchEnd = (e: React.TouchEvent) => {
    if (!extDragRef.current || !extDragRef.current.locked) {
      extDragRef.current = null
      setExtDragOffset(0)
      return
    }
    const dx = e.changedTouches[0].clientX - extDragRef.current.startX
    const elapsed = Date.now() - extDragRef.current.startTime
    const velocity = Math.abs(dx) / elapsed
    const containerW = extTrackRef.current?.parentElement?.offsetWidth ?? window.innerWidth
    const threshold = containerW * 0.2
    setExtDragOffset(0)
    if (!extIsLast && (dx < -threshold || (velocity > 0.3 && dx < 0))) {
      extNext()
    } else if (!extIsFirst && (dx > threshold || (velocity > 0.3 && dx > 0))) {
      extPrev()
    }
    extDragRef.current = null
  }

  const productSlides = [
    {
      src: '/carousel-5.png',
      title: 'Biệt thự đơn lập',
      specs: [
        { label: 'QUY MÔ', value: '270 căn' },
        { label: 'LOẠI HÌNH', value: 'Biệt thự đơn lập' },
        { label: 'DIỆN TÍCH', value: '80 m²' },
        { label: 'QUY MÔ', value: '270 căn' },
        { label: 'LOẠI HÌNH', value: 'Biệt thự đơn lập' },
        { label: 'DIỆN TÍCH', value: '80 m²' },
      ],
    },
    {
      src: '/carousel-1.png',
      title: 'Biệt thự song lập',
      specs: [
        { label: 'QUY MÔ', value: '180 căn' },
        { label: 'LOẠI HÌNH', value: 'Biệt thự song lập' },
        { label: 'DIỆN TÍCH', value: '150–250 m²' },
        { label: 'QUY MÔ', value: '180 căn' },
        { label: 'LOẠI HÌNH', value: 'Biệt thự song lập' },
        { label: 'DIỆN TÍCH', value: '150–250 m²' },
      ],
    },
    {
      src: '/carousel-2.jpg',
      title: 'Nhà phố thương mại',
      specs: [
        { label: 'QUY MÔ', value: '320 căn' },
        { label: 'LOẠI HÌNH', value: 'Nhà phố thương mại' },
        { label: 'DIỆN TÍCH', value: '80–120 m²' },
        { label: 'QUY MÔ', value: '320 căn' },
        { label: 'LOẠI HÌNH', value: 'Nhà phố thương mại' },
        { label: 'DIỆN TÍCH', value: '80–120 m²' },
      ],
    },
    {
      src: '/carousel-3.jpg',
      title: 'Căn hộ nghỉ dưỡng',
      specs: [
        { label: 'QUY MÔ', value: '450 căn' },
        { label: 'LOẠI HÌNH', value: 'Căn hộ nghỉ dưỡng' },
        { label: 'DIỆN TÍCH', value: '45–90 m²' },
        { label: 'QUY MÔ', value: '450 căn' },
        { label: 'LOẠI HÌNH', value: 'Căn hộ nghỉ dưỡng' },
        { label: 'DIỆN TÍCH', value: '45–90 m²' },
      ],
    },
  ]
  const [prodIdx, setProdIdx] = useState(0)
  const prodPrev = () => setProdIdx((i) => (i === 0 ? productSlides.length - 1 : i - 1))
  const prodNext = () => setProdIdx((i) => (i === productSlides.length - 1 ? 0 : i + 1))

  const handleCatChange = (cat: string) => {
    setCarouselCat(cat)
    setAnimate(false)
    setSlideIdx(1)
  }

  const extendedSlides = [
    carouselSlides[carouselSlides.length - 1],
    ...carouselSlides,
    carouselSlides[0],
  ]

  const prevSlide = () => { setAnimate(true); setSlideIdx((i) => i - 1) }
  const nextSlide = () => { setAnimate(true); setSlideIdx((i) => i + 1) }

  const [dragOffset, setDragOffset] = useState(0)
  const dragRef = useRef<{ startX: number; startY: number; locked: boolean | null; startTime: number } | null>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    setAnimate(false)
    dragRef.current = { startX: e.touches[0].clientX, startY: e.touches[0].clientY, locked: null, startTime: Date.now() }
  }
  const isFirst = slideIdx <= 1
  const isLast = slideIdx >= carouselSlides.length

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!dragRef.current) return
    const dx = e.touches[0].clientX - dragRef.current.startX
    const dy = e.touches[0].clientY - dragRef.current.startY
    if (dragRef.current.locked === null) {
      if (Math.abs(dx) > 8 || Math.abs(dy) > 8) {
        dragRef.current.locked = Math.abs(dx) > Math.abs(dy)
      }
      return
    }
    if (!dragRef.current.locked) return
    e.preventDefault()
    const atEdge = (isFirst && dx > 0) || (isLast && dx < 0)
    setDragOffset(atEdge ? dx * 0.2 : dx)
  }
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!dragRef.current || !dragRef.current.locked) {
      dragRef.current = null
      setDragOffset(0)
      return
    }
    const dx = e.changedTouches[0].clientX - dragRef.current.startX
    const elapsed = Date.now() - dragRef.current.startTime
    const velocity = Math.abs(dx) / elapsed
    const containerW = trackRef.current?.parentElement?.offsetWidth ?? window.innerWidth
    const threshold = containerW * 0.2
    setAnimate(true)
    setDragOffset(0)
    if (!isLast && (dx < -threshold || (velocity > 0.3 && dx < 0))) {
      nextSlide()
    } else if (!isFirst && (dx > threshold || (velocity > 0.3 && dx > 0))) {
      prevSlide()
    }
    dragRef.current = null
  }

  const handleCarouselTransitionEnd = () => {
    if (slideIdx === 0) {
      setAnimate(false)
      setSlideIdx(carouselSlides.length)
    } else if (slideIdx === extendedSlides.length - 1) {
      setAnimate(false)
      setSlideIdx(1)
    }
  }

  return (
    <div className="min-h-screen overflow-x-clip">
      <div ref={contentRef} className="sticky">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-xs">
          <nav className="relative mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4 md:justify-center">
            {/* Mobile: balances hamburger on the right so logo stays centered */}
            <div className="w-10 shrink-0 md:hidden" aria-hidden />

            <div className="hidden items-center gap-8 md:flex">
              {NAV_LEFT.map((item) => (
                <a key={item} href="#" className={NAV_LINK_CLASS}>
                  {item}
                </a>
              ))}
            </div>

            <a
              href="#"
              className="absolute left-1/2 top-1/2 block -translate-x-1/2 -translate-y-1/2 md:static md:translate-x-0 md:translate-y-0 md:mx-10"
            >
              <img
                src="/logo.png"
                alt="Casamia Balance Hoi An"
                className="h-10 w-auto object-contain sm:h-14"
              />
            </a>

            <div className="hidden items-center gap-8 md:flex">
              {NAV_RIGHT.map((item) => (
                <a key={item} href="#" className={NAV_LINK_CLASS}>
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

          {/* Mobile menu overlay — full viewport, safe areas, no click-through when closed */}
          <div
            className={`fixed inset-0 z-40 flex min-h-dvh flex-col items-center justify-center gap-6 overflow-y-auto bg-white/95 px-6 py-8 pt-[max(2rem,env(safe-area-inset-top))] pb-[max(2rem,env(safe-area-inset-bottom))] backdrop-blur-sm transition-opacity duration-300 md:hidden ${menuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
            aria-hidden={!menuOpen}
          >
            {[...NAV_LEFT, ...NAV_RIGHT].map((item) => (
              <a
                key={item}
                href="#"
                className="shrink-0 text-center text-lg font-medium tracking-widest text-secondary"
                onClick={() => setMenuOpen(false)}
              >
                {item}
              </a>
            ))}
          </div>
        </header>

        {/* Hero */}
        <section className="relative flex h-screen items-center justify-center overflow-hidden rounded-b-4xl">
          <video
            src="/hero.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative z-10 px-4 text-center sm:px-6">
            <h1 className="leading-tight font-light text-white">
              <span className="-ml-6 flex items-center justify-center gap-3 sm:-ml-10 md:-ml-27">
                <span className="text-7xl font-alishanty md:text-7xl">Sống</span>
                <span className="text-5xl font-sagire md:text-5xl">đủ sâu</span>
              </span>
              <span className=" flex items-center justify-center gap-3 sm:ml-10 md:ml-29">
                <span className="text-7xl font-alishanty md:text-7xl">Giữ</span>
                <span className="text-5xl font-sagire md:text-5xl">đủ lâu</span>
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-xl text-white uppercase sm:mt-4 sm:text-base">
              Đâu là điều quý giá nhất <br className="block md:hidden" /> đời người?
            </p>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-0 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center">
            <div className="h-[27vh] w-px bg-[#fff7e953] sm:h-[26vh]" />
            <img
              src="/scroll-down.png"
              alt="Scroll down"
              className="my-2 h-8 w-8 object-contain sm:h-10 sm:w-10"
            />
            <div className="h-6 w-px bg-[#fff7e953]" />
          </div>
        </section>

        {/* About */}
        <section id="about">
          <div className="relative">
            <img
              src="/vector.png"
              alt=""
              className="h-full w-full object-cover"
            />
            <div className="absolute -bottom-50 left-1/2 z-10 mx-auto w-full max-w-sm md:max-w-4xl -translate-x-1/2 px-6 text-center sm:bottom-12 md:bottom-24">
              <div className="font-sagire font-light leading-snug text-secondary sm:flex sm:items-center sm:justify-center sm:gap-3">
                <span className="block text-4xl sm:inline sm:text-3xl md:text-6xl">
                  Là mỗi ngày
                </span>
                <span className="text-4xl sm:text-3xl md:text-6xl">
                  sống{' '}
                </span>
                <span className="text-[3rem] sm:text-4xl md:text-7xl">Khoẻ</span>
              </div>
              <div className="font-sagire font-light leading-snug text-secondary sm:flex sm:items-center sm:justify-center sm:gap-3">
                <span className="block text-4xl sm:inline sm:text-3xl md:text-6xl">
                  Là nếp nhà
                </span>
                <span className="text-4xl sm:text-3xl md:text-6xl">
                  sống{' '}
                </span>
                <span className="text-[3rem] sm:text-4xl md:text-7xl">An</span>
              </div>
            </div>
            <img
              src="/leaf.png"
              alt=""
              className="pointer-events-none absolute -bottom-10 -right-35 w-70 object-contain sm:bottom-0 sm:-right-40 md:-right-110 md:w-auto"
            />
          </div>

          {/* Video thumbnail */}
          <div className="group relative top-55 mx-auto max-w-6xl px-4 sm:-top-10 sm:px-6 lg:px-0">
            <div className="overflow-hidden inverted-corners-lg">
              <img
                src="/img.png"
                alt=""
                className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
            </div>
            <img
              src="/play-icon.png"
              alt="Play"
              className="pointer-events-none absolute top-1/2 left-1/2 z-20 h-12 w-12 -translate-x-1/2 -translate-y-1/2 object-contain sm:h-14 sm:w-14 md:h-16 md:w-16"
            />
          </div>

          <div className="relative">
            <img
              src="/leaf.png"
              alt=""
              className="pointer-events-none absolute top-0 left-4 w-90 md:w-auto object-contain sm:-top-45 sm:-left-20 sm:block z-10"
            />
            <img
              src="/gradient-from-t.png"
              alt=""
              className="pointer-events-none absolute top-30 md:top-0 md:left-0 w-screen object-cover"
            />
            <div className="absolute top-35 left-0 z-20 flex w-screen flex-col items-center font-light text-secondary">
              <div className="flex flex-col items-center sm:flex-row sm:justify-center md:items-start sm:gap-5">
                <span className="font-sagire text-7xl sm:text-3xl md:text-7xl">
                  An tâm
                </span>
                <span className="font-alishanty text-6xl sm:text-4xl md:text-8xl">giữa thiên nhiên</span>
              </div>
              <div className="flex flex-col items-center sm:flex-row sm:justify-center md:items-start sm:gap-5">
                <span className="font-sagire text-7xl sm:text-3xl md:text-7xl">
                  An lành
                </span>
                <span className="font-alishanty text-6xl sm:text-4xl md:text-8xl">từng hơi thở</span>
              </div>
            </div>
            <img
              src="/3.png"
              alt=""
              className="mt-10 w-full object-contain hidden md:block sm:mt-14 md:mt-20 rounded-b-3xl"
            />
            <img
              src="/3-mobile.png"
              alt=""
              className="mt-60 w-full object-contain md:hidden rounded-b-3xl"
            />
            {/* Stats card */}
            <div className="absolute bottom-0 mb-20 md:bottom-0 left-1/2 md:mb-10 w-[calc(100%-2rem)] max-w-6xl -translate-x-1/2 rounded-2xl bg-[#FFFFFFCC] px-6 py-8 backdrop-blur-xs sm:w-full sm:px-0 sm:py-5 sm:pr-7">
              <p className="mx-auto max-w-3xl text-center text-sm font-medium leading-relaxed text-black sm:text-base">
                Địa thế đắc địa hiếm có, Casamia Balanca là nơi mỗi ngày cư dân sống an,
              </p>
              <p className=" mx-auto max-w-3xl text-center text-sm font-medium leading-relaxed text-black sm:text-base">
                sống khỏe cùng hệ sinh thái sống - rừng dừa - biển duy nhất tại Hội An.
              </p>
              <div className="mt-5 grid grid-cols-2 gap-x-0 gap-y-8 sm:mt-5 sm:grid-cols-3 sm:gap-6 md:grid-cols-6 md:gap-0">
                {[
                  { label: 'Tổng\nquy mô', value: '31,1 ha' },
                  { label: 'Rừng dừa nước\ntự nhiên', value: '3,6 ha' },
                  { label: 'Diện tích mặt nước\ntự nhiên', value: '80%' },
                  { label: 'Mật độ\nxây dựng', value: '23,1%' },
                  { label: 'Diện tích dành cho\ncây xanh & mặt nước', value: '1/3' },
                  { label: 'Diện tích đất\nthương mại, dịch vụ', value: '9%' },
                ].map((stat, i) => (
                  <div
                    key={stat.value}
                    className={`text-center px-1${i % 2 !== 0 ? ' border-l border-black/20' : ''
                      }${i > 0 && i % 2 === 0 ? ' md:border-l md:border-black/20' : ''}`}
                  >
                    <p className="whitespace-pre-line text-base leading-snug font-medium text-secondary mb-5">
                      {stat.label}
                    </p>
                    <p className="mt-2 font-sagire text-5xl text-secondary sm:text-3xl md:text-4xl">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="map" className="relative z-0">
          <div className="relative">
            <img
              src="/map-balanca.svg"
              alt=""
              className="w-full h-full hidden md:block object-cover rounded-3xl"
            />
            <img
              src="/map-mobile.svg"
              alt=""
              className="w-full md:hidden h-full object-cover rounded-3xl"
            />
            <div className="group/pin hidden md:block absolute left-[39.8%] top-[59%] w-[8%] -translate-x-1/2 -translate-y-1/2">
              <img
                src="/balanca-sign.png"
                alt=""
                className="peer/pin relative z-40 w-full object-contain hover:scale-120 transition-[scale] duration-500"
              />
              <span className="peer/inner absolute left-1/2 top-[150%] z-30 -translate-x-1/2 -translate-y-1/2 w-[380%] aspect-square rounded-full border border-dashed border-secondary transition-[scale] duration-600 hover:scale-105 peer-hover/pin:scale-105" />
              <span className="peer/middle absolute left-1/2 top-[150%] z-20 -translate-x-1/2 -translate-y-1/2 w-[610%] aspect-square rounded-full border border-dashed border-secondary/40 transition-[scale] duration-600 hover:scale-105 peer-hover/inner:scale-105 peer-hover/pin:scale-105" />
              <span className="absolute left-1/2 top-[150%] z-10 -translate-x-1/2 -translate-y-1/2 w-[850%] aspect-square rounded-full border border-dashed border-secondary/20 transition-[scale] duration-600 hover:scale-105 peer-hover/inner:scale-105 peer-hover/middle:scale-105 peer-hover/pin:scale-105" />
            </div>
            <div className="pointer-events-none absolute inset-x-0 top-[3%] z-20 px-4 sm:top-[14%] sm:px-6 md:top-[18%] lg:top-[20%]">
              <div className="mx-auto max-w-6xl md:max-w-6xl 2xl:max-w-7xl">
                <div className="w-full md:w-auto md:pl-[23%] xl:pl-[40%]">
                  <div className="flex flex-col items-center text-center md:items-end md:text-right">
                    <h1 className="font-sagire leading-[1.3] text-5xl sm:leading-[1.05] sm:text-3xl md:text-5xl text-secondary px-5 md:px-0">
                      Đô thị sinh thái hiếm hoi
                    </h1>
                    <span className="mt-2 font-inter font-medium uppercase text-lg sm:text-lg md:text-xl text-secondary">
                      Nằm trong lõi di sản hội an
                    </span>
                    <div className="mt-10 text-base md:text-lg font-medium text-justify text-black max-w-md">Dự án nằm liền kề rừng dừa Bảy Mẫu 200 năm tuổi, trong vùng đệm của khu dự trữ sinh quyển thế giới Cù Lao Chàm - Hội An, nơi hội thủy của ba dòng sông lớn: Thu Bồn, Cổ Cò, Trường Giang.</div>
                    <div className="pointer-events-auto mt-6 w-full max-w-md overflow-y-auto max-h-60 location-scrollbar" data-lenis-prevent>
                      {[
                        { name: 'Rừng dừa Bảy Mẫu', time: '1 - 2 phút' },
                        { name: 'Biển Cửa Đại / Cầu Cửa Đại', time: '5 phút' },
                        { name: 'Bãi biển An Bàng', time: '5 - 7 phút' },
                        { name: 'Phố cổ Hội An', time: '5 - 10 phút' },
                        { name: 'Sân bay quốc tế', time: '30 - 40 phút' },
                        { name: 'Bãi biển An Bàng', time: '5 - 7 phút' },
                        { name: 'Rừng dừa Bảy Mẫu', time: '1 - 2 phút' },
                        { name: 'Phố cổ Hội An', time: '5 - 10 phút' },
                      ].map((item, i, arr) => (
                        <div
                          key={`${item.name}-${i}`}
                          className={`location-item group flex items-center gap-3 px-4 py-3 cursor-default ${i < arr.length - 1 ? 'border-b border-gray-300' : ''}`}
                        >
                          <MapPin className="w-4 h-4 shrink-0 text-[#0F4672] group-hover:text-secondary transition-colors duration-300" />
                          <span className="flex-1 text-sm text-start font-medium text-black group-hover:text-secondary group-hover:translate-x-1.5 transition-all duration-300">{item.name}</span>
                          <span className="text-sm font-semibold text-black group-hover:text-secondary transition-colors duration-300 whitespace-nowrap">{item.time}</span>
                        </div>
                      ))}
                    </div>
                    <button className="pointer-events-auto btn-inverted-corners mt-4 bg-secondary px-5 py-4 text-sm font-semibold uppercase tracking-wider text-white transition-opacity hover:opacity-90 cursor-pointer">
                      Tải tài liệu dự án
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features — overlaps bottom of map */}
        <section
          id="features"
          className="relative z-10 rounded-t-3xl bg-white py-8"
        >
          <div className="mx-auto">
            <div className="mx-auto max-w-7xl 2xl:max-w-max flex flex-col gap-8 rounded-2xl pb-10 sm:px-10 sm:py-12 md:flex-row md:items-center md:gap-12 lg:px-14">
              <p className="max-w-sm text-base text-justify leading-relaxed text-black font-medium md:shrink-0 md:text-base px-6 md:px-0">
                Hệ thống cây xanh, mặt nước được kết nối, xếp lớp&nbsp;&nbsp;tạo nên la phổi xanh, đảm bảo chất lượng không khí thuần khiết cho khu đô thị, đồng thời xây dựng di sản sống xanh cho thế hệ tương lai.
              </p>
              <div className="grid flex-1 grid-cols-2 gap-x-0 gap-y-8 sm:grid-cols-5 sm:gap-6 md:gap-0">
                {[
                  { value: '08', label: 'Ha\ncây xanh' },
                  { value: '05', label: 'Công viên\nchủ đề' },
                  { value: '19', label: 'Trụ hoa giấy\nkỷ lục' },
                  { value: '25 m', label: 'Hệ thống\nkênh nội khu' },
                  { value: '70 m', label: 'Đường kính\nhồ trung tâm' },
                ].map((stat, i) => (
                  <div
                    key={stat.value}
                    className={`max-sm:text-center px-5${i === 4 ? ' col-span-2 sm:col-span-1' : ''
                      }${i % 2 !== 0 ? ' border-l border-black/20 sm:border-l-0' : ''}${i > 0 ? ' md:border-l md:border-black/20' : ''
                      }`}
                  >
                    <p className="font-sagire text-5xl text-secondary sm:text-3xl md:text-4xl">
                      {stat.value}
                    </p>
                    <p className="mt-2 whitespace-pre-line text-base leading-snug font-medium text-[#0F4672] sm:text-base 2xl:text-lg">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className={`relative [--carousel-sw:88%] [--carousel-gap:0px] ${isFirst ? '[--carousel-so:7%]' : isLast ? '[--carousel-so:7%]' : '[--carousel-so:6%]'} sm:[--carousel-sw:65%] sm:[--carousel-so:17.5%] sm:[--carousel-gap:12px]`}>
              <div className="overflow-hidden touch-pan-y" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
                <div
                  ref={trackRef}
                  className={`flex ${animate ? 'transition-transform duration-700 ease-in-out' : ''}`}
                  style={{ transform: `translateX(calc(var(--carousel-so) - ${slideIdx} * var(--carousel-sw) - ${slideIdx} * var(--carousel-gap) + ${dragOffset}px))` }}
                  onTransitionEnd={handleCarouselTransitionEnd}
                >
                  {extendedSlides.map((slide, i) => (
                    <div
                      key={`${slide.src}-${i}`}
                      className={`w-(--carousel-sw) shrink-0 px-1.5 ${animate ? 'transition-opacity duration-700' : ''}`}
                    >
                      <div className="inverted-corners-lg relative overflow-hidden">
                        <img
                          src={slide.src}
                          alt={slide.title}
                          className="aspect-3/4 w-full object-cover hover:scale-105 transition-transform duration-500 sm:aspect-video"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/30 via-black/30 to-transparent backdrop-blur-[2px] px-6 pb-6 sm:px-10 sm:pb-8">
                          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between">
                            <h3 className="font-sagire text-xl text-balance text-white sm:text-2xl md:text-3xl">
                              {slide.title}
                            </h3>
                            <p className="max-w-md text-sm text-justify text-white/80 sm:text-base 2xl:max-w-2xl">
                              {slide.desc}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={prevSlide}
                aria-label="Previous slide"
                className="btn-inverted-corners absolute left-[2%] top-1/2 z-10 hidden items-center justify-center bg-white text-secondary transition-colors duration-500 hover:bg-secondary hover:text-white cursor-pointer sm:flex sm:h-12 sm:w-12"
              >
                <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
              <button
                onClick={nextSlide}
                aria-label="Next slide"
                className="btn-inverted-corners absolute right-[2%] top-1/2 z-10 hidden items-center justify-center bg-white text-secondary transition-colors duration-500 hover:bg-secondary hover:text-white cursor-pointer sm:flex sm:h-12 sm:w-12"
              >
                <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>
            <div className="mt-10">
              <div className="relative flex max-sm:justify-start sm:justify-center max-sm:overflow-x-auto max-sm:scrollbar-none">
                <div className="pointer-events-none absolute bottom-0 h-px w-[80%] bg-black/10 max-sm:hidden" />
                <div className="relative z-10 flex items-center gap-8 sm:gap-12 max-sm:pl-6 max-sm:pr-6">
                  {[
                    { key: 'all', label: 'Tất cả' },
                    { key: 'landscape', label: 'Tiện ích cảnh quan' },
                    { key: 'service', label: 'Tiện ích dịch vụ' },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => handleCatChange(tab.key)}
                      className={`relative cursor-pointer whitespace-nowrap pb-1 text-sm font-semibold tracking-widest transition-colors duration-300 sm:text-sm 2xl:text-base uppercase ${carouselCat === tab.key
                        ? 'text-secondary after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-secondary'
                        : 'text-[#0F4672] after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 hover:after:scale-x-100'
                        }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Exterior */}
        <section id="exterior" className="relative pt-0 md:pt-16">
          <img
            src="/gradient-from-t.png"
            alt=""
            className="hidden md:block pointer-events-none absolute top-20 left-0 w-screen object-cover z-10"
          />
          <div className="relative">
            <img
              src="/leaf.png"
              alt=""
              className="pointer-events-none absolute -top-30 -right-70 hidden w-auto object-contain sm:block z-20"
            />

            <div className="absolute top-18 z-20 flex w-screen flex-col items-center font-light text-secondary">
              <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-2 md:gap-5">
                <span className="font-sagire text-7xl sm:text-3xl md:text-7xl">
                  An nhàn
                </span>
                <span className="font-alishanty text-6xl sm:text-4xl md:text-8xl">khai thác</span>
              </div>
              <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-2 md:gap-5 mt-2 md:mt-0">
                <span className="font-sagire text-7xl sm:text-3xl md:text-7xl">
                  An tâm
                </span>
                <span className="font-alishanty text-6xl sm:text-4xl md:text-8xl">sinh lời</span>
              </div>
            </div>
            <img
              src="/exterior.jpg"
              alt=""
              className="hidden md:block mt-10 w-full object-contain sm:mt-14 md:mt-20 rounded-b-3xl"
            />
            <img
              src="/exterior-mobile.png"
              alt=""
              className="block md:hidden w-full object-contain rounded-b-3xl"
            />
            <div className="absolute bottom-0 left-1/2 mb-10 w-full max-w-6xl -translate-x-1/2 py-8 sm:py-5 px-6 md:px-0">
              <p className="mx-auto max-w-xl text-center text-sm font-medium leading-relaxed text-white sm:text-base 2xl:text-lg">
                Kiến trúc của dự án là sự tiếp nối tinh tế của di sản kiến trúc Hội An với nếp nhà của những mái ngói nâu xếp lớp, vật liệu đá sa thạch từ Thánh địa Mỹ Sơn. 100% biệt thự thiết kế mở, thông tầng và hệ cửa kính lớn để đón trọn ánh sáng tự nhiên và gió trời.
              </p>
            </div>
          </div>
          <div className="relative md:min-h-[900px]">
            <img
              src="/bg-pattern.png"
              alt=""
              className="pointer-events-none object-cover hidden md:block"
            />
            {/* Overlay: title + description + award | carousel */}
            <div className="relative z-10 flex items-center md:absolute md:inset-0">
              <div className="mx-auto flex w-full h-full flex-col gap-8 py-20 md:pl-6 pr-0 md:flex-row md:items-stretch md:gap-15 lg:pl-20">
                {/* Left column */}
                <div className="flex flex-col justify-center md:shrink-0">
                  <h2 className="pl-6 md:pl-0 font-sagire text-5xl leading-tight text-secondary sm:text-4xl">
                    Kiệt tác xanh
                  </h2>
                  <p className="-mt-2 text-center md:text-left font-alishanty text-8xl leading-none text-secondary sm:text-5xl md:-mt-4 md:text-8xl">
                    “<span className="text-9xl sm:text-6xl md:text-9xl">3</span> trong <span className="text-9xl sm:text-6xl md:text-9xl">1</span>”
                  </p>
                  <span className="mt-5 text-xl text-center md:text-end font-medium uppercase text-secondary sm:text-lg md:-mt-2">
                    Thiết kế bởi KTS <br className="hidden md:block" /> Võ Trọng Nghĩa
                  </span>
                  <p className="px-6 md:px-0 mt-10 md:mt-5 max-w-sm text-base leading-relaxed text-center md:text-justify text-black">
                    Mỗi nếp nhà là một sắc xanh, toàn khu đô thị là một khu vườn xanh mang nét đẹp hoài cổ và bình tâm của phố Hội. Lối kiến trúc giao thoa giữa bảo tồn di sản và tư duy xanh hiện đại mang đến dòng sản phẩm biệt thự đẹp bất biến với thời gian, công năng linh hoạt, vừa phù hợp với hoạt động nghỉ dưỡng, vừa phù hợp với nhu cầu cho thuê, khai thác, vận hành du lịch.
                  </p>
                  <div className='flex justify-center'>
                    <img
                      src="/award.png"
                      alt="Asia Property Awards 2021"
                      className="mt-6 w-52 object-contain sm:w-52"
                    />
                  </div>
                </div>

                {/* Right column — carousel, touches right edge */}
                <div className={`relative flex-1 [--ext-sw:88%] [--ext-so:6%] [--ext-gap:0px] md:[--ext-sw:60%] md:[--ext-so:0%] md:[--ext-gap:12px] ${extIsFirst ? '[--ext-so:6%]' : extIsLast ? '[--ext-so:6%]' : '[--ext-so:6%]'} md:pr-0 md:min-h-0`}>
                  <div className="overflow-hidden rounded-l-3xl touch-pan-y md:h-full" onTouchStart={handleExtTouchStart} onTouchMove={handleExtTouchMove} onTouchEnd={handleExtTouchEnd}>
                    <div
                      ref={extTrackRef}
                      className="flex transition-transform duration-500 ease-in-out md:h-full"
                      style={{
                        transform: extIdx === extMax
                          ? `translateX(calc(100% - ${exteriorImages.length} * var(--ext-sw) - ${exteriorImages.length - 1} * var(--ext-gap) + ${extDragOffset}px))`
                          : `translateX(calc(var(--ext-so) - ${extIdx} * var(--ext-sw) - ${extIdx} * var(--ext-gap) + ${extDragOffset}px))`,
                      }}
                    >
                      {exteriorImages.map((src) => (
                        <div
                          key={src}
                          className="w-(--ext-sw) shrink-0 px-1.5"
                        >
                          <div className="inverted-corners-lg overflow-hidden md:h-full">
                            <img
                              src={src}
                              alt=""
                              className="aspect-3/4 w-full object-cover transition-transform duration-500 hover:scale-105 md:aspect-auto md:h-full md:w-full"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={extPrev}
                    aria-label="Previous"
                    className="btn-inverted-corners absolute -left-6 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center bg-secondary text-white transition-colors duration-300 hover:bg-secondary/90 hover:text-white cursor-pointer md:flex"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={extNext}
                    aria-label="Next"
                    className="btn-inverted-corners absolute right-8 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center bg-secondary text-white transition-colors duration-300 hover:bg-secondary/90 hover:text-white cursor-pointer md:flex md:right-30"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="relative">
            <img
              src="/bg-pattern-2.png"
              alt=""
              className="pointer-events-none justify-self-end hidden md:block"
            />
            <div className="relative z-10 flex items-center pb-6 sm:py-10 md:absolute md:inset-0">
              <div className="flex h-full min-h-0 w-full flex-col justify-center gap-8 md:flex-row md:items-stretch md:justify-start md:gap-0 lg:pr-10">
                {/* Left — image carousel */}
                <div className="relative flex min-w-0 w-full items-center justify-center md:w-[65%] md:shrink-0">
                  <div className="w-full overflow-hidden max-md:rounded-none md:aspect-3/2 md:rounded-r-3xl md:max-h-[360px] lg:max-h-[1000px]">
                    <div
                      className="flex md:h-full min-h-0 shrink-0 transition-transform duration-600 ease-in-out"
                      style={{
                        width: `${productSlides.length * 100}%`,
                        transform: `translateX(-${(prodIdx * 100) / productSlides.length}%)`,
                      }}
                    >
                      {productSlides.map((slide, i) => (
                        <div
                          key={`prod-${i}`}
                          className="box-border md:h-full min-h-0 shrink-0 overflow-hidden"
                          style={{ flex: `0 0 ${100 / productSlides.length}%` }}
                        >
                          <div className="md:h-full min-h-0 overflow-hidden max-md:[-webkit-mask:none] max-md:[mask:none] md:inverted-corners-lg-r">
                            <img
                              src={slide.src}
                              alt={slide.title}
                              className="aspect-3/4 w-full object-cover transition-transform duration-500 hover:scale-105 md:aspect-auto md:h-full md:max-h-full md:max-w-full"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right — info panel */}
                <div className="flex w-full flex-1 flex-col justify-center px-6 sm:px-10 md:px-12 lg:px-16">
                  <div className="flex items-center justify-between gap-3 md:hidden">
                    <button
                      onClick={prodPrev}
                      aria-label="Previous product"
                      className="btn-inverted-corners flex h-10 w-10 shrink-0 items-center justify-center bg-secondary text-white transition-colors duration-300 hover:bg-secondary/80 cursor-pointer"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <p className="font-snell-bold text-center text-8xl md:text-4xl italic text-secondary">
                      <span>{String(prodIdx + 1).padStart(2, '0')}</span>
                      <span className="ml-1 align-bottom text-4xl font-normal text-secondary/40 not-italic md:text-base">
                        / {String(productSlides.length).padStart(2, '0')}
                      </span>
                    </p>
                    <button
                      onClick={prodNext}
                      aria-label="Next product"
                      className="btn-inverted-corners flex h-10 w-10 shrink-0 items-center justify-center bg-secondary text-white transition-colors duration-300 hover:bg-secondary/80 cursor-pointer"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                  <p className="hidden font-snell-bold text-4xl text-secondary sm:text-5xl md:block md:text-8xl">
                    <span>{String(prodIdx + 1).padStart(2, '0')}</span>
                    <span className="ml-1 align-bottom text-lg font-normal text-secondary/40 sm:text-xl md:text-3xl">
                      /{String(productSlides.length).padStart(2, '0')}
                    </span>
                  </p>
                  <h3 className="mt-4 text-center font-sagire text-2xl text-secondary md:text-start sm:text-3xl md:text-3xl">
                    {productSlides[prodIdx].title}
                  </h3>
                  <div className="mt-6 w-full max-w-md border-t border-black/15 max-md:max-w-none">
                    {productSlides[prodIdx].specs.map((row, i) => (
                      <div
                        key={i}
                        className="grid grid-cols-2 border-b border-black/15 py-3 text-start"
                      >
                        <span className="min-w-0 text-xs font-bold uppercase tracking-wide text-black sm:text-sm">
                          {row.label}
                        </span>
                        <span className="min-w-0 text-sm font-normal text-black sm:text-base">
                          {row.value}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 hidden items-center gap-4 md:flex">
                    <button
                      onClick={prodPrev}
                      aria-label="Previous product"
                      className="btn-inverted-corners flex h-10 w-10 items-center justify-center bg-secondary text-white transition-colors duration-300 hover:bg-secondary/80 cursor-pointer sm:h-12 sm:w-12"
                    >
                      <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                    </button>
                    <button
                      onClick={prodNext}
                      aria-label="Next product"
                      className="btn-inverted-corners flex h-10 w-10 items-center justify-center bg-secondary text-white transition-colors duration-300 hover:bg-secondary/80 cursor-pointer sm:h-12 sm:w-12"
                    >
                      <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
                    </button>
                    <button className="btn-inverted-corners ml-auto bg-[#0F4672] px-5 py-3 text-sm font-semibold uppercase tracking-wider text-white transition-opacity hover:opacity-90 cursor-pointer sm:py-4">
                      Tải tài liệu dự án
                    </button>
                  </div>
                  <button className="btn-inverted-corners mx-auto mt-8 w-full max-w-sm bg-[#0F4672] px-5 py-3 text-sm font-semibold uppercase tracking-wider text-white transition-opacity hover:opacity-90 cursor-pointer md:hidden sm:py-4">
                    Tải tài liệu dự án
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="relative">
            <img
              src="/bg-pattern-3.png"
              alt=""
              className="pointer-events-none object-cover hidden md:block"
            />
            <div className="relative z-10 flex items-center px-6 py-10 sm:px-10 sm:py-14 md:absolute md:inset-0 lg:px-20 lg:py-16">
              {/* Village image + title + white card */}
              <div className="relative min-h-[90vh] w-full overflow-hidden rounded-2xl max-md:[-webkit-mask:none] max-md:[mask:none] md:min-h-0 md:rounded-none md:h-full inverted-corners-lg">
                <img
                  src="/village.png"
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                />
                {/* Title + white card column */}
                <div className="pointer-events-none relative flex min-h-[90vh] flex-col items-center px-6 py-5 text-center md:min-h-0 md:absolute md:inset-y-8 md:left-10 md:w-[320px] md:items-start md:text-left md:px-0 md:py-0 lg:left-15 lg:inset-y-18 lg:w-[50%]">
                  {/* Title */}
                  <div>
                    <h2 className="font-sagire text-secondary">
                      <span className="text-4xl sm:text-4xl md:text-5xl lg:text-5xl">Vận hành <br className="block md:hidden" /></span>
                      <span className="inline-block px-3 md:translate-y-[0.35em] font-alishanty text-4xl sm:text-5xl md:text-6xl lg:text-7xl">{' '}& </span>
                      <span className="text-4xl sm:text-4xl md:text-5xl lg:text-5xl"><br className="block md:hidden" />Sinh lời ngay</span>
                    </h2>
                    <p className="mt-2 md:mt-7 text-sm font-medium uppercase tracking-[0.15em] text-secondary sm:text-base">
                      Cùng đơn vị chuyên nghiệp
                    </p>
                  </div>
                  {/* White card — fills from mt-10 below title to bottom */}
                  <div className="mt-auto flex min-h-0 flex-col items-center justify-center rounded-3xl bg-white/80 px-6 py-6 backdrop-blur-xs w-full sm:px-8 sm:py-8 md:mt-10 md:flex-1 md:w-[80%]">
                    <img
                      src="/logo-village.png"
                      alt="M Village"
                      className="mb-5 h-20 object-contain sm:h-24 lg:h-28"
                    />
                    <p className="px-2 mt-5 text-center text-sm leading-relaxed text-black sm:px-5 sm:text-base">
                      Mỗi nếp nhà là một sắc xanh, toàn khu đô thị là một khu vườn xanh mang nét đẹp hoài cổ và bình lặng của phố Hội. Lối kiến trúc giao thoa giữa bảo tồn di sản và tư duy xanh hiện đại mang đến dòng sản phẩm biệt thự đẹp bất biến với thời gian, công năng linh hoạt, vừa phù hợp với hoạt động nghỉ dưỡng, vừa phù hợp với nhu cầu cho thuê, khai thác, vận hành du lịch.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <img
              src="/bg-emblem.png"
              alt=""
              className="pointer-events-none hidden object-cover sm:block absolute -bottom-120 right-0"
            />
          </div>
        </section>

        <section id="safety" className="relative">
          <div className="relative rounded-t-3xl overflow-hidden">
            <img
              src="/safety.png"
              alt=""
              className="w-full object-contain hidden md:block"
            />
            <img
              src="/safety-mobile.png"
              alt=""
              className="w-full object-contain block md:hidden"
            />
            <img
              src="/gradient-from-top-r.png"
              alt=""
              className="pointer-events-none hidden object-cover sm:block absolute top-0 right-0"
            />
            {/* Title + description overlay */}
            <div className="pointer-events-none absolute top-10 md:top-20 justify-self-center md:right-[3%] flex md:pr-6 mx-6 md:mx-0">
              <div className="text-center md:text-right lg:max-w-lg">
                <h2 className="text-secondary">
                  <span className="font-sagire text-7xl sm:text-5xl md:text-6xl lg:text-7xl">An toàn</span>
                  <span className="inline-block md:translate-y-[0.35em] px-5 font-alishanty text-6xl sm:text-5xl md:text-6xl lg:text-7xl">{' '}tích sản</span>
                </h2>
                <h2 className="mt-2 text-secondary sm:-mt-3">
                  <span className="font-sagire text-7xl sm:text-5xl md:text-6xl lg:text-7xl">An giữ</span>
                  <span className="inline-block md:translate-y-[0.35em] px-5 font-alishanty text-6xl sm:text-5xl md:text-6xl lg:text-7xl">{' '}truyền đời</span>
                </h2>
                <p className="mt-4 md:pl-5 text-sm font-medium text-center md:text-end justify-end text-black sm:mt-10 sm:text-base">
                  Dự án hiếm hoi tại Hội An sở hữu pháp lý và sổ đỏ lâu dài cho 100% sản phẩm. Quỹ đất sinh thái cuối cùng ở vùng lõi phát triển Đà Nẵng – Hội An.
                </p>
              </div>
            </div>
            <img
              src="/gradient-from-b.png"
              alt=""
              className="pointer-events-none object-cover sm:block w-full absolute bottom-0 right-0"
            />
          </div>
          <div className="relative flex flex-col gap-8 md:pl-6 py-12 sm:pl-10 sm:py-16 md:flex-row md:items-stretch md:gap-0 lg:pl-20 lg:py-20">
            {/* Left — text + awards */}
            <div className="flex flex-col px-6 md:px-0 justify-center md:w-[38%] md:shrink-0 md:pr-10 lg:pr-16 max-w-lg">
              <h2 className="font-sagire text-center md:text-left text-4xl text-secondary sm:text-4xl md:text-5xl">
                Chủ đầu tư uy tín
              </h2>
              <p className="mt-2 text-center md:text-left text-sm font-semibold uppercase tracking-[0.15em] text-secondary">
                Top 10 thương hiệu phát triển bền vững
              </p>
              <p className="mt-5 text-base text-center md:text-justify leading-relaxed text-black">
                Giá trị của dự án được bảo chứng bởi tiềm lực tài chính mạnh mẽ và hơn 20 năm kinh nghiệm trong lĩnh vực xây dựng, bất động sản của Chủ đầu tư Đạt Phương, đơn vị thi công các công trình hạ tầng trọng điểm quốc gia: Cầu Cửa Đại, cầu Đế Võng.
              </p>
              {/* Awards */}
              <div className="mt-10 md:mt-15 flex flex-col gap-5">
                <div className="relative">
                  <div className="absolute inset-0 inverted-corners-lg bg-[#FFE4AA]" />
                  <div className="relative flex items-center justify-center gap-7 py-4">
                    <img src="/award-top-10.png" alt="Top 10" className="h-28 w-28 shrink-0 object-contain -mt-8 sm:-mt-12" />
                    <div>
                      <span className="font-bold text-secondary text-base">TOP 10</span>
                      <p className="text-black text-base">thương hiệu phát triển<br />bền vững (2025)</p>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 inverted-corners-lg bg-[#FFE4AA]" />
                  <div className="relative flex items-center justify-center gap-7">
                    <img src="/award-top-500.png" alt="Top 500" className="h-30 w-30 shrink-0 object-contain" />
                    <div>
                      <span className="font-bold text-secondary text-base">TOP 500</span>
                      <p className="text-black text-base">doanh nghiệp tư nhân<br />lớn nhất Việt Nam</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Right — aerial image */}
            <div className="relative min-h-[300px] flex-1 sm:min-h-[400px] pl-6 md:pl-0 mt-6 md:mt-0">
              <div className="h-full w-full overflow-hidden inverted-corners-lg-l">
                <img
                  src="/exterior-2.png"
                  alt="Casamia Balance aerial view"
                  className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <img
                src="/cloud.png"
                alt=""
                className="pointer-events-none absolute bottom-0 left-0 -translate-x-1/4 translate-y-[60%] w-40 sm:w-100 object-contain z-20"
              />
            </div>
          </div>
          <div className="relative flex flex-col-reverse gap-8 md:pr-6 pb-12 sm:pr-10 sm:pb-16 md:flex-row md:items-stretch md:gap-0 lg:pr-20 lg:pb-20">
            {/* Left — scenery image */}
            <div className="min-h-[300px] flex-1 overflow-hidden sm:min-h-[400px] inverted-corners-lg-r mr-6 md:mr-0">
              <img
                src="/scenery.png"
                alt="Casamia Balance scenery"
                className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            {/* Right — text + button */}
            <div className="px-6 md:px-0 flex flex-col justify-center md:w-[42%] md:shrink-0 md:pl-10 lg:pl-16 max-w-lg">
              <h2 className="font-sagire text-4xl leading-tight text-secondary sm:text-4xl md:text-5xl">
                100% pháp lý
              </h2>
              <p className="font-alishanty text-6xl text-center leading-none text-secondary sm:text-4xl md:-mt-2 md:text-6xl">
                sổ đỏ Lâu dài
              </p>
              <p className="mt-1 text-sm font-semibold uppercase tracking-[0.15em] text-secondary text-end sm:text-sm">
                Quy hoạch bền vững,<br />được bảo tồn bởi UNESCO
              </p>
              <p className="mt-5 text-center md:text-justify leading-relaxed text-black text-base">
                Nương theo địa thế hiếm có của vùng đất Cẩm Thanh – top 20 ngôi làng đẹp nhất thế giới, Casamia Balanca được quy hoạch hài hòa với tự nhiên. Dự án nằm trong quỹ đất được bảo tồn với quy định nghiêm ngặt.
              </p>
              <p className="mt-4 text-center md:text-justify leading-relaxed text-black text-base">
                Sự khan hiếm ấy trở thành nền tảng giá trị độc tôn của Casamia Balanca. Nơi nếp sống vì sức khỏe được thiên nhiên nâng niu và giá trị sinh lời của tài sản được thời gian nâng giữ.
              </p>
              <div className="mt-8 flex justify-center">
                <a
                  href="#"
                  className="btn-inverted-corners bg-secondary px-8 py-3 text-sm font-semibold uppercase tracking-wider text-white transition-opacity hover:opacity-90 sm:text-base"
                >
                  Tải tài liệu dự án
                </a>
              </div>
            </div>
          </div>
          <img
            src="/leaf.png"
            alt=""
            className="pointer-events-none object-cover sm:block absolute -bottom-10 md:-bottom-30 right-0"
          />
        </section>
      </div>
      <div ref={spacerRef} />

      {/* Footer */}
      <footer ref={footerRef} id="contact" className="fixed bottom-0 left-0 right-0 z-50 overflow-hidden rounded-t-3xl bg-secondary will-change-transform" style={{ transform: 'translateY(100%)' }}>
        <img
          src="/bg-footer.png"
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full scale-140 object-cover mt-20"
        />

        <div className="relative mx-auto max-w-6xl px-6 py-14 sm:px-10 sm:py-20 lg:px-20">
          <div className="flex flex-col-reverse gap-12 md:flex-row md:gap-16">
            {/* Left column — logo, info, socials */}
            <div className="md:w-[38%] md:shrink-0">
              <div className="items-center justify-center flex">
                <img
                  src="/logo-footer.png"
                  alt="Casamia Balanca Hoi An"
                  className="w-44 object-contain sm:w-52"
                />
              </div>

              <div className="mt-8 space-y-6 text-sm text-white/90 sm:text-base">
                <div>
                  <h3 className="font-bold uppercase tracking-wider text-white">Văn phòng Hà Nội</h3>
                  <p className="mt-2 flex items-start gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>Tầng 15, tòa nhà Handico Tower, Đường Phạm Hùng, Phường Từ Liêm, TP. Hà Nội</span>
                  </p>
                  <p className="mt-1 flex items-center gap-2">
                    <Phone className="h-4 w-4 shrink-0" />
                    <span>1800 6918</span>
                  </p>
                </div>

                <div>
                  <h3 className="font-bold uppercase tracking-wider text-white">Văn phòng Hội An</h3>
                  <p className="mt-2 flex items-start gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>Số nhà LK3.17, KĐT Casamia Phường Hội An Đông, Đà Nẵng</span>
                  </p>
                  <p className="mt-1 flex items-center gap-2">
                    <Phone className="h-4 w-4 shrink-0" />
                    <span>1800 6918</span>
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-xs font-bold uppercase tracking-wider text-white sm:text-sm">Cập nhật thông tin tại</p>
                <div className="mt-3 flex gap-3">
                  <a href="#" className="btn-inverted-corners flex h-10 w-10 items-center justify-center bg-white text-secondary transition-opacity hover:opacity-90">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.75a8.18 8.18 0 0 0 4.76 1.52V6.84a4.84 4.84 0 0 1-1-.15z" /></svg>
                  </a>
                  <a href="#" className="btn-inverted-corners flex h-10 w-10 items-center justify-center bg-white text-secondary transition-opacity hover:opacity-90">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                  </a>
                </div>
              </div>

              <p className="mt-6 text-xs text-white/50">
                &copy;Bản quyền thuộc về Casamia Balanca Hội An
              </p>
            </div>

            {/* Right column — subscribe form */}
            <div className="flex-1">
              <div className="rounded-2xl bg-white px-8 py-8 sm:px-10 sm:py-10">
                <h3 className="font-sagire text-center text-2xl text-secondary sm:text-3xl md:text-4xl">
                  Đăng ký nhận tư vấn
                </h3>
                <p className="mt-2 text-center text-xs text-black/70 sm:text-sm">
                  Vui lòng để lại thông tin.<br />
                  Tư vấn viên sẽ liên hệ quý khách trong thời gian sớm nhất.
                </p>

                <form className="mt-8 space-y-5" onSubmit={(e) => e.preventDefault()}>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-black/70 sm:text-sm">Họ tên</label>
                    <input
                      type="text"
                      placeholder="Điền thông tin của bạn"
                      className="border-b border-black/20 bg-transparent py-2 text-sm outline-none placeholder:text-black/30 focus:border-secondary"
                    />
                  </div>

                  <div className="flex flex-col gap-5 sm:flex-row sm:gap-6">
                    <div className="flex flex-1 flex-col gap-1">
                      <label className="text-xs font-semibold text-black/70 sm:text-sm">Số điện thoại</label>
                      <input
                        type="tel"
                        placeholder="Tối thiểu 10 chữ số"
                        className="border-b border-black/20 bg-transparent py-2 text-sm outline-none placeholder:text-black/30 focus:border-secondary"
                      />
                    </div>
                    <div className="flex flex-1 flex-col gap-1">
                      <label className="text-xs font-semibold text-black/70 sm:text-sm">Email</label>
                      <input
                        type="email"
                        placeholder="vidu@mail.com"
                        className="border-b border-black/20 bg-transparent py-2 text-sm outline-none placeholder:text-black/30 focus:border-secondary"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-black/70 sm:text-sm">Yêu cầu tư vấn</label>
                    <input
                      type="text"
                      placeholder="Hãy để lại lời nhắn để tư vấn viên có thể hỗ trợ Quý khách"
                      className="border-b border-black/20 bg-transparent py-2 text-sm outline-none placeholder:text-black/30 focus:border-secondary"
                    />
                  </div>

                  <div className="flex justify-center pt-2">
                    <button
                      type="submit"
                      className="btn-inverted-corners bg-secondary px-10 py-3 text-sm font-semibold uppercase tracking-wider text-white transition-opacity hover:opacity-90 sm:text-base"
                    >
                      Đăng ký tư vấn
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
