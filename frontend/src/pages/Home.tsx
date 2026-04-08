import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLenis } from '../hooks/useLenis'
import { MapPin, ChevronLeft, ChevronRight, Phone, X } from 'lucide-react'
import { NEWS_ARTICLES } from '../data/news'
import Header from '../components/Header'

const FOOTER_GALLERY = [
    '/center-square.png',
    '/carousel-5.png',
    '/infi-pool.jpg',
    '/bar.jpg',
    '/exterior.jpg',
]

function Home() {
    const lenisRef = useLenis()
    const [downloadOpen, setDownloadOpen] = useState(false)
    const [downloadForm, setDownloadForm] = useState({ name: '', phone: '', city: '', email: '' })
    const DOWNLOAD_URL = 'https://drive.google.com/drive/folders/1hK-gZr3IgHwoXaurZJbYyOnfV8XxGgxM?usp=drive_link'
    const handleDownloadSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        window.open(DOWNLOAD_URL, '_blank', 'noopener,noreferrer')
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

    const allSlides = [
        {
            src: '/center-square.png',
            title: 'Quảng trường trung tâm',
            desc: 'Hệ thống cây xanh, mặt nước được kết nối, xếp lớp  tạo nên lá phổi xanh, đảm bảo chất lượng không khí thuần khiết cho khu đô thị.',
            cat: 'health-care',
        },
        {
            src: '/wellness-park.jpg',
            title: 'Công viên Wellness',
            desc: 'Hồ bơi tràn viền hướng biển, mang đến trải nghiệm nghỉ dưỡng đẳng cấp quốc tế.',
            cat: 'health-care',
        },
        {
            src: '/pickleball.jpg',
            title: 'Hệ thống sân Pickle Ball',
            desc: 'Không gian giải trí thượng lưu với tầm nhìn toàn cảnh sông nước và hoàng hôn.',
            cat: 'health-care',
        },
        {
            src: '/gym-and-fitness.jpg',
            title: 'Gym & Fitness',
            desc: 'Không gian giải trí thượng lưu với tầm nhìn toàn cảnh sông nước và hoàng hôn.',
            cat: 'health-care',
        },
        {
            src: '/pool.jpg',
            title: 'Bể bơi tiêu chuẩn Olympic',
            desc: 'Không gian giải trí thượng lưu với tầm nhìn toàn cảnh sông nước và hoàng hôn.',
            cat: 'health-care',
        },
        {
            src: '/school.jpg',
            title: 'Trường mầm non quốc tế',
            desc: 'Không gian giải trí thượng lưu với tầm nhìn toàn cảnh sông nước và hoàng hôn.',
            cat: 'health-care',
        },
        {
            src: '/hotel.jpg',
            title: 'Khách sạn 5 sao',
            desc: 'Không gian giải trí thượng lưu với tầm nhìn toàn cảnh sông nước và hoàng hôn.',
            cat: 'service',
        },
        {
            src: '/mall.jpg',
            title: 'Trung tâm thương mại',
            desc: 'Không gian giải trí thượng lưu với tầm nhìn toàn cảnh sông nước và hoàng hôn.',
            cat: 'service',
        },
        {
            src: '/co-working.jpg',
            title: 'Co-working Space',
            desc: 'Không gian giải trí thượng lưu với tầm nhìn toàn cảnh sông nước và hoàng hôn.',
            cat: 'service',
        },
        {
            src: '/coffee-shop.jpg',
            title: 'Coffee & Bistro',
            desc: 'Không gian giải trí thượng lưu với tầm nhìn toàn cảnh sông nước và hoàng hôn.',
            cat: 'service',
        },
        {
            src: '/bar.jpg',
            title: 'Sky bar',
            desc: 'Không gian giải trí thượng lưu với tầm nhìn toàn cảnh sông nước và hoàng hôn.',
            cat: 'service',
        },
    ]

    const carouselSlides = carouselCat === 'all' ? allSlides : allSlides.filter((s) => s.cat === carouselCat)

    const [slideIdx, setSlideIdx] = useState(1)
    const [animate, setAnimate] = useState(true)

    // Exterior carousel
    const exteriorImages = [
        '/carousel-5.png',
        '/river.jpg',
        '/pool-view.jpg',
    ]
    const [extIdx, setExtIdx] = useState(0)
    const extMax = exteriorImages.length - 1
    const extPrev = () => setExtIdx((i) => Math.max(0, i - 1))
    const extNext = () => setExtIdx((i) => Math.min(extMax, i + 1))

    useEffect(() => {
        const id = setInterval(() => setExtIdx((i) => (i >= extMax ? 0 : i + 1)), 5000)
        return () => clearInterval(id)
    }, [extMax])

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

    // Village / operations carousel — same behaviour as exterior carousel
    const villageImages = [
        { src: '/carousel-1.png', title: 'Công viên chủ đề và các tuyến phố cây xanh', desc: 'Hệ thống cây xanh, mặt nước được kết nối, xếp lớp tạo nên lá phổi xanh, đảm bảo chất lượng không khí thuần khiết cho khu đô thị.' },
        { src: '/carousel-2.png', title: 'Công viên chủ đề và các tuyến phố cây xanh', desc: 'Hệ thống cây xanh, mặt nước được kết nối, xếp lớp tạo nên lá phổi xanh, đảm bảo chất lượng không khí thuần khiết cho khu đô thị.' },
        { src: '/carousel-3.png', title: 'Công viên chủ đề và các tuyến phố cây xanh', desc: 'Hệ thống cây xanh, mặt nước được kết nối, xếp lớp tạo nên lá phổi xanh, đảm bảo chất lượng không khí thuần khiết cho khu đô thị.' },
        { src: '/carousel-6.jpg', title: 'Công viên chủ đề và các tuyến phố cây xanh', desc: 'Hệ thống cây xanh, mặt nước được kết nối, xếp lớp tạo nên lá phổi xanh, đảm bảo chất lượng không khí thuần khiết cho khu đô thị.' },
    ]
    const [vilIdx, setVilIdx] = useState(0)
    const vilMax = villageImages.length - 1
    const vilPrev = () => setVilIdx((i) => Math.max(0, i - 1))
    const vilNext = () => setVilIdx((i) => Math.min(vilMax, i + 1))

    useEffect(() => {
        const id = setInterval(() => setVilIdx((i) => (i >= vilMax ? 0 : i + 1)), 5000)
        return () => clearInterval(id)
    }, [vilMax])
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
        const containerW = vilTrackRef.current?.parentElement?.offsetWidth ?? window.innerWidth
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
        title: 'Concept đương đại – Tối ưu lưu trú, đón khách toàn cầu',
        exteriorImages: ['/ParkHome/exterior/livingroom.jpg', '/ParkHome/exterior/kitchen.jpg', '/ParkHome/exterior/bathroom.jpg', '/ParkHome/exterior/bedroom.jpg', '/ParkHome/exterior/bedroom-2.jpg', '/ParkHome/exterior/bedroom-3.jpg', '/ParkHome/exterior/reading-room.jpg'],
        interiorImages: ['/ParkHome/interior/livingroom.jpg', '/ParkHome/interior/kitchen.jpg', '/ParkHome/interior/readingroom.jpg', '/ParkHome/interior/washingroom.jpg', '/ParkHome/interior/bathroom.jpg', '/ParkHome/interior/garden.jpg'],
    } as const
    type ProductFilter = 'exterior' | 'interior'
    const [productFilter, setProductFilter] = useState<ProductFilter>('exterior')
    const [prodSlideIdx, setProdSlideIdx] = useState(0)
    const productGalleryImages =
        productFilter === 'exterior' ? parkHomeProduct.exteriorImages : parkHomeProduct.interiorImages
    const prodGalleryLen = productGalleryImages.length

    useEffect(() => {
        setProdSlideIdx(0)
    }, [productFilter])

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

    useEffect(() => {
        const id = setInterval(() => prodNext(), 5000)
        return () => clearInterval(id)
    }, [productFilter])

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
        const id = setInterval(() => nextSlide(), 5000)
        return () => clearInterval(id)
    }, [carouselCat])

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

    // Footer gallery carousel
    const extendedGallery = [
        FOOTER_GALLERY[FOOTER_GALLERY.length - 1],
        ...FOOTER_GALLERY,
        FOOTER_GALLERY[0],
    ]
    const galleryIsFirst = galleryIdx <= 1
    const galleryIsLast = galleryIdx >= FOOTER_GALLERY.length

    const prevGallery = () => { setGalleryAnimate(true); setGalleryIdx((i) => i - 1) }
    const nextGallery = () => { setGalleryAnimate(true); setGalleryIdx((i) => i + 1) }

    useEffect(() => {
        const id = setInterval(() => nextGallery(), 5000)
        return () => clearInterval(id)
    }, [])

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
        const containerW = galleryTrackRef.current?.parentElement?.offsetWidth ?? window.innerWidth
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
            setGalleryIdx(FOOTER_GALLERY.length)
        } else if (galleryIdx === extendedGallery.length - 1) {
            setGalleryAnimate(false)
            setGalleryIdx(1)
        }
    }

    return (
        <div className="min-h-screen overflow-x-clip">
            <div ref={contentRef} className="sticky">
                <Header lenisRef={lenisRef} />

                {/* Hero */}
                <section className="relative flex h-screen items-center justify-center overflow-hidden rounded-b-4xl" id="hero">
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
                                <span className="block text-4xl sm:inline sm:text-3xl md:text-5xl">
                                    Là mỗi ngày
                                </span>
                                <span className="text-4xl sm:text-3xl md:text-5xl">
                                    sống{' '}
                                </span>
                                <span className="text-[3rem] sm:text-4xl md:text-6xl">Khoẻ</span>
                            </div>
                            <div className="font-sagire font-light leading-snug text-secondary sm:flex sm:items-center sm:justify-center sm:gap-3">
                                <span className="block text-4xl sm:inline sm:text-3xl md:text-5xl">
                                    Là nếp nhà
                                </span>
                                <span className="text-4xl sm:text-3xl md:text-5xl">
                                    sống{' '}
                                </span>
                                <span className="text-[3rem] sm:text-4xl md:text-6xl">An</span>
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
                            className="pointer-events-none absolute top-0 left-4 w-90 md:w-auto object-contain sm:-top-25 sm:-left-20 sm:block z-10"
                        />
                        <img
                            src="/gradient-from-t.png"
                            alt=""
                            className="pointer-events-none absolute top-30 md:top-0 md:left-0 w-screen object-cover"
                        />
                        <div className="absolute top-35 left-0 z-20 flex w-screen flex-col items-center font-light text-secondary">
                            <div className="flex flex-col items-center sm:flex-row sm:justify-center md:items-start sm:gap-5">
                                <span className="font-sagire text-7xl sm:text-3xl md:text-6xl">
                                    An cư
                                </span>
                                <span className="font-alishanty text-6xl sm:text-4xl md:text-7xl">giữa thiên nhiên</span>
                            </div>
                            <div className="flex flex-col items-center sm:flex-row sm:justify-center md:items-start sm:gap-5">
                                <span className="font-sagire text-7xl sm:text-3xl md:text-6xl">
                                    An lành
                                </span>
                                <span className="font-alishanty text-6xl sm:text-4xl md:text-7xl">từng hơi thở</span>
                            </div>
                        </div>
                        <img
                            src="/3.png"
                            alt=""
                            className="mt-10 w-full object-contain hidden md:block sm:mt-0 rounded-b-3xl"
                        />
                        <img
                            src="/3-mobile.png"
                            alt=""
                            className="mt-60 w-full object-contain md:hidden rounded-b-3xl"
                        />
                        {/* Stats card */}
                        <div className="absolute bottom-0 mb-20 md:bottom-0 left-1/2 md:mb-10 w-[calc(100%-2rem)] max-w-6xl -translate-x-1/2 rounded-2xl bg-[#FFFFFFCC] px-6 py-8 backdrop-blur-xs sm:w-full sm:px-0 sm:py-5 sm:pr-7">
                            <p className="mx-auto max-w-xl text-center text-sm font-medium leading-relaxed text-black sm:text-base">
                                Địa thế đắc địa hiếm có, Casamia Balanca Hoi An là nơi mỗi ngày cư dân sống an, sống khỏe cùng hệ sinh thái sông - rừng dừa - vịnh biển.
                            </p>
                            <div className="mt-5 grid grid-cols-2 gap-x-0 gap-y-8 sm:mt-5 sm:grid-cols-3 sm:gap-6 md:grid-cols-5 md:gap-0">
                                {[
                                    { label: 'Tổng\nquy mô', value: '31,1 ha' },
                                    { label: 'Rừng dừa nước\ntự nhiên', value: '3,6 ha' },
                                    { label: 'Diện tích cây xanh,\n mặt nước', value: '8 ha' },
                                    { label: 'Mật độ\nxây dựng', value: '38%' },
                                    { label: 'Cận hải - Cận giang \n- Cận lâm - Cận lộ', value: '04 cận' },
                                ].map((stat, i) => (
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
                                            Khu đô thị sinh thái
                                        </h1>
                                        <span className="mt-2 font-inter font-medium uppercase text-lg sm:text-lg md:text-xl text-secondary">
                                            Liền kề khu dự trữ sinh quyển thế giới
                                        </span>
                                        <div className="mt-10 text-base font-medium text-justify text-black max-w-md">Dự án nằm liền kề rừng dừa Bảy Mẫu 200 năm tuổi, trong vùng đệm của khu dự trữ sinh quyển thế giới Cù Lao Chàm, nơi hội thủy của ba dòng sông lớn: Thu Bồn, Cổ Cò, Trường Giang.</div>
                                        <div className="pointer-events-auto mt-6 w-full max-w-md overflow-y-auto max-h-60 location-scrollbar" data-lenis-prevent>
                                            {[
                                                { name: 'Rừng dừa Bảy Mẫu', time: '1 - 2 phút' },
                                                { name: 'Biển Cửa Đại', time: '5 phút' },
                                                { name: 'Bãi biển An Bàng', time: '5 - 7 phút' },
                                                { name: 'Phố cổ Hội An', time: '5 - 10 phút' },
                                                { name: 'Sân bay quốc tế Đà Nẵng', time: '30 - 40 phút' },
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
                                Sống theo nhịp Hội An
                            </h1>
                            <span className="font-inter font-medium uppercase text-lg sm:text-lg md:text-xl text-secondary text-center md:text-left">
                                Giữa dòng chảy quốc tế
                            </span>
                        </div>
                        <div className="mx-auto max-w-7xl 2xl:max-w-max flex flex-col gap-8 rounded-2xl pb-10 px-6 sm:px-10 sm:py-12 md:flex-row md:items-center md:gap-12 lg:px-14">
                            <p className="max-w-sm text-base text-justify leading-relaxed text-black font-medium md:shrink-0 md:text-base">
                                Sống an lành giữa thiên nhiên và văn hóa bản địa, đồng thời kết nối linh hoạt với cộng đồng quốc tế. Tại đây, mỗi tiện ích được thiết kế để dung hòa hai nhịp: tận hưởng "vibe Hội An" tĩnh tại và trải nghiệm nhịp sống toàn cầu năng động.
                            </p>
                            <div className="grid flex-1 grid-cols-2 gap-x-0 gap-y-8 sm:grid-cols-5 sm:gap-6 md:gap-0">
                                {[
                                    { value: '08', label: 'Ha\ncây xanh' },
                                    { value: '05', label: 'Công viên\nchủ đề' },
                                    { value: '19', label: 'Trụ hoa giấy\nkỷ lục' },
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
                            src="/leaf.png"
                            alt=""
                            className="pointer-events-none absolute -top-10 -right-70 hidden w-auto object-contain sm:block z-20"
                        />

                        <div className="absolute top-10 z-20 flex w-screen flex-col items-center font-light text-secondary">
                            <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-2 md:gap-5">
                                <span className="font-sagire text-7xl sm:text-3xl md:text-6xl">
                                    An nhàn
                                </span>
                                <span className="font-alishanty text-6xl sm:text-4xl md:text-7xl">khai thác</span>
                            </div>
                            <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-2 md:gap-5 mt-2 md:mt-0">
                                <span className="font-sagire text-7xl sm:text-3xl md:text-6xl">
                                    An tâm
                                </span>
                                <span className="font-alishanty text-6xl sm:text-4xl md:text-7xl">sinh lời</span>
                            </div>
                        </div>
                        <img
                            src="/product.png"
                            alt=""
                            className="hidden md:block mt-10 w-full object-contain md:mt-0 rounded-b-3xl"
                        />
                        <img
                            src="/exterior-mobile.png"
                            alt=""
                            className="block md:hidden w-full object-contain rounded-b-3xl"
                        />
                        <div className="absolute bottom-0 left-1/2 mb-10 w-full max-w-6xl -translate-x-1/2 py-8 sm:py-5 px-6 md:px-0">
                            <p className="mx-auto max-w-2xl text-center text-sm font-medium leading-relaxed text-white sm:text-base 2xl:text-lg">
                                Lối kiến trúc giao thoa giữa di sản và tư duy xanh không chỉ tạo nên vẻ đẹp bền vững theo thời gian, mà còn được tính toán để tối ưu công năng lưu trú và trải nghiệm. Không gian vừa tinh tế, giàu bản sắc, vừa phù hợp với nhu cầu vận hành thực tế, giúp chủ sở hữu dễ dàng khai thác, tối ưu hiệu suất cho thuê, tạo dòng tiền ổn định.
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
                            <div className="mx-auto flex w-full h-full flex-col gap-8 py-20 md:py-0 md:pt-20 pr-0 md:flex-row md:items-stretch md:gap-20 2xl:gap-0 lg:pl-20">
                                {/* Left column */}
                                <div className="flex flex-col justify-center md:w-1/3 md:shrink-0 ">
                                    <h2 className="px-6 md:px-0 md:pl-0 font-sagire text-5xl leading-tight text-secondary sm:text-4xl text-center md:text-center max-w-md">
                                        Kiệt tác xanh được thổi hồn bởi KTS
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
                                        Võ Trọng Nghĩa
                                    </span>
                                    <p className="px-6 md:px-0 mt-7 md:mt-5 text-base leading-relaxed text-center md:text-justify text-black max-w-md">
                                        Kiến trúc dự án kế thừa tinh thần Hội An với mái ngói nâu xếp lớp, đá sa thạch Mỹ Sơn và được phát triển bởi KTS Võ Trọng Nghĩa theo định hướng xanh bền vững. Biệt thự thiết kế mở, thông tầng, hệ cửa kính lớn giúp tối ưu ánh sáng và thông gió, tạo không gian thoáng mát, gần gũi thiên nhiên.
                                    </p>
                                    <div className="mt-6 flex flex-col gap-5 px-6 md:px-0 max-w-md">
                                        <div className="flex flex-col md:flex-row items-center md:items-end gap-4 min-w-0">
                                            <img
                                                src="/award.png"
                                                alt="Asia Property Awards 2021"
                                                className="w-60 shrink-0 object-contain sm:w-50"
                                            />
                                            <p className="min-w-0 text-base text-center md:text-left px-11 md:px-0 leading-relaxed text-black font-semibold">
                                                Thiết kế kiến trúc cảnh quan đẹp nhất Việt Nam
                                            </p>
                                        </div>
                                        <div className="flex flex-col md:flex-row items-center md:items-end gap-4 min-w-0">
                                            <img
                                                src="/award-2026.png"
                                                alt="Dự án Đáng sống 2026"
                                                className="w-60 shrink-0 object-contain sm:w-50"
                                            />
                                            <p className="min-w-0 text-base text-center md:text-left px-11 md:px-0 leading-relaxed text-black">
                                                <span className="font-semibold">"Dự án Đáng sống 2026"</span> do VCCI và Tạp chí Diễn đàn Doanh nghiệp tổ chức.
                                            </p>
                                        </div>
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
                            src="/bg-pattern-2.png"
                            alt=""
                            className="pointer-events-none justify-self-end hidden md:block"
                        />
                        <div className="relative z-10 flex items-center pb-6 sm:py-5 md:absolute md:inset-0 md:mt-10">
                            <div className="flex h-full min-h-0 w-full flex-col justify-center gap-8 md:flex-row md:items-stretch md:justify-start md:gap-0 lg:pr-10">
                                {/* Left — image carousel */}
                                <div className="relative flex min-w-0 w-full flex-col justify-start md:w-[65%] md:shrink-0">
                                    <div className="flex flex-col md:flex-row items-center mb-10">
                                        <h2 className="whitespace-nowrap px-6 text-center md:text-left font-alishanty text-5xl sm:text-6xl text-secondary md:pl-10 lg:pl-20">
                                            Park Home
                                        </h2>
                                        <div className="flex flex-col gap-2 text-center md:text-start mt-5 md:mt-0">
                                            <span className="font-sagire text-3xl md:text-4xl text-secondary">
                                                Đón khách quốc tế,
                                            </span>
                                            <span className="sm:whitespace-nowrap font-sagire text-3xl md:text-4xl text-secondary">
                                                kích hoạt dòng tiền ngay lập tức
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
                                                transform: `translateX(-${(prodSlideIdx * 100) / prodGalleryLen}%)`,
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
                                    <h3 className="text-center font-sagire md:max-w-lg text-2xl text-secondary md:text-start sm:text-3xl md:text-4xl">
                                        {parkHomeProduct.title}
                                    </h3>

                                    <div className="relative mt-6 flex max-sm:justify-start sm:justify-start max-sm:overflow-x-auto max-sm:scrollbar-none">
                                        <div className="pointer-events-none absolute bottom-0 h-px w-full bg-black/10 max-sm:hidden" />
                                        <div className="relative z-10 flex items-center gap-8 sm:gap-12 max-sm:pl-0 max-sm:pr-0">
                                            {(
                                                [
                                                    { key: 'exterior' as const, label: 'Mặt ngoài' },
                                                    { key: 'interior' as const, label: 'Nội thất' },
                                                ] as const
                                            ).map((tab) => (
                                                <button
                                                    key={tab.key}
                                                    type="button"
                                                    onClick={() => setProductFilter(tab.key)}
                                                    className={`relative cursor-pointer whitespace-nowrap pb-1 text-sm font-semibold tracking-widest transition-colors duration-300 sm:text-sm 2xl:text-base uppercase ${productFilter === tab.key
                                                        ? 'text-secondary after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-secondary'
                                                        : 'text-[#0F4672] after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 hover:after:scale-x-100'
                                                        }`}
                                                >
                                                    {tab.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mt-6 w-full max-md:max-w-none">
                                        <p className="text-base leading-relaxed text-black font-medium">
                                            Park Home là dòng biệt thự lưu trú tại phân khu sôi động nhất Casamia Balanca Hội An, được thiết kế đa chức năng linh hoạt, tối ưu vận hành. Sản phẩm phù hợp đón đầu nhu cầu lưu trú dài hạn của khách quốc tế tại Hội An – Đà Nẵng, đồng thời là cơ hội đầu tư khan hiếm, tạo dòng tiền ngay.
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
                            src="/bg-pattern-3.png"
                            alt=""
                            className="pointer-events-none object-cover hidden md:block"
                        />
                        <div className="relative z-10 flex items-stretch px-6 py-10 sm:px-10 sm:py-14 md:absolute md:inset-0 md:pr-0 md:pb-16 md:pt-0 2xl:pt-16 lg:pl-20">
                            <div className="flex w-full flex-col gap-10 md:flex-row md:items-stretch md:gap-20 2xl:gap-0">
                                {/* Left column — 1/3 — title + logo + paragraph */}
                                <div className="flex flex-col justify-center items-center md:items-start md:w-1/3 md:shrink-0">
                                    <div className="font-sagire text-secondary flex flex-col gap-2 text-center">
                                        <span className="text-4xl sm:text-4xl md:text-5xl lg:text-5xl">Hợp tác vận hành</span>
                                        <span className="text-4xl sm:text-4xl md:text-5xl lg:text-5xl">& Sinh lời ngay</span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <p className="mt-3 md:mt-5 text-sm font-medium text-center uppercase tracking-[0.15em] text-secondary sm:text-base">
                                            Cùng đơn vị chuyên nghiệp
                                        </p>
                                        <img
                                            src="/logo-village.png"
                                            alt="M Village"
                                            className="mt-8 h-24 self-center object-contain sm:h-28 lg:h-32"
                                        />
                                        <p className="mt-6 max-w-md text-base text-center text-pretty leading-relaxed text-black">
                                            Casamia Balanca thiết lập mô hình vận hành toàn diện, nói chủ đầu tư Đạt Phương kiến tạo nền tảng, M Village trực tiếp vận hành, và chủ nhà an tâm thụ hưởng đồng thời. Sự kết hợp giữa hệ sinh thái bài bản và đơn vị vận hành giàu kinh nghiệm, am hiểu khách quốc tế giúp tối ưu hiệu suất khai thác, đồng thời giải phóng hoàn toàn áp lực quản lý cho chủ nhà đầu tư ở xa.
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
                                    <span className="font-sagire text-7xl sm:text-5xl md:text-6xl lg:text-6xl">An toàn</span>
                                    <span className="inline-block md:translate-y-[0.35em] px-5 font-alishanty text-6xl sm:text-5xl md:text-6xl">{' '}tích sản</span>
                                </h2>
                                <h2 className="mt-2 text-secondary sm:-mt-3">
                                    <span className="font-sagire text-7xl sm:text-5xl md:text-6xl lg:text-6xl">An giữ</span>
                                    <span className="inline-block md:translate-y-[0.35em] px-5 font-alishanty text-6xl sm:text-5xl md:text-6xl">{' '}truyền đời</span>
                                </h2>
                                <p className="mt-4 md:pl-5 text-base font-medium text-center text-pretty md:text-end justify-end text-black sm:mt-10">
                                    100% biệt thự Casamia Balanca sở hữu lâu dài. Tọa lạc trên quỹ đất hiếm trong vùng sinh thái được quy hoạch bảo tồn nghiêm ngặt của Hội An.
                                </p>
                                <p className="mt-4 md:pl-5 text-base font-medium text-center text-pretty md:text-end justify-end text-black">
                                    Tính pháp lý vững chắc đi cùng sự khan hiếm không thể mở rộng tạo nên giá trị bền vững theo thời gian, vừa là tài sản tích lũy an toàn, vừa có thể trao truyền cho nhiều thế hệ.
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
                                Kiên định với triết lý phát triển bền vững, lấy con người làm trung tâm. Đạt Phương gắn bó sâu sắc với Hội An qua các công trình hạ tầng trọng điểm như cầu Đế Võng, Cửa Đại, tuyến ven biển Võ Chí Công…, tích lũy nền tảng về địa chất, thủy văn và cấu trúc đặc thù, từ đó kiến tạo những sản phẩm có giá trị thực, bền vững theo thời gian.
                            </p>
                            {/* Awards */}
                            <div className="mt-10 md:mt-15 flex flex-col gap-5">
                                <div className="relative px-4 md:px-16">
                                    <div className="absolute inset-0 inverted-corners-lg bg-[#FFE4AA]" />
                                    <div className="relative flex items-center justify-center gap-7 py-4">
                                        <img src="/award-top-10.png" alt="Top 10" className="h-28 w-28 shrink-0 object-contain -mt-8 sm:-mt-12" />
                                        <div>
                                            <span className="font-bold text-secondary text-base">TOP 10</span>
                                            <p className="text-black text-base">thương hiệu phát triển bền vững (2025)</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="relative px-4 py-2 md:px-16">
                                    <div className="absolute inset-0 inverted-corners-lg bg-[#FFE4AA]" />
                                    <div className="relative flex items-center justify-center gap-7">
                                        <img src="/award-top-10(2).png" alt="Top 10" className="h-30 w-30 shrink-0 object-contain" />
                                        <div className="">
                                            <span className="font-bold text-secondary text-base">TOP 10</span>
                                            <p className="text-black text-base">nhà thầu xây dựng hạ tầng - công nghiệp uy tín năm 2026</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="relative px-4 md:px-16">
                                    <div className="absolute inset-0 inverted-corners-lg bg-[#FFE4AA]" />
                                    <div className="relative flex items-center justify-center gap-7">
                                        <img src="/award-top-500.png" alt="Top 500" className="h-30 w-30 shrink-0 object-contain" />
                                        <div>
                                            <span className="font-bold text-secondary text-base">TOP 500</span>
                                            <p className="text-black text-base">doanh nghiệp tư nhân lớn nhất Việt Nam</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Right — aerial image */}
                        <div className="relative min-h-[300px] flex-1 sm:min-h-[400px] pl-6 md:pl-0 mt-6 md:mt-0">
                            <div className="relative h-full w-full overflow-hidden inverted-corners-lg-l">
                                <img
                                    src="/exterior-2.png"
                                    alt="Casamia Balance aerial view"
                                    className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                                />
                                <img
                                    src="/logo-datphuong.png"
                                    alt="Dat Phuong logo"
                                    className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2"
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
                            <h2 className="font-sagire text-4xl leading-tight text-secondary text-center md:text-start sm:text-4xl md:text-5xl">
                                03 lựa chọn "may đo" không gian
                            </h2>
                            <p className="mt-1 text-sm font-semibold uppercase tracking-[0.15em] text-secondary text-center md:text-start sm:text-sm">
                                Phương án bàn giao linh hoạt,<br /> tối ưu cho khách hàng
                            </p>
                            <ul className="mt-5 list-disc space-y-1 pl-7 leading-relaxed text-black text-base md:max-w-sm">
                                <li>Hoàn thiện full nội thất - Tham gia chương trình ủy thác cho thuê</li>
                                <li>Hoàn thiện nội thất cơ bản</li>
                                <li>Xây thô hoàn thiện mặt ngoài</li>
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
                        src="/leaf.png"
                        alt=""
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
                        backgroundImage: "url('/footer-pattern.png')",
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

                <div className="relative overflow-hidden">
                    <img
                        src="/bg-footer.png"
                        alt=""
                        className="pointer-events-none absolute inset-0 h-full w-full scale-140 object-cover 2xl:scale-100"
                    />

                    <div className="relative mx-auto max-w-9xl px-6 pb-14 sm:px-10 sm:py-20 lg:px-20">
                        <div className="flex flex-col-reverse gap-12 md:flex-row md:gap-16">
                            {/* Left column — logo, info, socials */}
                            <div className="md:w-[38%] md:shrink-0">
                                <div className="items-center justify-center flex">
                                    <img
                                        src="/logo-footer.png"
                                        alt="Casamia Balanca Hoi An"
                                        className="w-44 object-contain sm:w-52 2xl:w-64"
                                    />
                                </div>

                                <div className="mt-8 space-y-6 text-sm text-white/90 sm:text-base">
                                    <div>
                                        <h3 className="font-bold uppercase tracking-wider text-white">Văn phòng bán hàng</h3>
                                        <p className="mt-2 flex items-start gap-2">
                                            <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                                            <span>Khu đô thị Casamia Balanca Hoi An, Phường Hội An Đông, Thành phố Đà Nẵng</span>
                                        </p>
                                        <p className="mt-1 flex items-center gap-2">
                                            <Phone className="h-4 w-4 shrink-0" />
                                            <span>(+84)90 136 22 88</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <p className="text-xs font-bold uppercase tracking-wider text-white sm:text-sm">Cập nhật thông tin tại</p>
                                    <div className="mt-3 flex gap-3">
                                        <a href="#" className="rounded-xl flex h-10 w-10 items-center justify-center bg-white text-secondary transition-opacity hover:opacity-90">
                                            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.75a8.18 8.18 0 0 0 4.76 1.52V6.84a4.84 4.84 0 0 1-1-.15z" /></svg>
                                        </a>
                                        <a href="#" className="rounded-xl flex h-10 w-10 items-center justify-center bg-white text-secondary transition-opacity hover:opacity-90">
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
                                                className="rounded-xl bg-secondary px-10 py-3 text-sm font-semibold uppercase tracking-wider text-white transition-opacity hover:opacity-90 sm:text-base"
                                            >
                                                Đăng ký tư vấn
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
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
        </div>
    )
}

export default Home
