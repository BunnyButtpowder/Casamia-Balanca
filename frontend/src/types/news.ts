export type NewsCategory = 'du-an' | 'su-kien'

export interface ContentBlock {
  type: 'text' | 'image'
  value: string
}

export interface NewsArticle {
  id?: number
  slug: string
  title: string
  date: string
  image: string
  category: NewsCategory
  source_url?: string
  content: ContentBlock[]
  created_at?: string
  updated_at?: string
}

export const NEWS_CATEGORIES = [
  { value: 'all', label: 'Tất cả' },
  { value: 'du-an', label: 'Thông tin dự án' },
  { value: 'su-kien', label: 'Sự kiện' },
] as const
