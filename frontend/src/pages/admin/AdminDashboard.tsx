import { Link } from 'react-router-dom'

const SECTIONS = [
  { path: '/admin/hero', label: 'Hero', desc: 'Video nền, tiêu đề, phụ đề' },
  { path: '/admin/about', label: 'Giới thiệu', desc: 'TVC, tiêu đề, thống kê' },
  { path: '/admin/map', label: 'Vị trí', desc: 'Bản đồ, địa điểm, mô tả' },
  { path: '/admin/features', label: 'Tiện ích', desc: 'Carousel tiện ích, thống kê' },
  { path: '/admin/products', label: 'Sản phẩm', desc: 'Park Home, KTS, vận hành' },
  { path: '/admin/value', label: 'Giá trị', desc: 'Chủ đầu tư, giải thưởng, bàn giao' },
  { path: '/admin/footer', label: 'Footer', desc: 'Thư viện, liên hệ, mạng xã hội' },
]

const DATA_SECTIONS = [
  { path: '/admin/contacts', label: 'Liên hệ', desc: 'Danh sách đăng ký tư vấn' },
  { path: '/admin/downloads', label: 'Tải tài liệu', desc: 'Danh sách yêu cầu tải tài liệu' },
]

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      <p className="mt-1 text-sm text-gray-500">Quản lý nội dung trang chủ Casamia Balanca</p>

      <h2 className="mb-4 mt-8 text-lg font-semibold text-gray-800">Nội dung trang chủ</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SECTIONS.map((s) => (
          <Link
            key={s.path}
            to={s.path}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <h3 className="font-semibold text-gray-900">{s.label}</h3>
            <p className="mt-1 text-sm text-gray-500">{s.desc}</p>
          </Link>
        ))}
      </div>

      <h2 className="mb-4 mt-8 text-lg font-semibold text-gray-800">Dữ liệu</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {DATA_SECTIONS.map((s) => (
          <Link
            key={s.path}
            to={s.path}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <h3 className="font-semibold text-gray-900">{s.label}</h3>
            <p className="mt-1 text-sm text-gray-500">{s.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
