import { useState } from 'react'
import { Calendar, ChevronLeft, ChevronRight, FileText, Image as ImageIcon, Video } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ScrollToTopButton from '../components/ScrollToTopButton'
import { GALLERY_CATEGORIES, GALLERY_ITEMS, type GalleryCategory } from '../data/gallery'
import { trackEvent } from '../utils/tracking'

const ITEMS_PER_PAGE = 6

const CATEGORY_ICON: Record<GalleryCategory, typeof ImageIcon> = {
    image: ImageIcon,
    video: Video,
    document: FileText,
}

export default function Gallery() {
    const [activeCategory, setActiveCategory] = useState<string>('all')
    const [page, setPage] = useState(1)

    const filtered =
        activeCategory === 'all'
            ? GALLERY_ITEMS
            : GALLERY_ITEMS.filter((item) => item.category === activeCategory)

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

    return (
        <div className="min-h-screen bg-warm">
            <Header />

            <main className="mx-auto max-w-6xl px-6 pt-28 pb-16 sm:px-10 sm:pt-32">
                <h1 className="font-sagire text-4xl text-secondary sm:text-5xl">Thư viện</h1>

                <div className="mt-6 flex gap-6 overflow-x-auto border-b border-black/10 sm:gap-8">
                    {GALLERY_CATEGORIES.map((cat) => {
                        const isActive = activeCategory === cat.value
                        return (
                            <button
                                key={cat.value}
                                type="button"
                                onClick={() => handleCategoryChange(cat.value)}
                                className={`shrink-0 cursor-pointer pb-3 text-xs font-semibold uppercase tracking-[0.2em] transition-colors sm:text-sm ${
                                    isActive
                                        ? 'border-b-2 border-secondary text-secondary'
                                        : 'text-black/40 hover:text-black/70'
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
                        const CardWrapper: React.ElementType = item.url ? 'a' : 'div'
                        const linkProps = item.url
                            ? {
                                  href: item.url,
                                  target: '_blank' as const,
                                  rel: 'noopener noreferrer' as const,
                              }
                            : {}

                        return (
                            <CardWrapper
                                key={item.id}
                                {...linkProps}
                                className={`group block rounded-2xl bg-cream p-3 transition-shadow ${
                                    item.url ? 'hover:shadow-md' : ''
                                }`}
                            >
                                <div className="relative overflow-hidden rounded-xl">
                                    <img
                                        src={item.thumbnail}
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
            <Footer className="md:px-85" />
        </div>
    )
}
