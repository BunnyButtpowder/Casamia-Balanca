import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { api, resolveUploadUrl } from '../../services/api'
import type { NewsArticle } from '../../types/news'

const CATEGORY_LABELS: Record<string, string> = {
  'du-an': 'Thông tin dự án',
  'su-kien': 'Sự kiện',
}

export default function NewsList() {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<number | null>(null)

  useEffect(() => {
    api.getNews()
      .then((data) => setArticles(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc muốn xóa bài viết này?')) return
    setDeleting(id)
    try {
      await api.deleteNews(id)
      setArticles((prev) => prev.filter((a) => a.id !== id))
    } catch {
      alert('Có lỗi xảy ra khi xóa bài viết.')
    } finally {
      setDeleting(null)
    }
  }

  if (loading) return <div className="text-gray-500">Đang tải...</div>

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý tin tức</h1>
          <p className="mt-1 text-sm text-gray-500">{articles.length} bài viết</p>
        </div>
        <Link
          to="/admin/news/new"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <Plus size={18} />
          Thêm bài viết
        </Link>
      </div>

      {articles.length === 0 ? (
        <div className="rounded-xl bg-white p-12 text-center shadow-sm">
          <p className="text-gray-500">Chưa có bài viết nào.</p>
          <Link
            to="/admin/news/new"
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            <Plus size={16} />
            Tạo bài viết đầu tiên
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {articles.map((article) => (
            <div
              key={article.id}
              className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm"
            >
              {/* Thumbnail */}
              <div className="h-20 w-28 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                {article.image ? (
                  <img
                    src={resolveUploadUrl(article.image)}
                    alt={article.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                    No image
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-semibold text-gray-900">
                  {article.title}
                </h3>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                  <span>{article.date}</span>
                  <span className="rounded bg-gray-100 px-2 py-0.5 font-medium text-gray-600">
                    {CATEGORY_LABELS[article.category] || article.category}
                  </span>
                  <span className="text-gray-400">/{article.slug}</span>
                  {article.source_url && (
                    <a
                      href={article.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="truncate text-blue-500 hover:text-blue-600 max-w-[200px]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Nguồn
                    </a>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Link
                  to={`/admin/news/${article.id}`}
                  className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-blue-600"
                  title="Chỉnh sửa"
                >
                  <Pencil size={16} />
                </Link>
                <button
                  type="button"
                  onClick={() => article.id != null && handleDelete(article.id)}
                  disabled={deleting === article.id}
                  className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                  title="Xóa"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
