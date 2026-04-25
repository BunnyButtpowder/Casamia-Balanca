import { useState, useRef, useEffect, lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { useLenis } from '../hooks/useLenis'
import { usePageVisible } from '../hooks/useVisibility'
import { MapPin, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { NEWS_ARTICLES } from '../data/news'
import Header from '../components/Header'
const FloatingButtons = lazy(() => import('../components/FloatingButtons'))
import Footer from '../components/Footer'
import { useHomeContent } from '../hooks/useHomeContent'
import { api, resolveUploadUrl } from '../services/api'

function Home() {
    const lenisRef = useLenis()
    const { data: content, loading: contentLoading } = useHomeContent()
    const [pageLoaded, setPageLoaded] = useState(false)
    useEffect(() => {
        let cancelled = false
        // Reduced from 4s to 1.5s — hero poster image provides visual content;
        // waiting longer just delays LCP without user benefit
        const FALLBACK_MS = 1500
        const fallback = setTimeout(() => { if (!cancelled) setPageLoaded(true) }, FALLBACK_MS)

        const waitForHero = async () => {
            await new Promise((r) => requestAnimationFrame(() => r(null)))
            const video = document.querySelector<HTMLVideoElement>('#hero video')
            if (video && video.readyState < 2) {
                await new Promise<void>((resolve) => {
                    const done = () => { video.removeEventListener('loadeddata', done); video.removeEventListener('error', done); resolve() }
                    video.addEventListener('loadeddata', done)
                    video.addEventListener('error', done)
                })
            }
            if (!cancelled) setPageLoaded(true)
        }

        waitForHero()

        return () => {
            cancelled = true
            clearTimeout(fallback)
        }
    }, [])
    useEffect(() => {
        document.body.style.overflow = pageLoaded ? '' : 'hidden'
        return () => { document.body.style.overflow = '' }
    }, [pageLoaded])
    const mobileMapScrollRef = useRef<HTMLDivElement>(null)
    const [downloadOpen, setDownloadOpen] = useState(false)
    const [tvcLoaded, setTvcLoaded] = useState(false)
    const [downloadForm, setDownloadForm] = useState({ name: '', phone: '', city: '', email: '' })
    const handleDownloadSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await api.submitDownload(downloadForm)
        } catch { /* ignore */ }
        window.open(content!.map.downloadUrl, '_blank', 'noopener,noreferrer')
        setDownloadOpen(false)
        setDownloadForm({ name: '', phone: '', city: '', email: '' })
    }
    const [galleryIdx, setGalleryIdx] = useState(1)
    const [galleryAnimate, setGalleryAnimate] = useState(true)
    const [galleryDragOffset, setGalleryDragOffset] = useState(0)
    const galleryDragRef = useRef<{ startX: number; startY: number; locked: boolean | null; startTime: number } | null>(null)
    const galleryTrackRef = useRef<HTMLDivElement>(null)
    const [carouselCat, setCarouselCat] = useState('all')
    const contentRef = useRef<HTMLDivElement>(null)
    const footerRef = useRef<HTMLElement>(null)
    const spacerRef = useRef<HTMLDivElement>(null)
    // Pause all carousel timers when the tab is hidden
    const pageVisible = usePageVisible()
    // Cached container width to avoid reading offsetWidth during touch handlers
    const containerWidthRef = useRef(window.innerWidth)
    useEffect(() => {
        const updateWidth = () => { containerWidthRef.current = window.innerWidth }
        window.addEventListener('resize', updateWidth)
        return () => window.removeEventListener('resize', updateWidth)
    }, [])

    useEffect(() => {
        const content = contentRef.current
        const footer = footerRef.current
        const spacer = spacerRef.current
        if (!content || !footer || !spacer) return

        // Cache layout values to avoid repeated reads during scroll
        let cachedFooterH = 0
        let layoutRafId = 0

        const updateLayout = () => {
            cancelAnimationFrame(layoutRafId)
            // Defer to next frame so reads don't force a synchronous reflow
            // when triggered by ResizeObserver during layout
            layoutRafId = requestAnimationFrame(() => {
                // Batch reads
                const contentH = content.offsetHeight
                const footerH = footer.offsetHeight
                cachedFooterH = footerH
                // Batch writes
                spacer.style.height = `${footerH}px`
                content.style.top = `${-(contentH - window.innerHeight)}px`
            })
        }
        updateLayout()

        const ro = new ResizeObserver(updateLayout)
        ro.observe(content)
        ro.observe(footer)

        let rafId = 0
        const handleScroll = () => {
            cancelAnimationFrame(rafId)
            rafId = requestAnimationFrame(() => {
                // Only read spacer rect; use cached footerH to avoid extra reflow
                const spacerRect = spacer.getBoundingClientRect()
                const fh = cachedFooterH
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
            cancelAnimationFrame(layoutRafId)
            window.removeEventListener('scroll', handleScroll)
            ro.disconnect()
        }
    }, [content])

    const allSlides = (content?.features.slides ?? []).map((s) => ({ ...s, src: resolveUploadUrl(s.src) }))

    const carouselSlides = carouselCat === 'all' ? allSlides : allSlides.filter((s) => s.cat === carouselCat)

    const [slideIdx, setSlideIdx] = useState(1)
    const [animate, setAnimate] = useState(true)

    // Exterior carousel
    const exteriorImages = (content?.products.exteriorImages ?? []).map(resolveUploadUrl)
    const [extIdx, setExtIdx] = useState(0)
    const extMax = exteriorImages.length - 1
    const extPrev = () => setExtIdx((i) => Math.max(0, i - 1))
    const extNext = () => setExtIdx((i) => Math.min(extMax, i + 1))

    useEffect(() => {
        if (!pageVisible) return
        const id = setInterval(() => setExtIdx((i) => (i >= extMax ? 0 : i + 1)), 5000)
        return () => clearInterval(id)
    }, [extMax, pageVisible])

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
        const containerW = containerWidthRef.current
        const threshold = containerW * 0.2
        setExtDragOffset(0)
        if (!extIsLast && (dx < -threshold || (velocity > 0.3 && dx < 0))) {
            extNext()
        } else if (!extIsFirst && (dx > threshold || (velocity > 0.3 && dx > 0))) {
            extPrev()
        }
        extDragRef.current = null
    }

    // Village / operations carousel — same behaviour as exterior carousel
    const villageImages = (content?.products.villageImages ?? []).map((v) => ({ ...v, src: resolveUploadUrl(v.src) }))
    const [vilIdx, setVilIdx] = useState(0)
    const vilMax = villageImages.length - 1
    const vilPrev = () => setVilIdx((i) => Math.max(0, i - 1))
    const vilNext = () => setVilIdx((i) => Math.min(vilMax, i + 1))

    useEffect(() => {
        if (!pageVisible) return
        const id = setInterval(() => setVilIdx((i) => (i >= vilMax ? 0 : i + 1)), 5000)
        return () => clearInterval(id)
    }, [vilMax, pageVisible])
    const [vilDragOffset, setVilDragOffset] = useState(0)
    const vilDragRef = useRef<{ startX: number; startY: number; locked: boolean | null; startTime: number } | null>(null)
    const vilTrackRef = useRef<HTMLDivElement>(null)
    const vilIsFirst = vilIdx === 0
    const vilIsLast = vilIdx === vilMax

    const handleVilTouchStart = (e: React.TouchEvent) => {
        vilDragRef.current = { startX: e.touches[0].clientX, startY: e.touches[0].clientY, locked: null, startTime: Date.now() }
    }
    const handleVilTouchMove = (e: React.TouchEvent) => {
        if (!vilDragRef.current) return
        const dx = e.touches[0].clientX - vilDragRef.current.startX
        const dy = e.touches[0].clientY - vilDragRef.current.startY
        if (vilDragRef.current.locked === null) {
            if (Math.abs(dx) > 8 || Math.abs(dy) > 8) {
                vilDragRef.current.locked = Math.abs(dx) > Math.abs(dy)
            }
            return
        }
        if (!vilDragRef.current.locked) return
        e.preventDefault()
        const atEdge = (vilIsFirst && dx > 0) || (vilIsLast && dx < 0)
        setVilDragOffset(atEdge ? dx * 0.2 : dx)
    }
    const handleVilTouchEnd = (e: React.TouchEvent) => {
        if (!vilDragRef.current || !vilDragRef.current.locked) {
            vilDragRef.current = null
            setVilDragOffset(0)
            return
        }
        const dx = e.changedTouches[0].clientX - vilDragRef.current.startX
        const elapsed = Date.now() - vilDragRef.current.startTime
        const velocity = Math.abs(dx) / elapsed
        const containerW = containerWidthRef.current
        const threshold = containerW * 0.2
        setVilDragOffset(0)
        if (!vilIsLast && (dx < -threshold || (velocity > 0.3 && dx < 0))) {
            vilNext()
        } else if (!vilIsFirst && (dx > threshold || (velocity > 0.3 && dx > 0))) {
            vilPrev()
        }
        vilDragRef.current = null
    }

    /** Park Home — one product; arrows only change images per filter (Mặt ngoài / Nội thất). */
    const parkHomeProduct = {
        title: content?.products.parkHomeTitle ?? '',
        exteriorImages: (content?.products.parkHomeExteriorImages ?? []).map(resolveUploadUrl),
        interiorImages: (content?.products.parkHomeInteriorImages ?? []).map(resolveUploadUrl),
    }
    type ProductFilter = 'exterior' | 'interior'
    const [productFilter, setProductFilter] = useState<ProductFilter>('exterior')
    const [prodSlideIdx, setProdSlideIdx] = useState(0)
    const productGalleryImages =
        productFilter === 'exterior' ? parkHomeProduct.exteriorImages : parkHomeProduct.interiorImages
    const prodGalleryLen = productGalleryImages.length
    const safeProdSlideIdx = prodGalleryLen > 0 ? Math.min(prodSlideIdx, prodGalleryLen - 1) : 0

    const prodPrev = () =>
        setProdSlideIdx((i) => {
            const len = productFilter === 'exterior' ? parkHomeProduct.exteriorImages.length : parkHomeProduct.interiorImages.length
            return i === 0 ? len - 1 : i - 1
        })
    const prodNext = () =>
        setProdSlideIdx((i) => {
            const len = productFilter === 'exterior' ? parkHomeProduct.exteriorImages.length : parkHomeProduct.interiorImages.length
            return i === len - 1 ? 0 : i + 1
        })

    const prodTouchStartX = useRef<number | null>(null)
    const prodTouchDeltaX = useRef(0)
    const onProdTouchStart = (e: React.TouchEvent) => {
        prodTouchStartX.current = e.touches[0].clientX
        prodTouchDeltaX.current = 0
    }
    const onProdTouchMove = (e: React.TouchEvent) => {
        if (prodTouchStartX.current === null) return
        prodTouchDeltaX.current = e.touches[0].clientX - prodTouchStartX.current
    }
    const onProdTouchEnd = () => {
        const dx = prodTouchDeltaX.current
        prodTouchStartX.current = null
        prodTouchDeltaX.current = 0
        if (Math.abs(dx) < 40) return
        if (dx < 0) prodNext()
        else prodPrev()
    }

    const prodNextRef = useRef(prodNext)
    prodNextRef.current = prodNext
    useEffect(() => {
        if (!pageVisible) return
        const id = setInterval(() => prodNextRef.current(), 5000)
        return () => clearInterval(id)
    }, [pageVisible])

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

    useEffect(() => {
        if (!pageVisible) return
        const id = setInterval(() => {
            setAnimate(true)
            setSlideIdx((i) => (i >= carouselSlides.length ? 1 : i + 1))
        }, 5000)
        return () => clearInterval(id)
    }, [carouselCat, carouselSlides.length, pageVisible])

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
        const containerW = containerWidthRef.current
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

    // Footer gallery carousel
    const footerGallery = (content?.footer.galleryImages ?? []).map(resolveUploadUrl)
    const extendedGallery = footerGallery.length > 0 ? [
        footerGallery[footerGallery.length - 1],
        ...footerGallery,
        footerGallery[0],
    ] : []
    const galleryIsFirst = galleryIdx <= 1
    const galleryIsLast = galleryIdx >= footerGallery.length

    const prevGallery = () => { setGalleryAnimate(true); setGalleryIdx((i) => i - 1) }
    const nextGallery = () => { setGalleryAnimate(true); setGalleryIdx((i) => i + 1) }

    useEffect(() => {
        if (!pageVisible) return
        const id = setInterval(() => {
            setGalleryAnimate(true)
            setGalleryIdx((i) => (i >= footerGallery.length ? 1 : i + 1))
        }, 5000)
        return () => clearInterval(id)
    }, [pageVisible])

    const handleGalleryTouchStart = (e: React.TouchEvent) => {
        setGalleryAnimate(false)
        galleryDragRef.current = { startX: e.touches[0].clientX, startY: e.touches[0].clientY, locked: null, startTime: Date.now() }
    }
    const handleGalleryTouchMove = (e: React.TouchEvent) => {
        if (!galleryDragRef.current) return
        const dx = e.touches[0].clientX - galleryDragRef.current.startX
        const dy = e.touches[0].clientY - galleryDragRef.current.startY
        if (galleryDragRef.current.locked === null) {
            if (Math.abs(dx) > 8 || Math.abs(dy) > 8) {
                galleryDragRef.current.locked = Math.abs(dx) > Math.abs(dy)
            }
            return
        }
        if (!galleryDragRef.current.locked) return
        e.preventDefault()
        const atEdge = (galleryIsFirst && dx > 0) || (galleryIsLast && dx < 0)
        setGalleryDragOffset(atEdge ? dx * 0.2 : dx)
    }
    const handleGalleryTouchEnd = (e: React.TouchEvent) => {
        if (!galleryDragRef.current || !galleryDragRef.current.locked) {
            galleryDragRef.current = null
            setGalleryDragOffset(0)
            return
        }
        const dx = e.changedTouches[0].clientX - galleryDragRef.current.startX
        const elapsed = Date.now() - galleryDragRef.current.startTime
        const velocity = Math.abs(dx) / elapsed
        const containerW = containerWidthRef.current
        const threshold = containerW * 0.2
        setGalleryAnimate(true)
        setGalleryDragOffset(0)
        if (!galleryIsLast && (dx < -threshold || (velocity > 0.3 && dx < 0))) {
            nextGallery()
        } else if (!galleryIsFirst && (dx > threshold || (velocity > 0.3 && dx > 0))) {
            prevGallery()
        }
        galleryDragRef.current = null
    }
    const handleGalleryTransitionEnd = () => {
        if (galleryIdx === 0) {
            setGalleryAnimate(false)
            setGalleryIdx(footerGallery.length)
        } else if (galleryIdx === extendedGallery.length - 1) {
            setGalleryAnimate(false)
            setGalleryIdx(1)
        }
    }

    if (!content) return (
        <div className="min-h-screen">
            {/* Loading overlay */}
            <div className="fixed inset-0 z-200 flex flex-col items-center justify-center bg-warm">
                <img src="/logo.png" alt="Casamia Balanca" width={208} height={80} className="w-40 object-contain sm:w-52 animate-pulse" />
                <div className="mt-8 h-1 w-40 overflow-hidden rounded-full bg-secondary/15">
                    <div className="h-full w-1/2 animate-[loader_1.2s_ease-in-out_infinite] bg-secondary" />
                </div>
                <style>{`@keyframes loader { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }`}</style>
            </div>
            {/* Skeleton hero — gives the browser an LCP candidate while API data loads */}
            <section className="relative flex h-screen items-center justify-center overflow-hidden rounded-b-4xl" id="hero">
                <img src="/hero-poster.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" fetchPriority="high" />
                <div className="absolute inset-0 bg-black/10" />
                <div className="relative z-10 px-4 text-center sm:px-6">
                    <h1 className="leading-tight font-light text-white">
                        <span className="block h-16 md:h-20" />
                        <span className="block h-16 md:h-20" />
                    </h1>
                    <p className="mx-auto mt-4 max-w-xl text-xl text-white uppercase sm:mt-4 sm:text-base">&nbsp;</p>
                </div>
            </section>
        </div>
    )

    return (
        <div className="min-h-screen">
            <div
                aria-hidden={pageLoaded && !contentLoading}
                className={`fixed inset-0 z-200 flex flex-col items-center justify-center bg-warm transition-opacity duration-700 ${pageLoaded && !contentLoading ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
            >
                <img src="/logo.png" alt="Casamia Balanca" width={208} height={80} className="w-40 object-contain sm:w-52 animate-pulse" />
                <div className="mt-8 h-1 w-40 overflow-hidden rounded-full bg-secondary/15">
                    <div className="h-full w-1/2 animate-[loader_1.2s_ease-in-out_infinite] bg-secondary" />
                </div>
                <style>{`@keyframes loader { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }`}</style>
            </div>
            <div ref={contentRef} className="sticky">
                <Header lenisRef={lenisRef} />

                {/* Hero */}
                <section className="relative flex h-screen items-center justify-center overflow-hidden rounded-b-4xl" id="hero">
                    <video
                        src={resolveUploadUrl(content.hero.videoUrl)}
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="auto"
                        poster="/hero-poster.jpg"
                        width={1920}
                        height={1080}
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/10" />
                    <div className="relative z-10 px-4 text-center sm:px-6">
                        <h1 className="leading-tight font-light text-white">
                            <span className="-ml-6 flex items-center justify-center gap-3 sm:-ml-10 md:-ml-27">
                                <span className="text-7xl font-alishanty md:text-7xl">{content.hero.titleLine1Word1}</span>
                                <span className="text-5xl font-sagire md:text-5xl">{content.hero.titleLine1Word2}</span>
                            </span>
                            <span className=" flex items-center justify-center gap-3 sm:ml-10 md:ml-29">
                                <span className="text-7xl font-alishanty md:text-7xl">{content.hero.titleLine2Word1}</span>
                                <span className="text-5xl font-sagire md:text-5xl">{content.hero.titleLine2Word2}</span>
                            </span>
                        </h1>
                        <p className="mx-auto mt-4 max-w-xl text-xl text-white uppercase sm:mt-4 sm:text-base">
                            {content.hero.subtitle}
                        </p>
                    </div>

                    {/* Scroll indicator */}
                    <div className="absolute bottom-0 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center">
                        <div className="h-[27vh] w-px bg-[#fff7e953] sm:h-[26vh]" />
                        <img
                            src="/scroll-down.png"
                            alt="Scroll down"
                            width={40}
                            height={40}
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
                            // eslint-disable-next-line
                            {...{ fetchPriority: 'high' } as React.ImgHTMLAttributes<HTMLImageElement>}
                            className="h-full w-full object-cover"
                        />
                        <div className="absolute -bottom-50 left-1/2 z-10 mx-auto w-full max-w-xs md:max-w-4xl -translate-x-1/2 px-6 text-center sm:bottom-12 md:bottom-24 2xl:bottom-30">
                            <div className="font-sagire font-light text-4xl md:text-6xl leading-snug text-secondary sm:flex sm:items-center sm:justify-center sm:gap-3">
                                {content.about.headingLine1}
                            </div>
                            <div className="font-sagire font-light text-4xl md:text-6xl leading-snug text-secondary sm:flex sm:items-center sm:justify-center sm:gap-3">
                                {content.about.headingLine2}
                            </div>
                        </div>
                        <img
                            src="/leaf.webp"
                            alt=""

                            className="pointer-events-none absolute -bottom-10 -right-35 w-70 object-contain sm:bottom-0 2xl:bottom-30 sm:-right-40 md:-right-110 md:w-auto"
                        />
                    </div>

                    {/* TVC */}
                    <div className="relative top-55 mx-auto max-w-6xl px-4 sm:-top-10 sm:px-6 lg:px-0">
                        <div className="inverted-corners-lg overflow-hidden">
                            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                                {tvcLoaded ? (
                                    <iframe
                                        className="absolute inset-0 h-full w-full"
                                        src={`https://www.youtube.com/embed/${content.about.tvcYoutubeId}?rel=0&autoplay=1`}
                                        title="TVC"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => setTvcLoaded(true)}
                                        className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black"
                                    >
                                        <img
                                            src={`https://img.youtube.com/vi/${content.about.tvcYoutubeId}/hqdefault.jpg`}
                                            alt="TVC"
                                            loading="lazy"
                                            decoding="async"
                                            className="absolute inset-0 h-full w-full object-cover"
                                        />
                                        <svg className="relative z-10 h-16 w-16 text-white drop-shadow-lg" viewBox="0 0 68 48"><path d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55C3.97 2.33 2.27 4.81 1.48 7.74.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z" fill="red"/><path d="M45 24L27 14v20" fill="white"/></svg>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <img
                            src="/leaf.webp"
                            alt=""
                            loading="lazy"
                            decoding="async"
                            className="pointer-events-none absolute top-0 left-4 w-90 md:w-auto object-contain sm:-top-25 sm:-left-20 sm:block z-10"
                        />
                        <img
                            src="/gradient-from-t.webp"
                            alt=""
                            loading="lazy"
                            decoding="async"
                            className="pointer-events-none absolute  md:top-0 md:left-0 w-screen object-cover"
                        />
                        <div className="absolute top-35 md:top-25 left-0 z-20 flex w-screen flex-col items-center font-light text-secondary">
                            <div className="flex flex-col items-center sm:flex-row sm:justify-center md:items-start sm:gap-5">
                                <span className="font-sagire text-7xl sm:text-3xl md:text-6xl">
                                    {content.about.secondHeadingLine1Part1}
                                </span>
                                <span className="font-alishanty text-6xl sm:text-4xl md:text-7xl">{content.about.secondHeadingLine1Part2}</span>
                            </div>
                            <div className="flex flex-col items-center sm:flex-row sm:justify-center md:items-start sm:gap-5">
                                <span className="font-sagire text-7xl sm:text-3xl md:text-6xl">
                                    {content.about.secondHeadingLine2Part1}
                                </span>
                                <span className="font-alishanty text-6xl sm:text-4xl md:text-7xl">{content.about.secondHeadingLine2Part2}</span>
                            </div>
                        </div>
                        <img
                            src={resolveUploadUrl(content.about.bannerImage)}
                            alt=""
                            loading="lazy"
                            decoding="async"
                            className="mt-10 w-full object-contain hidden md:block sm:mt-0 rounded-b-3xl"
                        />
                        <img
                            src={resolveUploadUrl(content.about.bannerImageMobile)}
                            alt=""
                            loading="lazy"
                            decoding="async"
                            className="mt-60 w-full object-contain md:hidden rounded-b-3xl"
                        />
                        {/* Stats card */}
                        <div className="absolute bottom-0 mb-20 md:bottom-0 left-1/2 md:mb-10 w-[calc(100%-2rem)] max-w-6xl -translate-x-1/2 rounded-2xl bg-[#FFFFFFCC] px-6 py-8 backdrop-blur-xs sm:w-full sm:px-0 sm:py-5 sm:pr-7">
                            <p className="mx-auto max-w-xl text-center text-sm font-medium leading-relaxed text-black sm:text-base">
                                {content.about.statsParagraph}
                            </p>
                            <div className="mt-5 grid grid-cols-2 gap-x-0 gap-y-8 sm:mt-5 sm:grid-cols-3 sm:gap-6 md:grid-cols-5 md:gap-0">
                                {content.about.stats.map((stat, i) => (
                                    <div
                                        key={stat.value}
                                        className={`text-center px-1${i === 4 ? ' max-sm:col-span-2 max-sm:flex max-sm:flex-col max-sm:items-center' : ''}${i % 2 !== 0 ? ' border-l border-black/20' : ''
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
                            src="/map-balanca.webp"
                            alt=""
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full hidden md:block object-cover rounded-3xl"
                        />
                        <div
                            ref={mobileMapScrollRef}
                            className="md:hidden overflow-x-auto overflow-y-hidden rounded-3xl"
                            style={{ height: 'calc(100vw * 1228 / 375)' }}
                        >
                            <img
                                src="/map-mobile-full.svg"
                                alt=""
                                loading="lazy"
                                decoding="async"
                                width={800}
                                height={2620}
                                onLoad={(e) => {
                                    const img = e.currentTarget
                                    requestAnimationFrame(() => {
                                        const c = mobileMapScrollRef.current
                                        if (!c) return
                                        c.scrollLeft = (img.scrollWidth - c.clientWidth) / 1.55
                                    })
                                }}
                                className="h-full w-auto max-w-none"
                            />
                        </div>
                        <div className="group/pin hidden md:block absolute left-[33.9%] top-[49.9%] w-[8%] -translate-x-1/2 -translate-y-1/2">
                            <img
                                src="/balanca-sign.png"
                                alt=""
                                loading="lazy"
                                decoding="async"
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
                                            {content.map.title}
                                        </h1>
                                        <span className="mt-2 font-inter font-medium uppercase text-lg sm:text-lg md:text-xl text-secondary">
                                            {content.map.subtitle}
                                        </span>
                                        <div className="mt-2 md:mt-10 text-base font-medium text-justify text-black max-w-md">{content.map.description}</div>
                                        <div className="pointer-events-auto mt-6 w-full max-w-md overflow-y-auto max-h-60 location-scrollbar" data-lenis-prevent>
                                            {content.map.locations.map((item, i, arr) => (
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
                                        <button onClick={() => setDownloadOpen(true)} className="pointer-events-auto rounded-xl mt-4 bg-secondary px-5 py-4 text-sm font-semibold uppercase tracking-wider text-white transition-opacity hover:opacity-90 cursor-pointer">
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
                    className="relative z-10 rounded-t-3xl bg-white py-8 md:mb-10"
                >
                    <div className="mx-auto">
                        <div className="mx-auto max-w-7xl flex flex-col gap-1 px-6 sm:px-10 lg:px-14 mb-6 md:mb-0">
                            <h1 className="font-sagire px-6 md:px-0 text-5xl text-secondary leading-[1.3] text-center md:text-left">
                                {content.features.title}
                            </h1>
                            <span className="font-inter font-medium uppercase text-lg sm:text-lg md:text-xl text-secondary text-center md:text-left">
                                {content.features.subtitle}
                            </span>
                        </div>
                        <div className="mx-auto max-w-7xl 2xl:max-w-max flex flex-col gap-8 rounded-2xl pb-10 px-6 sm:px-10 sm:py-12 md:flex-row md:items-center md:gap-12 lg:px-14">
                            <p className="max-w-sm text-base text-justify leading-relaxed text-black font-medium md:shrink-0 md:text-base">
                                {content.features.description}
                            </p>
                            <div className="grid flex-1 grid-cols-2 gap-x-0 gap-y-8 sm:grid-cols-5 sm:gap-6 md:gap-0">
                                {content.features.stats.map((stat, i) => (
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
                        <div className="mb-5">
                            <div className="relative flex max-sm:justify-start sm:justify-center max-sm:overflow-x-auto max-sm:scrollbar-none">
                                <div className="pointer-events-none absolute bottom-0 h-px w-[80%] bg-black/10 max-sm:hidden" />
                                <div className="relative z-10 flex items-center gap-8 sm:gap-12 max-sm:pl-6 max-sm:pr-6">
                                    {[
                                        { key: 'all', label: 'Tất cả' },
                                        { key: 'health-care', label: 'Tiện ích sức khoẻ' },
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
                                                    loading="lazy"
                                                    decoding="async"
                                                    className="aspect-3/4 w-full object-cover hover:scale-105 transition-transform duration-500 sm:aspect-video"
                                                />
                                                <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/30 via-black/30 to-transparent backdrop-blur-[2px] px-6 pb-6 sm:px-10 sm:pb-8">
                                                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between">
                                                        <h3 className="font-sagire text-xl text-balance text-white sm:text-2xl md:text-3xl">
                                                            {slide.title}
                                                        </h3>
                                                        {/* <p className="max-w-md text-sm text-justify text-white/80 sm:text-base 2xl:max-w-2xl">
                                                            {slide.desc}
                                                        </p> */}
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
                                className="rounded-xl absolute left-[2%] top-1/2 z-10 hidden items-center justify-center bg-white text-secondary transition-colors duration-500 hover:bg-secondary hover:text-white cursor-pointer sm:flex sm:h-12 sm:w-12"
                            >
                                <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                            </button>
                            <button
                                onClick={nextSlide}
                                aria-label="Next slide"
                                className="rounded-xl absolute right-[2%] top-1/2 z-10 hidden items-center justify-center bg-white text-secondary transition-colors duration-500 hover:bg-secondary hover:text-white cursor-pointer sm:flex sm:h-12 sm:w-12"
                            >
                                <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
                            </button>
                        </div>
                    </div>
                </section>

                {/* Products */}
                <section id="products" className="relative pt-0">
                    <div className="relative">
                        <img
                            src="/leaf.webp"
                            alt=""
                            loading="lazy"
                            decoding="async"
                            className="pointer-events-none absolute -top-10 -right-70 hidden w-auto object-contain sm:block z-20"
                        />

                        <div className="absolute top-10 z-20 flex w-screen flex-col items-center font-light text-secondary">
                            <div className="flex flex-col items-center sm:flex-row sm:justify-center md:items-start sm:gap-5">
                                <span className="font-sagire text-7xl sm:text-3xl md:text-6xl">
                                    {content.products.heading1Part1}
                                </span>
                                <span className="font-alishanty text-6xl sm:text-4xl md:text-7xl">{content.products.heading1Part2}</span>
                            </div>
                            <div className="flex flex-col items-center sm:flex-row sm:justify-center md:items-start sm:gap-5">
                                <span className="font-sagire text-7xl sm:text-3xl md:text-6xl">
                                    {content.products.heading2Part1}
                                </span>
                                <span className="font-alishanty text-6xl sm:text-4xl md:text-7xl">{content.products.heading2Part2}</span>
                            </div>
                        </div>
                        <img
                            src={resolveUploadUrl(content.products.bannerImage)}
                            alt=""
                            loading="lazy"
                            decoding="async"
                            className="hidden md:block mt-10 w-full object-contain md:mt-0 rounded-b-3xl"
                        />
                        <img
                            src={resolveUploadUrl(content.products.bannerImageMobile)}
                            alt=""
                            loading="lazy"
                            decoding="async"
                            className="block md:hidden w-full object-contain rounded-b-3xl"
                        />
                        <div className="absolute bottom-0 left-1/2 md:mb-10 w-full max-w-6xl -translate-x-1/2 py-8 sm:py-5 px-6 md:px-0">
                            <p className="mx-auto max-w-2xl text-center text-sm font-medium leading-relaxed text-black md:text-white sm:text-base 2xl:text-lg">
                                {content.products.description}
                            </p>
                        </div>
                    </div>
                    <div className="relative md:min-h-[900px]">
                        <img
                            src="/bg-pattern.png"
                            alt=""
                            loading="lazy"
                            decoding="async"
                            className="pointer-events-none object-cover hidden md:block"
                        />
                        {/* Overlay: title + description + award | carousel */}
                        <div className="relative z-10 flex items-center md:absolute md:inset-0">
                            <div className="mx-auto flex w-full h-full flex-col gap-8 pb-20 md:py-0 md:pt-20 pr-0 md:flex-row md:items-stretch md:gap-20 2xl:gap-0 lg:pl-20">
                                {/* Left column */}
                                <div className="flex flex-col justify-center md:w-1/3 md:shrink-0 ">
                                    <h2 className="px-6 md:px-0 md:pl-0 font-sagire text-5xl leading-tight text-secondary sm:text-4xl text-center md:text-center max-w-md">
                                        {content.products.architectTitle}
                                    </h2>
                                    {/* <div className="flex justify-center md:justify-start items-center">
                                        <p className="mt-2 text-center md:text-left font-sagire text-5xl leading-none text-secondary sm:text-5xl md:mt-2 md:text-4xl">
                                            “<span className="text-5xl sm:text-6xl md:text-4xl">3</span> trong <span className="text-5xl sm:text-6xl md:text-4xl">1</span>”
                                        </p>
                                        <p className="mt-2 ms-3 text-secondary font-medium">
                                            Thiết kết <br /> bởi KTS
                                        </p>
                                    </div> */}
                                    <span className="mt-5 font-alishanty text-center font-medium text-secondary text-6xl md:mt-2 max-w-md">
                                        {content.products.architectName}
                                    </span>
                                    <p className="px-6 md:px-0 mt-7 md:mt-5 text-base leading-relaxed text-center md:text-justify text-black max-w-md">
                                        {content.products.architectDescription}
                                    </p>
                                    <div className="mt-6 flex flex-col gap-5 px-6 md:px-0 max-w-md">
                                        {content.products.awards.map((award, i) => (
                                            <div key={i} className="flex flex-col md:flex-row items-center md:items-center gap-4 min-w-0">
                                                <img
                                                    src={resolveUploadUrl(award.image)}
                                                    alt={award.title}
                                                    loading="lazy"
                                                    decoding="async"
                                                    className="w-60 shrink-0 object-contain sm:w-50 inverted-corners-lg"
                                                />
                                                <p className="min-w-0 text-base text-center md:text-left px-11 md:px-0 leading-relaxed text-black font-semibold">
                                                    {award.description}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Right column — carousel, touches right edge */}
                                <div className={`relative flex-1 [--ext-sw:88%] [--ext-so:6%] [--ext-gap:0px] md:[--ext-sw80%] md:[--ext-so:0%] md:[--ext-gap:12px] ${extIsFirst ? '[--ext-so:6%]' : extIsLast ? '[--ext-so:6%]' : '[--ext-so:6%]'} md:pr-0 md:min-h-0`}>
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
                                                            loading="lazy"
                                                            decoding="async"
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
                                        className="rounded-xl absolute -left-6 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center bg-secondary text-white transition-colors duration-300 hover:bg-secondary/90 hover:text-white cursor-pointer md:flex"
                                    >
                                        <ChevronLeft className="h-6 w-6" />
                                    </button>
                                    <button
                                        onClick={extNext}
                                        aria-label="Next"
                                        className="rounded-xl absolute right-8 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center bg-secondary text-white transition-colors duration-300 hover:bg-secondary/90 hover:text-white cursor-pointer md:flex md:right-5"
                                    >
                                        <ChevronRight className="h-6 w-6" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="relative">
                        <img
                            src="/bg-pattern-2.webp"
                            alt=""
                            loading="lazy"
                            decoding="async"
                            className="pointer-events-none justify-self-end hidden md:block"
                        />
                        <div className="relative z-10 flex items-center pb-6 sm:py-5 md:absolute md:inset-0 md:mt-10">
                            <div className="flex h-full min-h-0 w-full flex-col justify-center gap-8 md:flex-row md:items-stretch md:justify-start md:gap-0 lg:pr-10">
                                {/* Left — image carousel */}
                                <div className="relative flex min-w-0 w-full flex-col justify-start md:w-[65%] md:shrink-0">
                                    <div className="flex flex-col md:flex-row items-center mb-10">
                                        <h2 className="whitespace-nowrap px-6 text-center md:text-left font-alishanty text-5xl sm:text-6xl text-secondary md:pl-10 lg:pl-20">
                                            {content.products.parkHomeHeading}
                                        </h2>
                                        <div className="flex flex-col gap-2 text-center md:text-start mt-5 md:mt-0">
                                            <span className="font-sagire text-3xl md:text-4xl text-secondary">
                                                {content.products.parkHomeSubheading1}
                                            </span>
                                            <span className="sm:whitespace-nowrap font-sagire text-3xl md:text-4xl text-secondary">
                                                {content.products.parkHomeSubheading2}
                                            </span>
                                        </div>
                                    </div>

                                    <div
                                        className="w-full overflow-hidden max-md:rounded-none md:aspect-3/2 md:rounded-r-3xl md:max-h-[360px] lg:max-h-[1000px] touch-pan-y"
                                        onTouchStart={onProdTouchStart}
                                        onTouchMove={onProdTouchMove}
                                        onTouchEnd={onProdTouchEnd}
                                    >
                                        <div
                                            className="flex md:h-full min-h-0 shrink-0 transition-transform duration-600 ease-in-out"
                                            style={{
                                                width: `${prodGalleryLen * 100}%`,
                                                transform: `translateX(-${(safeProdSlideIdx * 100) / prodGalleryLen}%)`,
                                            }}
                                        >
                                            {productGalleryImages.map((src, i) => (
                                                <div
                                                    key={`${productFilter}-${src}-${i}`}
                                                    className="box-border md:h-full min-h-0 shrink-0 overflow-hidden md:inverted-corners-lg-r"
                                                    style={{ flex: `0 0 ${100 / prodGalleryLen}%` }}
                                                >
                                                    <div className="md:h-full min-h-0 overflow-hidden max-md:[-webkit-mask:none] max-md:[mask:none] md:inverted-corners-lg-r">
                                                        <img
                                                            src={src}
                                                            alt=""
                                                            loading="lazy"
                                                            decoding="async"
                                                            className="aspect-3/4 w-full object-cover transition-transform duration-500 hover:scale-105 md:aspect-auto md:h-full md:max-h-full md:max-w-full"
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Right — info panel */}
                                <div className="flex w-full flex-1 flex-col justify-center px-6 sm:px-10 md:px-12 md:max-w-lg 2xl:max-w-max md:mt-20">
                                    <h3 className="text-center font-sagire md:max-w-lg text-3xl text-secondary md:text-start md:text-4xl">
                                        {parkHomeProduct.title}
                                    </h3>

                                    <div className="relative mt-6 flex justify-center sm:justify-start max-sm:overflow-x-auto max-sm:scrollbar-none">
                                        <div className="pointer-events-none absolute bottom-0 h-px w-full bg-black/10 max-sm:hidden" />
                                        <div className="relative z-10 flex items-center gap-8 sm:gap-12 max-sm:pl-0 max-sm:pr-0">
                                            {(
                                                [
                                                    { key: 'exterior' as const, label: content.products.parkHomeExteriorLabel },
                                                    { key: 'interior' as const, label: content.products.parkHomeInteriorLabel },
                                                ] as const
                                            ).map((tab) => (
                                                <button
                                                    key={tab.key}
                                                    type="button"
                                                    onClick={() => { setProdSlideIdx(0); setProductFilter(tab.key) }}
                                                    className={`relative cursor-pointer whitespace-nowrap pb-1 text-base font-semibold tracking-widest transition-colors duration-300 sm:text-sm 2xl:text-base uppercase ${productFilter === tab.key
                                                        ? 'text-secondary after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-secondary'
                                                        : 'text-[#0F4672] after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 hover:after:scale-x-100'
                                                        }`}
                                                >
                                                    {tab.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mt-4 w-full max-md:max-w-none">
                                        <p className="text-base leading-relaxed text-black font-semibold mb-2">
                                            {productFilter === 'exterior' ? content.products.parkHomeExteriorTitle : content.products.parkHomeInteriorTitle}
                                        </p>
                                        <p className="text-base text-justify leading-relaxed text-black ">
                                            {content.products.parkHomeDescription}
                                        </p>
                                    </div>

                                    <div className="mt-8 flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-2 sm:gap-4">
                                            <button
                                                onClick={prodPrev}
                                                aria-label="Ảnh trước"
                                                className="rounded-xl flex h-10 w-10 shrink-0 items-center justify-center bg-secondary text-white transition-colors duration-300 hover:bg-secondary/80 cursor-pointer sm:h-12 sm:w-12"
                                            >
                                                <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                                            </button>
                                            <button
                                                onClick={prodNext}
                                                aria-label="Ảnh sau"
                                                className="rounded-xl flex h-10 w-10 shrink-0 items-center justify-center bg-secondary text-white transition-colors duration-300 hover:bg-secondary/80 cursor-pointer sm:h-12 sm:w-12"
                                            >
                                                <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
                                            </button>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setDownloadOpen(true)}
                                            className="rounded-xl shrink-0 bg-[#0F4672] px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white transition-opacity hover:opacity-90 cursor-pointer sm:px-5 sm:py-4 sm:text-sm"
                                        >
                                            Tải tài liệu dự án
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="relative">
                        <img
                            src="/bg-pattern-3.webp"
                            alt=""
                            loading="lazy"
                            decoding="async"
                            className="pointer-events-none object-cover hidden md:block"
                        />
                        <div className="relative z-10 flex items-stretch px-6 py-10 sm:px-10 sm:py-14 md:absolute md:inset-0 md:pr-0 md:pb-16 md:pt-0 2xl:pt-16 lg:pl-20">
                            <div className="flex w-full flex-col gap-10 md:flex-row md:items-stretch md:gap-20 2xl:gap-0">
                                {/* Left column — 1/3 — title + logo + paragraph */}
                                <div className="flex flex-col justify-center items-center md:items-start md:w-1/3 md:shrink-0">
                                    <div className="font-sagire text-secondary flex flex-col gap-2 text-center">
                                        <span className="text-4xl sm:text-4xl md:text-5xl lg:text-5xl">{content.products.operationsTitle1}</span>
                                        <span className="text-4xl sm:text-4xl md:text-5xl lg:text-5xl">{content.products.operationsTitle2}</span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <p className="mt-3 md:mt-5 text-sm font-medium text-center uppercase tracking-[0.15em] text-secondary sm:text-base">
                                            {content.products.operationsSubtitle}
                                        </p>
                                        <img
                                            src={resolveUploadUrl(content.products.villageLogoUrl)}
                                            alt="M Village"
                                            loading="lazy"
                                            decoding="async"
                                            className="mt-8 h-24 self-center object-contain sm:h-28 lg:h-32"
                                        />
                                        <p className="mt-6 max-w-md text-base text-center text-pretty leading-relaxed text-black">
                                            {content.products.villageDescription}
                                        </p>
                                    </div>

                                </div>

                                {/* Right column — 2/3 — vertical-style image carousel */}
                                <div className={`relative flex-1 [--vil-sw:88%] [--vil-so:6%] [--vil-gap:0px] md:[--vil-sw:55%] md:[--vil-so:0%] md:[--vil-gap:12px] md:pr-0 md:min-h-0`}>
                                    <div className="overflow-hidden rounded-l-3xl touch-pan-y md:h-full" onTouchStart={handleVilTouchStart} onTouchMove={handleVilTouchMove} onTouchEnd={handleVilTouchEnd}>
                                        <div
                                            ref={vilTrackRef}
                                            className="flex transition-transform duration-500 ease-in-out md:h-full"
                                            style={{
                                                transform: vilIdx === vilMax
                                                    ? `translateX(calc(100% - ${villageImages.length} * var(--vil-sw) - ${villageImages.length - 1} * var(--vil-gap) + ${vilDragOffset}px))`
                                                    : `translateX(calc(var(--vil-so) - ${vilIdx} * var(--vil-sw) - ${vilIdx} * var(--vil-gap) + ${vilDragOffset}px))`,
                                            }}
                                        >
                                            {villageImages.map((slide) => (
                                                <div
                                                    key={slide.src}
                                                    className="w-(--vil-sw) shrink-0 px-1.5"
                                                >
                                                    <div className="inverted-corners-lg relative overflow-hidden md:h-full">
                                                        <img
                                                            src={slide.src}
                                                            alt={slide.title}
                                                            loading="lazy"
                                                            decoding="async"
                                                            className="aspect-3/4 w-full object-cover transition-transform duration-500 hover:scale-105 md:aspect-auto md:h-full md:w-full"
                                                        />
                                                        {/* <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/60 via-black/30 to-transparent px-6 pb-6 sm:px-8 sm:pb-8">
                                                            <h3 className="font-sagire text-xl text-white sm:text-2xl md:text-3xl">
                                                                {slide.title}
                                                            </h3>
                                                            <p className="mt-2 text-xs text-white/85 sm:text-sm">
                                                                {slide.desc}
                                                            </p>
                                                        </div> */}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <button
                                        onClick={vilPrev}
                                        aria-label="Previous"
                                        className="rounded-xl absolute -left-6 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center bg-secondary text-white transition-colors duration-300 hover:bg-secondary/90 hover:text-white cursor-pointer md:flex"
                                    >
                                        <ChevronLeft className="h-6 w-6" />
                                    </button>
                                    <button
                                        onClick={vilNext}
                                        aria-label="Next"
                                        className="rounded-xl absolute right-8 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center bg-secondary text-white transition-colors duration-300 hover:bg-secondary/90 hover:text-white cursor-pointer md:flex md:right-5"
                                    >
                                        <ChevronRight className="h-6 w-6" />
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* <img
                            src="/bg-emblem.png"
                            alt=""
                            className="pointer-events-none hidden object-cover sm:block absolute -bottom-120 right-0"
                        /> */}
                    </div>
                </section>

                {/* Value */}
                <section id="value" className="relative">
                    <div className="relative rounded-t-3xl overflow-hidden">
                        <img
                            src={resolveUploadUrl(content.value.bannerImage)}
                            alt=""
                            loading="lazy"
                            decoding="async"
                            className="w-full object-contain hidden md:block"
                        />
                        <img
                            src={resolveUploadUrl(content.value.bannerImageMobile)}
                            alt=""
                            loading="lazy"
                            decoding="async"
                            className="w-full object-contain block md:hidden"
                        />
                        <img
                            src="/gradient-from-top-r.webp"
                            alt=""
                            loading="lazy"
                            decoding="async"
                            className="pointer-events-none hidden object-cover sm:block absolute top-0 right-0"
                        />
                        {/* Title + description overlay */}
                        <div className="pointer-events-none absolute top-10 md:top-20 justify-self-center md:right-[3%] flex md:pr-6 mx-6 md:mx-0">
                            <div className="text-center md:text-right lg:max-w-lg">
                                <h2 className="text-secondary">
                                    <span className="font-sagire text-7xl sm:text-5xl md:text-6xl lg:text-6xl">{content.value.heading1Part1}</span>
                                    <span className="inline-block md:translate-y-[0.35em] px-5 font-alishanty text-6xl sm:text-5xl md:text-6xl">{' '}{content.value.heading1Part2}</span>
                                </h2>
                                <h2 className="mt-2 text-secondary sm:-mt-3">
                                    <span className="font-sagire text-7xl sm:text-5xl md:text-6xl lg:text-6xl">{content.value.heading2Part1}</span>
                                    <span className="inline-block md:translate-y-[0.35em] px-5 font-alishanty text-6xl sm:text-5xl md:text-6xl">{' '}{content.value.heading2Part2}</span>
                                </h2>
                                <p className="mt-4 md:pl-5 text-base font-medium text-center text-pretty md:text-end justify-end text-black sm:mt-10">
                                    {content.value.paragraph1}
                                </p>
                                <p className="mt-4 md:pl-5 text-base font-medium text-center text-pretty md:text-end justify-end text-black">
                                    {content.value.paragraph2}
                                </p>
                            </div>
                        </div>
                        <img
                            src="/gradient-from-b.webp"
                            alt=""
                            loading="lazy"
                            decoding="async"
                            className="pointer-events-none object-cover sm:block w-full absolute bottom-0 right-0"
                        />
                    </div>
                    <div className="relative flex flex-col gap-8 md:pl-6 py-12 sm:pl-10 sm:py-16 md:flex-row md:items-stretch md:gap-0 lg:pl-20 lg:py-20">
                        {/* Left — text + awards */}
                        <div className="flex flex-col px-6 md:px-0 justify-center md:w-[38%] md:shrink-0 md:pr-10 lg:pr-16 max-w-lg">
                            <h2 className="font-sagire text-center md:text-left text-4xl text-secondary sm:text-4xl md:text-5xl">
                                {content.value.developerTitle}
                            </h2>
                            <p className="mt-2 text-center text-balance md:text-left text-sm font-semibold uppercase tracking-[0.15em] text-secondary">
                                {content.value.developerSubtitle}
                            </p>
                            <p className="mt-5 text-base text-center md:text-justify leading-relaxed text-black">
                                {content.value.developerDescription}
                            </p>
                            {/* Awards */}
                            <div className="mt-10 md:mt-15 flex flex-col gap-5">
                                {content.value.awards.map((award, i) => (
                                    <div key={i} className="relative px-4 md:px-16">
                                        <div className="absolute inset-0 inverted-corners-lg bg-[#FFE4AA]" />
                                        <div className="relative flex items-center justify-center gap-7 py-4">
                                            <img src={resolveUploadUrl(award.image)} alt={award.title} loading="lazy" decoding="async" className="h-28 w-28 shrink-0 object-contain" />
                                            <div>
                                                <span className="font-bold text-secondary text-base">{award.title}</span>
                                                <p className="text-black text-base">{award.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Right — aerial image */}
                        <div className="relative min-h-[300px] flex-1 sm:min-h-[400px] pl-6 md:pl-0 mt-6 md:mt-0">
                            <div className="relative h-full w-full overflow-hidden inverted-corners-lg-l">
                                <img
                                    src={resolveUploadUrl(content.value.aerialImage)}
                                    alt="Casamia Balance aerial view"
                                    loading="lazy"
                                    decoding="async"
                                    className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <img
                                src="/cloud.webp"
                                alt=""
                                loading="lazy"
                                decoding="async"
                                className="pointer-events-none absolute bottom-0 left-0 -translate-x-1/4 translate-y-[60%] w-40 sm:w-100 object-contain z-20"
                            />
                        </div>
                    </div>
                    <div className="relative flex flex-col-reverse gap-8 md:pr-6 pb-12 sm:pr-10 sm:pb-16 md:flex-row md:items-stretch md:gap-0 lg:pr-20 lg:pb-20">
                        {/* Left — scenery image */}
                        <div className="min-h-[300px] flex-1 overflow-hidden sm:min-h-[400px] inverted-corners-lg-r mr-6 md:mr-0">
                            <img
                                src={resolveUploadUrl(content.value.sceneryImage)}
                                alt="Casamia Balance scenery"
                                loading="lazy"
                                decoding="async"
                                className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                        {/* Right — text + button */}
                        <div className="px-6 md:px-0 flex flex-col justify-center md:w-[42%] md:shrink-0 md:pl-10 lg:pl-16 max-w-lg">
                            <h2 className="font-sagire text-4xl leading-tight text-secondary text-center md:text-start sm:text-4xl md:text-5xl">
                                {content.value.deliveryTitle}
                            </h2>
                            <p className="mt-1 text-sm text-balance font-semibold uppercase tracking-[0.15em] text-secondary text-center md:text-start sm:text-sm">
                                {content.value.deliverySubtitle}
                            </p>
                            <ul className="mt-5 list-disc space-y-1 pl-7 leading-relaxed text-black text-base md:max-w-sm">
                                {content.value.deliveryItems.map((item, i) => (
                                    <li key={i}>{item}</li>
                                ))}
                            </ul>
                            <div className="mt-8 flex justify-center md:max-w-sm">
                                <button
                                    type="button"
                                    onClick={() => setDownloadOpen(true)}
                                    className="rounded-xl bg-secondary px-8 py-3 text-sm font-semibold uppercase tracking-wider text-white transition-opacity hover:opacity-90 cursor-pointer sm:text-base"
                                >
                                    Tải tài liệu dự án
                                </button>
                            </div>
                        </div>
                    </div>
                    <img
                        src="/leaf.webp"
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="pointer-events-none object-cover sm:block absolute -bottom-10 md:-bottom-30 right-0"
                    />
                </section>
            </div>
            <div ref={spacerRef} />

            {/* Footer */}
            <footer ref={footerRef} id="contact" className="fixed bottom-0 left-0 right-0 z-50 overflow-hidden rounded-t-3xl bg-secondary will-change-transform" style={{ transform: 'translateY(100%)' }}>
                <section
                    className="relative"
                    style={{
                        backgroundImage: "url('/footer-pattern.webp')",
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'auto',
                    }}
                >
                    <div className="absolute inset-0 bg-secondary/10" />
                    <div className="relative py-14 sm:py-16 px-6 sm:px-10 lg:pl-20 lg:pr-0">
                        <div className="grid gap-12 xl:grid-cols-[minmax(0,480px)_minmax(0,1fr)] xl:items-start">
                            <div>
                                <h3 className="font-sagire text-4xl text-white sm:text-5xl text-center md:text-left">Tin tức</h3>
                                <div className="mt-8 space-y-5">
                                    {NEWS_ARTICLES.slice(0, 3).map((item) => (
                                        <Link
                                            key={item.slug}
                                            to={`/tin-tuc/${item.slug}`}
                                            className="group flex items-start gap-4 text-white/90 transition-opacity hover:opacity-90"
                                        >
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                loading="lazy"
                                                decoding="async"
                                                width={144}
                                                height={96}
                                                className="h-20 w-28 shrink-0 rounded-2xl object-cover sm:h-24 sm:w-36"
                                            />
                                            <div className="min-w-0">
                                                <p className="line-clamp-2 text-sm font-medium leading-6 sm:text-base">
                                                    {item.title}
                                                </p>
                                                <p className="mt-3 text-xs tracking-[0.2em] text-white/35">{item.date}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                                <Link
                                    to="/tin-tuc"
                                    className="mt-8 inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-white"
                                >
                                    Xem thêm
                                    <ChevronRight className="h-4 w-4" />
                                </Link>
                            </div>

                            <div className="min-w-0">
                                <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:justify-between lg:pr-20 xl:pr-10">
                                    <h3 className="font-sagire text-4xl text-white text-center sm:text-left sm:text-5xl">Thư viện</h3>
                                    <div className="flex items-center justify-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/45">
                                        <span className="text-white">Hình ảnh</span>
                                        <span>|</span>
                                        <span>Video</span>
                                        <span>|</span>
                                        <span>Tài liệu</span>
                                    </div>
                                </div>

                                <div className="relative mt-8 [--gal-step:90%] md:[--gal-step:76%]">
                                    <div className="overflow-hidden touch-pan-y rounded-l-3xl" onTouchStart={handleGalleryTouchStart} onTouchMove={handleGalleryTouchMove} onTouchEnd={handleGalleryTouchEnd}>
                                        <div
                                            ref={galleryTrackRef}
                                            className={`flex ${galleryAnimate ? 'transition-transform duration-700 ease-in-out' : ''}`}
                                            style={{ transform: `translateX(calc(-${galleryIdx} * var(--gal-step) - ${galleryIdx} * 16px + ${galleryDragOffset}px))` }}
                                            onTransitionEnd={handleGalleryTransitionEnd}
                                        >
                                            {extendedGallery.map((src, i) => (
                                                <div
                                                    key={`${src}-${i}`}
                                                    className="w-[calc(var(--gal-step)+2%)] shrink-0 pr-4"
                                                >
                                                    <img
                                                        src={src}
                                                        alt="Thư viện Casamia Balanca"
                                                        loading="lazy"
                                                        decoding="async"
                                                        className="h-[250px] w-full rounded-3xl object-cover sm:h-[340px]"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        className="absolute cursor-pointer -left-2 md:-left-6 top-1/2 -translate-y-1/2 z-10 inline-flex h-9 w-9 md:h-11 md:w-11 items-center justify-center rounded-xl bg-white text-secondary transition-opacity hover:opacity-90"
                                        aria-label="Previous gallery item"
                                        onClick={prevGallery}
                                    >
                                        <ChevronLeft className="h-5 w-5" />
                                    </button>
                                    <button
                                        type="button"
                                        className="absolute cursor-pointer top-1/2 -translate-y-1/2 z-10 inline-flex h-9 w-9 md:h-11 md:w-11 items-center justify-center rounded-xl bg-white text-secondary transition-opacity hover:opacity-90 right-2 md:right-[22%]"
                                        aria-label="Next gallery item"
                                        onClick={nextGallery}
                                    >
                                        <ChevronRight className="h-5 w-5" />
                                    </button>
                                </div>

                                <a
                                    href="#"
                                    className="mt-8 inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-white"
                                >
                                    Xem thêm
                                    <ChevronRight className="h-4 w-4" />
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                <Footer data={content.footer} />
            </footer>

            {downloadOpen && (
                <div
                    className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 px-4"
                    onClick={() => setDownloadOpen(false)}
                >
                    <div
                        className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            aria-label="Close"
                            onClick={() => setDownloadOpen(false)}
                            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full text-black/60 hover:bg-black/5 hover:text-black cursor-pointer"
                        >
                            <X className="h-5 w-5" />
                        </button>
                        <h3 className="font-sagire text-2xl text-secondary sm:text-3xl">
                            Tải tài liệu dự án
                        </h3>
                        <form onSubmit={handleDownloadSubmit} className="mt-5 flex flex-col gap-3">
                            <input
                                type="text"
                                required
                                minLength={2}
                                maxLength={60}
                                pattern="[\p{L}\s'\-\.]+"
                                title="Chỉ được nhập chữ cái và khoảng trắng"
                                placeholder="Họ và tên"
                                value={downloadForm.name}
                                onChange={(e) => {
                                    const v = e.target.value.replace(/[^\p{L}\s'\-\.]/gu, '')
                                    setDownloadForm((f) => ({ ...f, name: v }))
                                }}
                                className="w-full rounded-lg border border-black/15 px-4 py-3 text-sm outline-none focus:border-secondary"
                            />
                            <input
                                type="tel"
                                required
                                inputMode="numeric"
                                pattern="[0-9]{9,11}"
                                maxLength={11}
                                title="Số điện thoại phải gồm 9-11 chữ số"
                                placeholder="Số điện thoại"
                                value={downloadForm.phone}
                                onChange={(e) => {
                                    const v = e.target.value.replace(/\D/g, '').slice(0, 11)
                                    setDownloadForm((f) => ({ ...f, phone: v }))
                                }}
                                className="w-full rounded-lg border border-black/15 px-4 py-3 text-sm outline-none focus:border-secondary"
                            />
                            <input
                                type="text"
                                required
                                minLength={2}
                                maxLength={60}
                                pattern="[\p{L}\s'\-\.]+"
                                title="Chỉ được nhập chữ cái và khoảng trắng"
                                placeholder="Nơi ở (Tỉnh/Thành)"
                                value={downloadForm.city}
                                onChange={(e) => {
                                    const v = e.target.value.replace(/[^\p{L}\s'\-\.]/gu, '')
                                    setDownloadForm((f) => ({ ...f, city: v }))
                                }}
                                className="w-full rounded-lg border border-black/15 px-4 py-3 text-sm outline-none focus:border-secondary"
                            />
                            <input
                                type="email"
                                required
                                pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
                                title="Vui lòng nhập email hợp lệ"
                                placeholder="Email"
                                value={downloadForm.email}
                                onChange={(e) => setDownloadForm((f) => ({ ...f, email: e.target.value.trim() }))}
                                className="w-full rounded-lg border border-black/15 px-4 py-3 text-sm outline-none focus:border-secondary"
                            />
                            <button
                                type="submit"
                                className="mt-2 rounded-xl bg-secondary px-5 py-3 text-sm font-semibold uppercase tracking-wider text-white transition-opacity hover:opacity-90 cursor-pointer"
                            >
                                Tải tài liệu dự án
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <Suspense fallback={null}>
                <FloatingButtons phone={content.footer.phone} facebookUrl={content.footer.socialLinks.facebook} zaloUrl={content.footer.socialLinks.zalo} />
            </Suspense>
        </div>
    )
}

export default Home
