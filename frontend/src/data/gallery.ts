export type GalleryCategory = 'image' | 'video' | 'document'

export interface GalleryItem {
  id: number
  title: string
  date: string
  thumbnail: string
  category: GalleryCategory
  url?: string
  images?: string[]
  sort_order?: number
  created_at?: string
  updated_at?: string
}

export const GALLERY_CATEGORIES = [
  { value: 'all', label: 'Tất cả' },
  { value: 'image', label: 'Hình ảnh' },
  { value: 'video', label: 'Video' },
  { value: 'document', label: 'Tài liệu' },
] as const

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 1,
    title: 'Hình ảnh phối cảnh',
    date: '20.10.2026',
    thumbnail: '/infi-pool.webp',
    category: 'image',
    images: ['/infi-pool.webp'],
  },
  {
    id: 2,
    title: 'Video cảnh quan tiện ích',
    date: '20.10.2026',
    thumbnail: '/scenery.jpg',
    category: 'video',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  },
  {
    id: 3,
    title: 'Hình lifestyle',
    date: '20.10.2026',
    thumbnail: '/village.webp',
    category: 'image',
    images: ['/village.webp'],
  },
  {
    id: 4,
    title: 'Tải về Leaflet Balanca 2026',
    date: '20.10.2026',
    thumbnail: '/pool-view.jpg',
    category: 'document',
    url: '#',
  },
  {
    id: 5,
    title: 'Tải về Tài liệu bán hàng',
    date: '20.10.2026',
    thumbnail: '/co-working.webp',
    category: 'document',
    url: '#',
  },
  {
    id: 6,
    title: 'Hình ảnh công viên ven sông',
    date: '15.10.2026',
    thumbnail: '/wellness-park.jpg',
    category: 'image',
    images: ['/wellness-park.jpg'],
  },
  {
    id: 7,
    title: 'Video giới thiệu tiện ích nội khu',
    date: '12.10.2026',
    thumbnail: '/coffee-shop.webp',
    category: 'video',
    url: '#',
  },
  {
    id: 8,
    title: 'Hình ảnh trung tâm thương mại',
    date: '08.10.2026',
    thumbnail: '/mall.webp',
    category: 'image',
    images: ['/mall.webp'],
  },
  {
    id: 9,
    title: 'Hình ảnh hệ thống giáo dục',
    date: '05.10.2026',
    thumbnail: '/school.webp',
    category: 'image',
    images: ['/school.webp'],
  },
  {
    id: 10,
    title: 'Video TVC dự án Casamia Balanca',
    date: '01.10.2026',
    thumbnail: '/hotel.webp',
    category: 'video',
    url: '#',
  },
  {
    id: 11,
    title: 'Tải về Mặt bằng tổng thể dự án',
    date: '28.09.2026',
    thumbnail: '/map-balanca.webp',
    category: 'document',
    url: '#',
  },
  {
    id: 12,
    title: 'Hình ảnh rừng dừa Bảy Mẫu',
    date: '25.09.2026',
    thumbnail: '/river.jpg',
    category: 'image',
    images: ['/river.jpg'],
  },
  {
    id: 13,
    title: 'Hình ảnh nhà phố thương mại',
    date: '22.09.2026',
    thumbnail: '/center-square.jpg',
    category: 'image',
    images: ['/center-square.jpg'],
  },
  {
    id: 14,
    title: 'Video flycam toàn cảnh dự án',
    date: '18.09.2026',
    thumbnail: '/exterior-2.jpg',
    category: 'video',
    url: '#',
  },
  {
    id: 15,
    title: 'Tải về Bảng giá tham khảo',
    date: '15.09.2026',
    thumbnail: '/bar.webp',
    category: 'document',
    url: '#',
  },
]
