import { useEffect, useMemo, useState } from 'react'
import { Calendar, ChevronLeft, ChevronRight, FileText, Image as ImageIcon, Video, X } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ScrollToTopButton from '../components/ScrollToTopButton'
import ThankYouModal from '../components/ThankYouModal'
import { GALLERY_CATEGORIES, GALLERY_ITEMS as STATIC_ITEMS, type GalleryCategory, type GalleryItem } from '../data/gallery'
import { trackEvent } from '../utils/tracking'
import { api, resolveUploadUrl } from '../services/api'
import Seo from '../components/Seo'

const ITEMS_PER_PAGE = 6

const CATEGORY_ICON: Record<GalleryCategory, typeof ImageIcon> = {
    image: ImageIcon,
    video: Video,
    document: FileText,
}

function getYouTubeId(url: string): string | null {
    try {
        const u = new URL(url)
        if (u.hostname === 'youtu.be') {
            return u.pathname.slice(1) || null
        }
        if (u.hostname.endsWith('youtube.com') || u.hostname === 'm.youtube.com') {
            if (u.pathname === '/watch') return u.searchParams.get('v')
            if (u.pathname.startsWith('/embed/')) return u.pathname.split('/')[2] || null
            if (u.pathname.startsWith('/shorts/')) return u.pathname.split('/')[2] || null
        }
    } catch {
        return null
    }
    return null
}

function isPlayableVideoUrl(url: string | undefined): url is string {
    return Boolean(url && url !== '#')
}

function resolveThumbnail(thumbnail: string): string {
    if (!thumbnail) return ''
    if (thumbnail.startsWith('http') || thumbnail.startsWith('/uploads')) return thumbnail.startsWith('/uploads') ? resolveUploadUrl(thumbnail) : thumbnail
    return thumbnail
}

