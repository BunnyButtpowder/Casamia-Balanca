import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, Image as ImageIcon, Video, FileText } from 'lucide-react'
import { api, resolveUploadUrl } from '../../services/api'
import type { GalleryItem } from '../../data/gallery'
import { useToast } from '../../components/Toast'

const CATEGORY_LABELS: Record<string, string> = {
  image: 'Hình ảnh',
  video: 'Video',
  document: 'Tài liệu',
}

const CATEGORY_ICONS: Record<string, typeof ImageIcon> = {
  image: ImageIcon,
  video: Video,
  document: FileText,
}

function resolveThumbnail(thumbnail: string): string {
  if (!thumbnail) return ''
  if (thumbnail.startsWith('/uploads')) return resolveUploadUrl(thumbnail)
  return thumbnail
}

const CATEGORY_FILTERS = [
  { value: 'all', label: 'Tất cả' },
  { value: 'image', label: 'Hình ảnh' },
  { value: 'video', label: 'Video' },
  { value: 'document', label: 'Tài liệu' },
]

export default function GalleryList() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<number | null>(null)
  const [filter, setFilter] = useState('all')
  const toast = useToast()

  useEffect(() => {
    api.getGallery()
      .then((data) => setItems(data))
      .catch(() => toast.error('Không thể tải danh sách thư viện'))
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id: number) => {
    const ok = await toast.confirm('Bạn có chắc muốn xóa mục này?', {
      confirmLabel: 'Xóa',
      cancelLabel: 'Hủy',
      tone: 'danger',
    })
    if (!ok) return
    setDeleting(id)
    try {
      await api.deleteGalleryItem(id)
      setItems((prev) => prev.filter((item) => item.id !== id))
      toast.success('Đã xóa thành công')
    } catch (err) {
      toast.error(`Xóa thất bại: ${err instanceof Error ? err.message : 'Lỗi không xác định'}`)
    } finally {
      setDeleting(null)
    }
  }

  const filtered = filter === 'all' ? items : items.filter((item) => item.category === filter)

  if (loading) return <div className="text-gray-500">Đang tải...</div>

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý thư viện</h1>
          <p className="mt-1 text-sm text-gray-500">{filtered.length} / {items.length} mục</p>
        </div>
        <Link
          to="/admin/gallery/new"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <Plus size={18} />
          Thêm mục
        </Link>
      </div>

      <div className="mb-4 flex gap-2">
        {CATEGORY_FILTERS.map((cat) => (
          <button
            key={cat.value}
            type="button"
            onClick={() => setFilter(cat.value)}
            className={`cursor-pointer rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              filter === cat.value
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl bg-white p-12 text-center shadow-sm">
          <p className="text-gray-500">{filter === 'all' ? 'Chưa có mục nào trong thư viện.' : 'Không có mục nào trong danh mục này.'}</p>
          {filter === 'all' && (
            <Link
              to="/admin/gallery/new"
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              <Plus size={16} />
              Thêm mục đầu tiên
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => {
            const Icon = CATEGORY_ICONS[item.category] || ImageIcon
            return (
              <div
                key={item.id}
                className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm"
              >
                <div className="h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  {item.thumbnail ? (
                    <img
                      src={resolveThumbnail(item.thumbnail)}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-400">
                      <Icon size={24} />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-semibold text-gray-900">
                    {item.title}
                  </h3>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                    <span>{item.date}</span>
                    <span className="inline-flex items-center gap-1 rounded bg-gray-100 px-2 py-0.5 font-medium text-gray-600">
                      <Icon size={12} />
                      {CATEGORY_LABELS[item.category] || item.category}
                    </span>
                    {item.sort_order != null && (
                      <span className="text-gray-400">#{item.sort_order}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/admin/gallery/${item.id}`}
                    className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-blue-600"
                    title="Chỉnh sửa"
                  >
                    <Pencil size={16} />
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    disabled={deleting === item.id}
                    className="cursor-pointer rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                    title="Xóa"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
