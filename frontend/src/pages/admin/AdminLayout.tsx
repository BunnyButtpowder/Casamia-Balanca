import { useEffect } from 'react'
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'

const NAV_ITEMS = [
  { path: '/admin', label: 'Dashboard', exact: true },
  { path: '/admin/hero', label: 'Hero' },
  { path: '/admin/about', label: 'Giới thiệu' },
  { path: '/admin/map', label: 'Vị trí' },
  { path: '/admin/features', label: 'Tiện ích' },
  { path: '/admin/products', label: 'Sản phẩm' },
  { path: '/admin/value', label: 'Giá trị' },
  { path: '/admin/footer', label: 'Footer' },
  { path: '/admin/contacts', label: 'Liên hệ' },
  { path: '/admin/downloads', label: 'Tải tài liệu' },
  { path: '/admin/change-password', label: 'Đổi mật khẩu' },
]

export default function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) navigate('/admin/login')
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    navigate('/admin/login')
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="fixed left-0 top-0 z-40 flex h-screen w-60 flex-col bg-gray-900 text-white">
        <div className="border-b border-gray-700 px-5 py-4">
          <h2 className="text-lg font-bold">Casamia Admin</h2>
        </div>
        <nav className="flex-1 overflow-y-auto py-3">
          {NAV_ITEMS.map((item) => {
            const active = item.exact
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path)
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-5 py-2.5 text-sm transition-colors ${
                  active ? 'bg-gray-800 font-semibold text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="border-t border-gray-700 p-4">
          <button
            onClick={handleLogout}
            className="w-full rounded-lg bg-gray-700 px-4 py-2 text-sm text-gray-300 transition-colors hover:bg-gray-600 hover:text-white"
          >
            Đăng xuất
          </button>
        </div>
      </aside>
      <main className="ml-60 flex-1 p-8">
        <Outlet />
      </main>
    </div>
  )
}