export default function Gallery() {
    const [activeCategory, setActiveCategory] = useState<string>('all')
    const [page, setPage] = useState(1)
    const [carouselOpen, setCarouselOpen] = useState(false)
    const [carouselIndex, setCarouselIndex] = useState(0)
    const [videoItem, setVideoItem] = useState<GalleryItem | null>(null)
    const [documentItem, setDocumentItem] = useState<GalleryItem | null>(null)
    const [documentForm, setDocumentForm] = useState({ name: '', phone: '', city: '', email: '' })
    const [thankYouOpen, setThankYouOpen] = useState(false)
    const [items, setItems] = useState<GalleryItem[]>(STATIC_ITEMS)

    useEffect(() => {
        api.getGallery()
            .then((data) => setItems(data))
            .catch(() => { /* keep static fallback */ })
    }, [])

    // Flatten all images from image-category items into a single carousel list
    const allImages = useMemo(
        () => items
            .filter((item) => item.category === 'image')
            .flatMap((item) => {
                const imgs = item.images?.length ? item.images : [item.thumbnail]
                return imgs.map((src) => ({ src, title: item.title, itemId: item.id }))
            }),
        [items],
    )

    const filtered =
        activeCategory === 'all'
            ? items
            : items.filter((item) => item.category === activeCategory)

    const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
    const currentPage = Math.min(page, totalPages)
    const paginated = filtered.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE,
    )

    const handleCategoryChange = (value: string) => {
        setActiveCategory(value)
        setPage(1)
        trackEvent({ event: 'filter_click', event_category: 'engagement', event_label: `gallery_category_${value}` })
    }

    const goPrev = () => setPage((p) => Math.max(1, p - 1))
    const goNext = () => setPage((p) => Math.min(totalPages, p + 1))

    const openCarousel = (itemId: number) => {
        const idx = allImages.findIndex((img) => img.itemId === itemId)
        if (idx === -1) return
        setCarouselIndex(idx)
        setCarouselOpen(true)
        trackEvent({ event: 'gallery_image_open', event_category: 'engagement', event_label: String(itemId) })
    }

    const closeCarousel = () => setCarouselOpen(false)
    const carouselPrev = () =>
        setCarouselIndex((i) => (i - 1 + allImages.length) % allImages.length)
    const carouselNext = () =>
        setCarouselIndex((i) => (i + 1) % allImages.length)

    const openVideo = (item: GalleryItem) => {
        if (!isPlayableVideoUrl(item.url)) return
        setVideoItem(item)
        trackEvent({ event: 'gallery_video_open', event_category: 'engagement', event_label: String(item.id) })
    }

    const closeVideo = () => setVideoItem(null)

    const openDocument = (item: GalleryItem) => {
        setDocumentItem(item)
        trackEvent({
            event: 'download_click',
            event_category: 'engagement',
            event_label: `gallery_document_${item.id}`,
        })
    }

    const closeDocument = () => setDocumentItem(null)

    const handleDocumentSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!documentItem) return
        try {
            await api.submitDownload(documentForm)
        } catch { /* ignore */ }
        trackEvent({
            event: 'form_submit',
            event_category: 'lead',
            event_label: `gallery_document_${documentItem.id}`,
        })
        if (documentItem.url && documentItem.url !== '#') {
            window.open(documentItem.url, '_blank', 'noopener,noreferrer')
        }
        setDocumentItem(null)
        setDocumentForm({ name: '', phone: '', city: '', email: '' })
        setThankYouOpen(true)
    }

    const isModalOpen = carouselOpen || videoItem !== null || documentItem !== null

    useEffect(() => {
        if (!isModalOpen) return
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                closeCarousel()
                closeVideo()
                closeDocument()
                return
            }
            if (carouselOpen) {
                if (e.key === 'ArrowLeft') carouselPrev()
                else if (e.key === 'ArrowRight') carouselNext()
            }
        }
        const prevOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        window.addEventListener('keydown', onKeyDown)
        return () => {
            document.body.style.overflow = prevOverflow
            window.removeEventListener('keydown', onKeyDown)
        }
    }, [isModalOpen, carouselOpen])

    return (
        <div className="min-h-screen bg-warm">
            <Seo
                title="Thư viện"
                description="Thư viện hình ảnh và video dự án Casamia Balanca Hội An - Khu đô thị sinh thái liền kề rừng dừa Bảy Mẫu, Hội An."
                url="/thu-vien"
            />
            <Header />

            <main className="mx-auto max-w-6xl px-6 pt-28 pb-16 sm:px-10 sm:pt-32">
                <h1 className="font-sagire text-4xl text-secondary sm:text-6xl xl:text-7xl">Thư viện</h1>

                <div className="mt-6 flex gap-6 overflow-x-auto border-b border-black/10 sm:gap-8">
                    {GALLERY_CATEGORIES.map((cat) => {
                        const isActive = activeCategory === cat.value
                        return (
                            <button
                                key={cat.value}
                                type="button"
                                onClick={() => handleCategoryChange(cat.value)}
                                className={`shrink-0 cursor-pointer pb-3 text-xs font-semibold uppercase transition-colors sm:text-sm ${
                                    isActive
                                        ? 'border-b-2 border-secondary text-secondary'
                                        : 'text-navy/70 hover:text-navy'
                                }`}
                            >
                                {cat.label}
                            </button>
                        )
                    })}
                </div>

                <div className="mt-8 grid gap-6 sm:mt-10 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
                    {paginated.map((item) => {
                        const Icon = CATEGORY_ICON[item.category]
                        const isImage = item.category === 'image'
                        const isPlayableVideo =
                            item.category === 'video' && isPlayableVideoUrl(item.url)

                        let CardWrapper: React.ElementType = 'div'
                        let wrapperProps: Record<string, unknown> = {}
                        let isInteractive = false

                        if (isImage) {
                            CardWrapper = 'button'
                            wrapperProps = {
                                type: 'button',
                                onClick: () => openCarousel(item.id),
                            }
                            isInteractive = true
                        } else if (isPlayableVideo) {
                            CardWrapper = 'button'
                            wrapperProps = {
                                type: 'button',
                                onClick: () => openVideo(item),
                            }
                            isInteractive = true
                        } else if (item.category === 'document') {
                            CardWrapper = 'button'
                            wrapperProps = {
                                type: 'button',
                                onClick: () => openDocument(item),
                            }
                            isInteractive = true
                        }

                        return (
                            <CardWrapper
                                key={item.id}
                                {...wrapperProps}
                                className={`group block w-full rounded-2xl bg-cream p-3 text-left transition-shadow ${
                                    isInteractive ? 'cursor-pointer hover:shadow-md' : ''
                                }`}
                            >
                                <div className="relative overflow-hidden rounded-xl">
                                    <img
                                        src={resolveThumbnail(item.thumbnail)}
                                        alt={item.title}
                                        loading="lazy"
                                        decoding="async"
                                        className="aspect-4/3 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <span
                                        aria-hidden="true"
                                        className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-md bg-warm/80 text-secondary backdrop-blur-sm sm:h-9 sm:w-9"
                                    >
                                        <Icon className="h-4 w-4 sm:h-4.5 sm:w-4.5" strokeWidth={1.75} />
                                    </span>
                                </div>

                                <div className="px-2 pb-2 pt-4 sm:px-3 sm:pt-5">
                                    <h3 className="line-clamp-2 text-sm font-semibold leading-6 text-secondary sm:text-base">
                                        {item.title}
                                    </h3>
                                    <div className="mt-2 flex items-center gap-1.5 text-xs text-black/55">
                                        <Calendar className="h-3.5 w-3.5" />
                                        <span>{item.date}</span>
                                    </div>
                                </div>
                            </CardWrapper>
                        )
                    })}
                </div>

                {totalPages > 1 && (
                    <nav
                        aria-label="Pagination"
                        className="mt-12 flex items-center gap-3 border-t border-black/10 pt-6 sm:mt-16"
                    >
                        <button
                            type="button"
                            aria-label="Trang trước"
                            onClick={goPrev}
                            disabled={currentPage === 1}
                            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-md bg-cream text-secondary transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40 sm:h-10 sm:w-10"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>

                        <div className="flex flex-1 items-center justify-center gap-2 sm:gap-4">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                                const isActive = p === currentPage
                                return (
                                    <button
                                        key={p}
                                        type="button"
                                        onClick={() => setPage(p)}
                                        className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-md text-sm transition-colors sm:h-10 sm:w-10 ${
                                            isActive
                                                ? 'font-bold text-secondary'
                                                : 'text-black/50 hover:text-secondary'
                                        }`}
                                        aria-current={isActive ? 'page' : undefined}
                                    >
                                        {p}
                                    </button>
                                )
                            })}
                        </div>

                        <button
                            type="button"
                            aria-label="Trang sau"
                            onClick={goNext}
                            disabled={currentPage === totalPages}
                            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-md bg-cream text-secondary transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40 sm:h-10 sm:w-10"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </nav>
                )}
            </main>

            <ScrollToTopButton />
            <Footer contentMaxWidth="max-w-6xl" />

            {carouselOpen && allImages.length > 0 && (
                <div
                    className="fixed inset-0 z-100 flex flex-col bg-black/95"
                    onClick={closeCarousel}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Thư viện hình ảnh"
                >
                    <div
                        className="relative flex flex-1 items-center justify-center overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex h-full w-full items-center justify-center gap-3 sm:gap-4">
                            <div className="hidden h-[55vh] w-[10vw] shrink-0 overflow-hidden rounded-md md:block lg:w-[13vw]">
                                <img
                                    src={
                                        resolveThumbnail(allImages[
                                            (carouselIndex - 1 + allImages.length) % allImages.length
                                        ].src)
                                    }
                                    alt=""
                                    aria-hidden="true"
                                    className="h-full w-full object-cover opacity-90"
                                />
                            </div>

                            <div className="h-[60vh] w-full max-w-5xl shrink overflow-hidden rounded-md sm:h-[70vh]">
                                <img
                                    src={resolveThumbnail(allImages[carouselIndex].src)}
                                    alt={allImages[carouselIndex].title}
                                    className="h-full w-full object-cover"
                                />
                            </div>

                            <div className="hidden h-[55vh] w-[10vw] shrink-0 overflow-hidden rounded-md md:block lg:w-[13vw]">
                                <img
                                    src={
                                        resolveThumbnail(allImages[(carouselIndex + 1) % allImages.length].src)
                                    }
                                    alt=""
                                    aria-hidden="true"
                                    className="h-full w-full object-cover opacity-90"
                                />
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={carouselPrev}
                            aria-label="Hình trước"
                            className="absolute left-3 top-1/2 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-xl bg-white text-secondary transition-opacity hover:opacity-90 sm:left-6"
                        >
                            <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
                        </button>

                        <button
                            type="button"
                            onClick={carouselNext}
                            aria-label="Hình sau"
                            className="absolute right-3 top-1/2 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-xl bg-white text-secondary transition-opacity hover:opacity-90 sm:right-6"
                        >
                            <ChevronRight className="h-5 w-5" strokeWidth={1.5} />
                        </button>
                    </div>

                    <div className="flex justify-center pb-6 pt-4 sm:pb-10">
                        <button
                            type="button"
                            onClick={closeCarousel}
                            className="flex cursor-pointer items-center gap-3 rounded-md border border-white/30 px-6 py-2.5 text-sm font-medium text-white/85 transition-colors hover:border-white/70 hover:text-white"
                        >
                            <X className="h-4 w-4" strokeWidth={1.75} />
                            <span>Đóng</span>
                        </button>
                    </div>
                </div>
            )}

            {videoItem && (() => {
                const youtubeId = videoItem.url ? getYouTubeId(videoItem.url) : null
                return (
                    <div
                        className="fixed inset-0 z-100 flex flex-col bg-black/95"
                        onClick={closeVideo}
                        role="dialog"
                        aria-modal="true"
                        aria-label={videoItem.title}
                    >
                        <div
                            className="flex flex-1 items-center justify-center px-4 sm:px-8"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="aspect-video w-full max-w-5xl overflow-hidden rounded-md bg-black shadow-2xl">
                                {youtubeId ? (
                                    <iframe
                                        src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
                                        title={videoItem.title}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        allowFullScreen
                                        className="h-full w-full"
                                    />
                                ) : (
                                    <video
                                        src={videoItem.url}
                                        poster={resolveThumbnail(videoItem.thumbnail)}
                                        controls
                                        autoPlay
                                        playsInline
                                        className="h-full w-full bg-black object-contain"
                                    >
                                        <track kind="captions" />
                                    </video>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-center pb-6 pt-4 sm:pb-10">
                            <button
                                type="button"
                                onClick={closeVideo}
                                className="flex cursor-pointer items-center gap-3 rounded-md border border-white/30 px-6 py-2.5 text-sm font-medium text-white/85 transition-colors hover:border-white/70 hover:text-white"
                            >
                                <X className="h-4 w-4" strokeWidth={1.75} />
                                <span>Đóng</span>
                            </button>
                        </div>
                    </div>
                )
            })()}

            {documentItem && (
                <div
                    className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 px-4"
                    onClick={closeDocument}
                    role="dialog"
                    aria-modal="true"
                    aria-label={documentItem.title}
                >
                    <div
                        className="relative w-full max-w-3xl rounded-2xl bg-warm p-6 shadow-2xl sm:p-10"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            aria-label="Close"
                            onClick={closeDocument}
                            className="absolute right-3 top-3 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-black/50 transition-colors hover:bg-black/5 hover:text-black sm:right-4 sm:top-4"
                        >
                            <X className="h-5 w-5" />
                        </button>
                        <h3 className="text-center font-sagire text-3xl text-secondary sm:text-4xl">
                            {documentItem.title}
                        </h3>
                        <form onSubmit={handleDocumentSubmit} className="mt-6 flex flex-col gap-5 sm:mt-8 sm:gap-6">
                            <label className="flex flex-col gap-2 border-b border-black/15 pb-2 transition-colors focus-within:border-secondary sm:flex-row sm:items-center sm:gap-4 sm:pb-3">
                                <span className="text-sm font-semibold text-primary sm:w-32 sm:shrink-0">Họ tên</span>
                                <input
                                    type="text"
                                    required
                                    minLength={2}
                                    maxLength={60}
                                    pattern="[\p{L}\s'\-\.]+"
                                    title="Chỉ được nhập chữ cái và khoảng trắng"
                                    placeholder="Điền thông tin của bạn"
                                    value={documentForm.name}
                                    onChange={(e) => {
                                        const v = e.target.value.replace(/[^\p{L}\s'\-\.]/gu, '')
                                        setDocumentForm((f) => ({ ...f, name: v }))
                                    }}
                                    className="w-full bg-transparent text-sm text-primary outline-none placeholder:text-black/40"
                                />
                            </label>

                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-8">
                                <label className="flex flex-col gap-2 border-b border-black/15 pb-2 transition-colors focus-within:border-secondary sm:flex-row sm:items-center sm:gap-8 sm:pb-3">
                                    <span className="text-sm font-semibold text-primary sm:w-28 sm:shrink-0">Số điện thoại</span>
                                    <input
                                        type="tel"
                                        required
                                        inputMode="numeric"
                                        pattern="[0-9]{9,11}"
                                        maxLength={11}
                                        title="Số điện thoại phải gồm 9-11 chữ số"
                                        placeholder="Tối thiểu 10 chữ số"
                                        value={documentForm.phone}
                                        onChange={(e) => {
                                            const v = e.target.value.replace(/\D/g, '').slice(0, 11)
                                            setDocumentForm((f) => ({ ...f, phone: v }))
                                        }}
                                        className="w-full bg-transparent text-sm text-primary outline-none placeholder:text-black/40"
                                    />
                                </label>

                                <label className="flex flex-col gap-2 border-b border-black/15 pb-2 transition-colors focus-within:border-secondary sm:flex-row sm:items-center sm:gap-4 sm:pb-3">
                                    <span className="text-sm font-semibold text-primary sm:w-16 sm:shrink-0">Email</span>
                                    <input
                                        type="email"
                                        required
                                        pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
                                        title="Vui lòng nhập email hợp lệ"
                                        placeholder="vidu@mail.com"
                                        value={documentForm.email}
                                        onChange={(e) => setDocumentForm((f) => ({ ...f, email: e.target.value.trim() }))}
                                        className="w-full bg-transparent text-sm text-primary outline-none placeholder:text-black/40"
                                    />
                                </label>
                            </div>

                            <label className="flex flex-col gap-2 border-b border-black/15 pb-2 transition-colors focus-within:border-secondary sm:flex-row sm:items-center sm:gap-4 sm:pb-3">
                                <span className="text-sm font-semibold text-primary sm:w-32 sm:shrink-0">Nơi ở</span>
                                <input
                                    type="text"
                                    required
                                    minLength={2}
                                    maxLength={60}
                                    pattern="[\p{L}\s'\-\.]+"
                                    title="Chỉ được nhập chữ cái và khoảng trắng"
                                    placeholder="Tỉnh/Thành"
                                    value={documentForm.city}
                                    onChange={(e) => {
                                        const v = e.target.value.replace(/[^\p{L}\s'\-\.]/gu, '')
                                        setDocumentForm((f) => ({ ...f, city: v }))
                                    }}
                                    className="w-full bg-transparent text-sm text-primary outline-none placeholder:text-black/40"
                                />
                            </label>

                            <div className="mt-4 flex justify-center sm:mt-6">
                                <button
                                    type="submit"
                                    className="cursor-pointer rounded-md bg-secondary px-8 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-white transition-opacity hover:opacity-90 sm:text-sm"
                                >
                                    Tải tài liệu
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <ThankYouModal open={thankYouOpen} onClose={() => setThankYouOpen(false)} />
        </div>
    )
}
