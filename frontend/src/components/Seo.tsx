import { Helmet } from 'react-helmet-async'

const SITE_NAME = 'Casamia Balanca Hội An'
const SITE_URL = 'https://casamiabalancahoian.vn'
const DEFAULT_IMAGE = `${SITE_URL}/hero-poster.jpg`
const DEFAULT_DESCRIPTION =
  'Casamia Balanca Hội An - Khu đô thị sinh thái liền kề khu dự trữ sinh quyển thế giới. Biệt thự sở hữu lâu dài giữa thiên nhiên sông - rừng dừa - vịnh biển Hội An.'

interface SeoProps {
  title?: string
  description?: string
  image?: string
  url?: string
}

export default function Seo({ title, description, image, url }: SeoProps) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | Website Chủ đầu tư`
  const desc = description || DEFAULT_DESCRIPTION
  const img = image && image.startsWith('http') ? image : DEFAULT_IMAGE
  const canonical = url ? `${SITE_URL}${url}` : SITE_URL

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={canonical} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:image" content={img} />
      <meta property="og:url" content={canonical} />
      <meta property="og:locale" content="vi_VN" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={img} />
    </Helmet>
  )
}
