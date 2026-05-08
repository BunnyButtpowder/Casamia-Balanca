import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { NEWS_ARTICLES as STATIC_ARTICLES } from '../data/news'
import { api, resolveUploadUrl } from '../services/api'
import type { NewsArticle, ContentBlock } from '../types/news'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ScrollToTopButton from '../components/ScrollToTopButton'
import { trackEvent } from '../utils/tracking'

function resolveImage(image: string): string {
  if (!image) return ''
  if (image.startsWith('http') || image.startsWith('/')) return image.startsWith('/uploads') ? resolveUploadUrl(image) : image
  return image
}

function staticToContentBlocks(content: string[]): ContentBlock[] {
  return content.map((c) => ({ type: 'text' as const, value: c }))
}

export default function NewsDetail() {
  const { slug } = useParams<{ slug: string }>()
  const [article, setArticle] = useState<NewsArticle | null>(null)
  const [otherArticles, setOtherArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    setLoading(true)
    setNotFound(false)

    api.getNews()
      .then((articles) => {
        const found = articles.find((a) => a.slug === slug)
        if (found) {
          setArticle(found)
          setOtherArticles(articles.filter((a) => a.slug !== slug))
        } else {
          setNotFound(true)
        }
      })
      .catch(() => {
        // Fallback to static data
        const staticArticle = STATIC_ARTICLES.find((a) => a.slug === slug)
        if (staticArticle) {
          setArticle({
            ...staticArticle,
            content: staticToContentBlocks(staticArticle.content),
          })
          setOtherArticles(
            STATIC_ARTICLES.filter((a) => a.slug !== slug).map((a) => ({
              ...a,
              content: staticToContentBlocks(a.content),
            }))
          )
        } else {
          setNotFound(true)
        }
      })
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-warm">
        <p className="text-sm text-black/40">Đang tải...</p>
      </div>
    )
  }

  if (notFound || !article) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-warm">
        <p className="text-lg text-primary">Bài viết không tồn tại.</p>
        <Link to="/" className="mt-4 text-secondary underline">Quay về trang chủ</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-warm">
      <Header />

      {/* Hero banner */}
      <div className="relative h-[280px] w-full sm:h-[380px] lg:h-[460px]">
        <img
          src={resolveImage(article.image)}
          alt={article.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
      </div>

      {/* Article content */}
      <article className="mx-auto max-w-4xl px-6 py-10 sm:px-10 sm:py-14 lg:py-16">
        <h1 className="font-sagire text-3xl leading-tight text-primary sm:text-4xl lg:text-5xl">
          {article.title}
        </h1>
        <p className="mt-3 text-sm tracking-[0.15em] text-black/40">{article.date}</p>
        {article.source_url && (
          <p className="mt-1 text-sm text-black/40">
            Nguồn:{' '}
            <a
              href={article.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary/70 underline hover:text-secondary"
            >
              {new URL(article.source_url).hostname}
            </a>
          </p>
        )}

        <div className="mt-8 space-y-5 text-[15px] leading-7 text-black/80 sm:text-base sm:leading-8">
          {article.content.map((block, i) => {
            if (block.type === 'image') {
              return (
                <div key={i} className="my-6 overflow-hidden rounded-2xl">
                  <img
                    src={resolveImage(block.value)}
                    alt=""
                    className="h-[240px] w-full object-cover sm:h-[340px] lg:h-[420px]"
                  />
                </div>
              )
            }
            // Text block
            const text = block.value
            const isHeading = text === text.toUpperCase() && text.length > 10
            if (isHeading) {
              return (
                <h2 key={i} className="mt-4 text-base font-bold text-primary sm:text-lg">
                  {text}
                </h2>
              )
            }
            return <p key={i}>{text}</p>
          })}
        </div>
      </article>

      {/* Related articles */}
      {otherArticles.length > 0 && (
        <section className="bg-warm pb-16">
          <div className="mx-auto max-w-6xl px-6 sm:px-10">
            <h2 className="font-sagire text-center text-3xl text-primary sm:text-4xl">
              Các bài viết khác
            </h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {otherArticles.map((item) => (
                <Link
                  key={item.slug}
                  to={`/tin-tuc/${item.slug}`}
                  className="group overflow-hidden rounded-2xl bg-white shadow-md transition-shadow hover:shadow-lg"
                  onClick={() => trackEvent({ event: 'news_click', event_category: 'engagement', event_label: item.slug })}
                >
                  <div className="overflow-hidden">
                    <img
                      src={resolveImage(item.image)}
                      alt={item.title}
                      className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <p className="text-xs tracking-[0.15em] text-black/40">{item.date}</p>
                    <h3 className="mt-2 line-clamp-2 text-sm font-semibold leading-6 text-primary sm:text-base">
                      {item.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <ScrollToTopButton />
      <Footer className="md:px-85"/>
    </div>
  )
}
