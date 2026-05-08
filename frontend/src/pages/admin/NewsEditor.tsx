import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Trash2, GripVertical, ArrowUp, ArrowDown, Type, ImageIcon } from 'lucide-react'
import { api } from '../../services/api'
import type { NewsArticle, ContentBlock, NewsCategory } from '../../types/news'
import MediaUploader from './components/MediaUploader'

const EMPTY_ARTICLE: Omit<NewsArticle, 'id' | 'created_at' | 'updated_at'> = {
  slug: '',
  title: '',
  date: '',
  image: '',
  category: 'du-an',
  source_url: '',
  content: [{ type: 'text', value: '' }],
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export default function NewsEditor() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isNew = id === 'new'

  const [form, setForm] = useState(EMPTY_ARTICLE)
  const [status, setStatus] = useState<'idle' | 'loading' | 'saving' | 'saved' | 'error'>('idle')
  const [autoSlug, setAutoSlug] = useState(true)

  useEffect(() => {
    if (!isNew && id) {
      setStatus('loading')
      api.getNewsArticle(Number(id))
        .then((data) => {
          setForm({
            slug: data.slug,
            title: data.title,
            date: data.date,
            image: data.image,
            category: data.category,
            source_url: data.source_url || '',
            content: data.content,
          })
          setAutoSlug(false)
          setStatus('idle')
        })
        .catch(() => setStatus('error'))
    }
  }, [id, isNew])

  const updateField = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value }
      if (key === 'title' && autoSlug) {
        next.slug = slugify(value as string)
      }
      return next
    })
  }

  const updateBlock = (index: number, value: string) => {
    setForm((prev) => ({
      ...prev,
      content: prev.content.map((b, i) => (i === index ? { ...b, value } : b)),
    }))
  }

  const addBlock = (type: ContentBlock['type'], afterIndex?: number) => {
    const newBlock: ContentBlock = { type, value: '' }
    setForm((prev) => {
      const content = [...prev.content]
      const insertAt = afterIndex != null ? afterIndex + 1 : content.length
      content.splice(insertAt, 0, newBlock)
      return { ...prev, content }
    })
  }

  const removeBlock = (index: number) => {
    setForm((prev) => ({
      ...prev,
      content: prev.content.filter((_, i) => i !== index),
    }))
  }

  const moveBlock = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction
    if (newIndex < 0 || newIndex >= form.content.length) return
    setForm((prev) => {
      const content = [...prev.content]
      const temp = content[index]
      content[index] = content[newIndex]
      content[newIndex] = temp
      return { ...prev, content }
    })
  }

  const handleSave = async () => {
    if (!form.title.trim()) {
      alert('Vui lòng nhập tiêu đề bài viết.')
      return
    }
    if (!form.slug.trim()) {
      alert('Vui lòng nhập đường dẫn (slug).')
      return
    }

    setStatus('saving')
    try {
      if (isNew) {
        await api.createNews(form)
      } else {
        await api.updateNews(Number(id), form)
      }
      setStatus('saved')
      setTimeout(() => {
        navigate('/admin/news')
      }, 1000)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  if (status === 'loading') return <div className="text-gray-500">Đang tải...</div>

  return (
    <div className="mx-auto max-w-4xl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isNew ? 'Tạo bài viết mới' : 'Chỉnh sửa bài viết'}
          </h1>
          <button
            type="button"
            onClick={() => navigate('/admin/news')}
            className="mt-1 text-sm text-blue-600 hover:text-blue-700"
          >
            &larr; Quay lại danh sách
          </button>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={status === 'saving'}
          className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
        >
          {status === 'saving' ? 'Đang lưu...' : status === 'saved' ? 'Đã lưu!' : 'Lưu bài viết'}
        </button>
      </div>

      {status === 'error' && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          Có lỗi xảy ra. Vui lòng thử lại.
        </div>
      )}
      {status === 'saved' && (
        <div className="mb-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
          Bài viết đã được lưu thành công!
        </div>
      )}

      {/* Basic info */}
      <div className="space-y-4 rounded-xl bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-800">Thông tin cơ bản</h2>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Tiêu đề</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => updateField('title', e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
            placeholder="Nhập tiêu đề bài viết"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">
              Đường dẫn (slug)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={form.slug}
                onChange={(e) => {
                  setAutoSlug(false)
                  updateField('slug', e.target.value)
                }}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
                placeholder="duong-dan-bai-viet"
              />
            </div>
            {autoSlug && (
              <p className="mt-1 text-xs text-gray-400">Tự động tạo từ tiêu đề</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Ngày đăng</label>
            <input
              type="text"
              value={form.date}
              onChange={(e) => updateField('date', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="dd.mm.yyyy"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Danh mục</label>
          <select
            value={form.category}
            onChange={(e) => updateField('category', e.target.value as NewsCategory)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
          >
            <option value="du-an">Thông tin dự án</option>
            <option value="su-kien">Sự kiện</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Nguồn bài viết (URL)</label>
          <input
            type="url"
            value={form.source_url || ''}
            onChange={(e) => updateField('source_url', e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
            placeholder="https://example.com/bai-viet-goc"
          />
        </div>
      </div>

      {/* Cover image */}
      <div className="mt-4 space-y-4 rounded-xl bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-800">Ảnh bìa</h2>
        <MediaUploader
          value={form.image}
          onChange={(url) => updateField('image', url)}
          accept="image"
          label="Ảnh đại diện bài viết"
        />
      </div>

      {/* Content blocks */}
      <div className="mt-4 space-y-4 rounded-xl bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-800">Nội dung bài viết</h2>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => addBlock('text')}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50"
            >
              <Type size={14} />
              Thêm đoạn văn
            </button>
            <button
              type="button"
              onClick={() => addBlock('image')}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50"
            >
              <ImageIcon size={14} />
              Thêm hình ảnh
            </button>
          </div>
        </div>

        {form.content.length === 0 && (
          <div className="rounded-lg border-2 border-dashed border-gray-200 py-10 text-center text-sm text-gray-400">
            Chưa có nội dung. Thêm đoạn văn hoặc hình ảnh để bắt đầu.
          </div>
        )}

        <div className="space-y-3">
          {form.content.map((block, index) => (
            <div
              key={index}
              className="group relative rounded-lg border border-gray-200 bg-gray-50 p-3"
            >
              {/* Block controls */}
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <GripVertical size={14} />
                  <span className="font-medium">
                    {block.type === 'text' ? 'Đoạn văn' : 'Hình ảnh'} #{index + 1}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveBlock(index, -1)}
                    disabled={index === 0}
                    className="rounded p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600 disabled:opacity-30"
                    title="Di chuyển lên"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveBlock(index, 1)}
                    disabled={index === form.content.length - 1}
                    className="rounded p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600 disabled:opacity-30"
                    title="Di chuyển xuống"
                  >
                    <ArrowDown size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeBlock(index)}
                    className="rounded p-1 text-gray-400 hover:bg-red-100 hover:text-red-600"
                    title="Xóa"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Block content */}
              {block.type === 'text' ? (
                <textarea
                  value={block.value}
                  onChange={(e) => updateBlock(index, e.target.value)}
                  rows={4}
                  className="w-full resize-y rounded-lg border border-gray-300 px-4 py-2 text-sm leading-6 focus:border-blue-500 focus:outline-none"
                  placeholder="Nhập nội dung đoạn văn... (Viết IN HOA để tạo tiêu đề phụ)"
                />
              ) : (
                <MediaUploader
                  value={block.value}
                  onChange={(url) => updateBlock(index, url)}
                  accept="image"
                />
              )}

              {/* Insert buttons between blocks */}
              <div className="absolute -bottom-2.5 left-1/2 z-10 hidden -translate-x-1/2 gap-1 group-hover:flex">
                <button
                  type="button"
                  onClick={() => addBlock('text', index)}
                  className="rounded bg-white px-2 py-0.5 text-[10px] font-medium text-gray-500 shadow-md ring-1 ring-gray-200 hover:text-blue-600"
                >
                  + Văn bản
                </button>
                <button
                  type="button"
                  onClick={() => addBlock('image', index)}
                  className="rounded bg-white px-2 py-0.5 text-[10px] font-medium text-gray-500 shadow-md ring-1 ring-gray-200 hover:text-blue-600"
                >
                  + Hình ảnh
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom save button */}
      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={status === 'saving'}
          className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
        >
          {status === 'saving' ? 'Đang lưu...' : status === 'saved' ? 'Đã lưu!' : 'Lưu bài viết'}
        </button>
      </div>
    </div>
  )
}
