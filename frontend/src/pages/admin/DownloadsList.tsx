import { useState, useEffect } from 'react'
import { api } from '../../services/api'

interface Download {
  id: number
  name: string
  phone: string
  city: string | null
  email: string | null
  created_at: string
}

export default function DownloadsList() {
  const [downloads, setDownloads] = useState<Download[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getDownloads().then((data) => {
      setDownloads(data as unknown as Download[])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="text-gray-500">Đang tải...</div>

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Yêu cầu tải tài liệu ({downloads.length})</h1>
      {downloads.length === 0 ? (
        <p className="text-gray-500">Chưa có yêu cầu nào.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-4 py-3 font-semibold text-gray-600">#</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Họ tên</th>
                <th className="px-4 py-3 font-semibold text-gray-600">SĐT</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Tỉnh/TP</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Email</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Ngày</th>
              </tr>
            </thead>
            <tbody>
              {downloads.map((d, i) => (
                <tr key={d.id} className="border-b border-gray-100 last:border-0">
                  <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{d.name}</td>
                  <td className="px-4 py-3 text-gray-700">{d.phone}</td>
                  <td className="px-4 py-3 text-gray-700">{d.city || '-'}</td>
                  <td className="px-4 py-3 text-gray-700">{d.email || '-'}</td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{new Date(d.created_at).toLocaleString('vi-VN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
