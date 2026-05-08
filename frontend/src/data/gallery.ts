export type GalleryCategory = 'image' | 'video' | 'document'

export interface GalleryItem {
  id: string
  title: string
  date: string
  thumbnail: string
  category: GalleryCategory
  url?: string
}

export const GALLERY_CATEGORIES = [
  { value: 'all', label: 'Tất cả' },
  { value: 'image', label: 'Hình ảnh' },
  { value: 'video', label: 'Video' },
  { value: 'document', label: 'Tài liệu' },
] as const

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'phoi-canh',
    title: 'Hình ảnh phối cảnh',
    date: '20.10.2026',
    thumbnail: '/infi-pool.webp',
    category: 'image',
  },
  {
    id: 'video-canh-quan',
    title: 'Video cảnh quan tiện ích',
    date: '20.10.2026',
    thumbnail: '/scenery.jpg',
    category: 'video',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  },
  {
    id: 'lifestyle',
    title: 'Hình lifestyle',
    date: '20.10.2026',
    thumbnail: '/village.webp',
    category: 'image',
  },
  {
    id: 'leaflet-2026',
    title: 'Tải về Leaflet Balanca 2026',
    date: '20.10.2026',
    thumbnail: '/pool-view.jpg',
    category: 'document',
    url: '#',
  },
  {
    id: 'tai-lieu-ban-hang',
    title: 'Tải về Tài liệu bán hàng',
    date: '20.10.2026',
    thumbnail: '/co-working.webp',
    category: 'document',
    url: '#',
  },
  {
    id: 'cong-vien-ven-song',
    title: 'Hình ảnh công viên ven sông',
    date: '15.10.2026',
    thumbnail: '/wellness-park.jpg',
    category: 'image',
  },
  {
    id: 'video-tien-ich',
    title: 'Video giới thiệu tiện ích nội khu',
    date: '12.10.2026',
    thumbnail: '/coffee-shop.webp',
    category: 'video',
    url: '#',
  },
  {
    id: 'mall',
    title: 'Hình ảnh trung tâm thương mại',
    date: '08.10.2026',
    thumbnail: '/mall.webp',
    category: 'image',
  },
  {
    id: 'school',
    title: 'Hình ảnh hệ thống giáo dục',
    date: '05.10.2026',
    thumbnail: '/school.webp',
    category: 'image',
  },
  {
    id: 'tvc-balanca',
    title: 'Video TVC dự án Casamia Balanca',
    date: '01.10.2026',
    thumbnail: '/hotel.webp',
    category: 'video',
    url: '#',
  },
  {
    id: 'mat-bang-tong-the',
    title: 'Tải về Mặt bằng tổng thể dự án',
    date: '28.09.2026',
    thumbnail: '/map-balanca.webp',
    category: 'document',
    url: '#',
  },
  {
    id: 'rung-dua',
    title: 'Hình ảnh rừng dừa Bảy Mẫu',
    date: '25.09.2026',
    thumbnail: '/river.jpg',
    category: 'image',
  },
  {
    id: 'shop-house',
    title: 'Hình ảnh nhà phố thương mại',
    date: '22.09.2026',
    thumbnail: '/center-square.jpg',
    category: 'image',
  },
  {
    id: 'video-flycam',
    title: 'Video flycam toàn cảnh dự án',
    date: '18.09.2026',
    thumbnail: '/exterior-2.jpg',
    category: 'video',
    url: '#',
  },
  {
    id: 'bang-gia',
    title: 'Tải về Bảng giá tham khảo',
    date: '15.09.2026',
    thumbnail: '/bar.webp',
    category: 'document',
    url: '#',
  },
]
