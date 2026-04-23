import { useParams, Link } from 'react-router-dom'
import { NEWS_ARTICLES } from '../data/news'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ScrollToTopButton from '../components/ScrollToTopButton'

export default function NewsDetail() {
  const { slug } = useParams<{ slug: string }>()
  const article = NEWS_ARTICLES.find((a) => a.slug === slug)
  const otherArticles = NEWS_ARTICLES.filter((a) => a.slug !== slug)

  if (!article) {
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
          src={article.image}
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

        <div className="mt-8 space-y-5 text-[15px] leading-7 text-black/80 sm:text-base sm:leading-8">
          {article.content.map((paragraph, i) => {
            const isHeading = paragraph === paragraph.toUpperCase() && paragraph.length > 10
            if (isHeading) {
              return (
                <h2 key={i} className="mt-4 text-base font-bold text-primary sm:text-lg">
                  {paragraph}
                </h2>
              )
            }
            return <p key={i}>{paragraph}</p>
          })}
        </div>

        {/* Inline image */}
        <div className="my-10 overflow-hidden rounded-2xl">
          <img
            src={article.image}
            alt={article.title}
            className="h-[240px] w-full object-cover sm:h-[340px] lg:h-[420px]"
          />
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
                >
                  <div className="overflow-hidden">
                    <img
                      src={item.image}
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
