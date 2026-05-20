import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import { api, resolveUploadUrl } from '../../services/api'
import type { GalleryCategory, GalleryItem } from '../../data/gallery'
import MediaUploader from './components/MediaUploader'
import AlbumUploader from './components/AlbumUploader'
import { useToast } from '../../components/Toast'

const EMPTY_ITEM: Omit<GalleryItem, 'id' | 'created_at' | 'updated_at'> = {
  title: '',
  date: '',
  thumbnail: '',
  category: 'image',
  url: '',
  images: [],
  sort_order: 0,
}

const CATEGORY_OPTIONS: { value: GalleryCategory; label: string }[] = [
  { value: 'image', label: 'Hình ảnh' },
  { value: 'video', label: 'Video' },
  { value: 'document', label: 'Tài liệu' },
]

export default function GalleryEditor() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isNew = id === 'new'
  const toast = useToast()

  const [form, setForm] = useState(EMPTY_ITEM)
  const [status, setStatus] = useState<'idle' | 'loading' | 'saving'>('idle')

  useEffect(() => {
    if (!isNew && id) {
      setStatus('loading')
      api.getGalleryItem(Number(id))
        .then((data) => {
          setForm({
            title: data.title,
            date: data.date,
            thumbnail: data.thumbnail,
            category: data.category,
            url: data.url || '',
            images: data.images || [],
            sort_order: data.sort_order ?? 0,
          })
          setStatus('idle')
        })
        .catch(() => {
          toast.error('Không thể tải dữ liệu')
          setStatus('idle')
        })
    }
  }, [id, isNew])

  const updateField = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast.error('Vui lòng nhập tiêu đề.')
      return
    }

    setStatus('saving')
    try {
      if (isNew) {
        await api.createGalleryItem(form)
        toast.success('Tạo mục thành công')
      } else {
        await api.updateGalleryItem(Number(id), form)
        toast.success('Cập nhật thành công')
      }
      setTimeout(() => navigate('/admin/gallery'), 800)
    } catch (err) {
      toast.error(`Lưu thất bại: ${err instanceof Error ? err.message : 'Lỗi không xác định'}`)
      setStatus('idle')
    }
  }

  if (status === 'loading') return <div className="text-gray-500">Đang tải...</div>

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isNew ? 'Thêm mục thư viện' : 'Chỉnh sửa mục thư viện'}
          </h1>
          <button
            type="button"
            onClick={() => navigate('/admin/gallery')}
            className="mt-1 cursor-pointer text-sm text-blue-600 hover:text-blue-700"
          >
            &larr; Quay lại danh sách
          </button>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={status === 'saving'}
          className="cursor-pointer rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
        >
          {status === 'saving' ? 'Đang lưu...' : 'Lưu'}
        </button>
      </div>

      <div className="space-y-4 rounded-xl bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-800">Thông tin cơ bản</h2>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Tiêu đề</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => updateField('title', e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
            placeholder="Nhập tiêu đề"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Danh mục</label>
            <select
              value={form.category}
              onChange={(e) => updateField('category', e.target.value as GalleryCategory)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
            >
              {CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Ngày</label>
            <input
              type="text"
              value={form.date}
              onChange={(e) => updateField('date', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="dd.mm.yyyy"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Thứ tự</label>
            <input
              type="number"
              value={form.sort_order ?? 0}
              onChange={(e) => updateField('sort_order', Number(e.target.value))}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Thumbnail */}
      <div className="mt-4 space-y-4 rounded-xl bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-800">Ảnh đại diện</h2>
        <MediaUploader
          value={form.thumbnail}
          onChange={(url) => updateField('thumbnail', url)}
          accept="image"
          label="Hình thumbnail"
        />
      </div>

      {/* Category-specific fields */}
      {form.category === 'video' && (
        <div className="mt-4 space-y-4 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-800">Video</h2>
          <p className="text-xs text-gray-500">Dán link YouTube hoặc tải lên file video.</p>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">URL YouTube</label>
            <input
              type="url"
              value={form.url || ''}
              onChange={(e) => updateField('url', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </div>
          <p className="text-xs text-gray-400">Hoặc tải lên video trực tiếp:</p>
          <MediaUploader
            value={form.url?.startsWith('/uploads') ? form.url : ''}
            onChange={(url) => updateField('url', url)}
            accept="video"
          />
        </div>
      )}

      {form.category === 'document' && (
        <div className="mt-4 space-y-4 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-800">Tài liệu</h2>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">URL tải về</label>
            <input
              type="url"
              value={form.url || ''}
              onChange={(e) => updateField('url', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="https://drive.google.com/..."
            />
          </div>
        </div>
      )}

      {form.category === 'image' && (
        <div className="mt-4 space-y-4 rounded-xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-gray-800">Album ảnh</h2>
              <p className="mt-0.5 text-xs text-gray-500">
                Tất cả ảnh trong album sẽ hiển thị trong carousel. Ảnh đầu tiên dùng làm thumbnail nếu chưa đặt.
              </p>
            </div>
            <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
              {form.images?.length || 0} ảnh
            </span>
          </div>

          {(form.images ?? []).length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {(form.images ?? []).map((src, idx) => (
                <div key={idx} className="group relative overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                  <img
                    src={src.startsWith('/uploads') ? resolveUploadUrl(src) : src}
                    alt=""
                    className="aspect-4/3 w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const next = [...(form.images ?? [])]
                      next.splice(idx, 1)
                      updateField('images', next)
                    }}
                    className="cursor-pointer absolute right-1.5 top-1.5 rounded-full bg-red-600 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                    title="Xóa ảnh"
                  >
                    <Trash2 size={12} />
                  </button>
                  <div className="absolute bottom-1.5 left-1.5 rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-white">
                    {idx + 1}
                  </div>
                </div>
              ))}
            </div>
          )}

          <AlbumUploader
            onUploaded={(urls) => updateField('images', [...(form.images ?? []), ...urls])}
          />
        </div>
      )}

      {/* Bottom save */}
      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={status === 'saving'}
          className="cursor-pointer rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
        >
          {status === 'saving' ? 'Đang lưu...' : 'Lưu'}
        </button>
      </div>
    </div>
  )
}
