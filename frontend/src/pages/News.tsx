import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Share2, Calendar } from 'lucide-react'
import { NEWS_ARTICLES as STATIC_ARTICLES, NEWS_CATEGORIES } from '../data/news'
import { api, resolveUploadUrl } from '../services/api'
import type { NewsArticle } from '../types/news'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ScrollToTopButton from '../components/ScrollToTopButton'
import { trackEvent } from '../utils/tracking'

const ITEMS_PER_PAGE = 9

function resolveImage(image: string): string {
  if (!image) return ''
  if (image.startsWith('http') || image.startsWith('/')) return image.startsWith('/uploads') ? resolveUploadUrl(image) : image
  return image
}

function getExcerpt(article: NewsArticle | { content: string[] }): string {
  const content = article.content
  if (!content || content.length === 0) return ''
  const first = content[0]
  if (typeof first === 'string') return first
  if (typeof first === 'object' && first.type === 'text') return first.value
  return ''
}

export default function News() {
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState('all')
  const [page, setPage] = useState(1)
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getNews()
      .then((data) => setArticles(data))
      .catch(() => {
        // Fallback to static data
        setArticles(
          STATIC_ARTICLES.map((a) => ({
            ...a,
            content: a.content.map((c) => ({ type: 'text' as const, value: c })),
          }))
        )
      })
      .finally(() => setLoading(false))
  }, [])

  const filtered = activeCategory === 'all'
    ? articles
    : articles.filter((a) => a.category === activeCategory)

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  const handleCategoryChange = (value: string) => {
    setActiveCategory(value)
    setPage(1)
    trackEvent({ event: 'filter_click', event_category: 'engagement', event_label: `news_category_${value}` })
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="mx-auto max-w-6xl px-6 pt-28 pb-16 sm:px-10 sm:pt-32">
        <h1 className="font-sagire text-4xl text-secondary sm:text-5xl">Tin tức</h1>

        {/* Filter tabs */}
        <div className="mt-6 flex gap-6 border-b border-black/10">
          {NEWS_CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => handleCategoryChange(cat.value)}
              className={`pb-3 text-sm font-medium tracking-wide transition-colors ${activeCategory === cat.value
                  ? 'border-b-2 border-secondary text-secondary'
                  : 'text-black/40 hover:text-black/70'
                }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="mt-20 text-center text-sm text-black/40">Đang tải...</div>
        ) : (
          <>
            {/* Articles grid */}
            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {paginated.map((article) => {
                const goToArticle = () => {
                  trackEvent({ event: 'news_click', event_category: 'engagement', event_label: article.slug })
                  navigate(`/tin-tuc/${article.slug}`)
                }
                return (
                  <div
                    key={article.slug}
                    role="link"
                    tabIndex={0}
                    onClick={goToArticle}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        goToArticle()
                      }
                    }}
                    className="group cursor-pointer"
                  >
                    <div className="rounded-b-xl bg-cream">
                      <div className="overflow-hidden rounded-xl">
                        <img
                          src={resolveImage(article.image)}
                          alt={article.title}
                          className="aspect-4/3 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="line-clamp-2 text-sm font-semibold leading-6 text-primary sm:text-base">
                          {article.title}
                        </h3>
                        <p className="mt-2 line-clamp-3 text-xs leading-5 text-black/50 sm:text-sm">
                          {getExcerpt(article)}
                        </p>
                        <div className="mt-3 flex items-center justify-between">
                          <p className="text-xs tracking-[0.15em] text-black/55 flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" /> {article.date}
                          </p>
                          <div className="flex items-center gap-2">
                            {article.source_url && (
                              <a
                                href={article.source_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-secondary/70 hover:text-secondary"
                                onClick={(e) => e.stopPropagation()}
                              >
                                Nguồn
                              </a>
                            )}
                            <Share2 className="h-3.5 w-3.5 text-black/30" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPage(p)}
                    className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors ${page === p
                        ? 'bg-secondary text-white'
                        : 'text-black/50 hover:bg-black/5'
                      }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      <ScrollToTopButton />
      <Footer className="md:px-85"/>
    </div>
  )
}
