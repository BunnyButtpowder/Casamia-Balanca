import { useState, useEffect } from 'react'
import { api } from '../../services/api'

interface Contact {
  id: number
  name: string
  phone: string
  email: string | null
  message: string | null
  created_at: string
}

export default function ContactsList() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getContacts().then((data) => {
      setContacts(data as Contact[])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="text-gray-500">Đang tải...</div>

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Đăng ký tư vấn ({contacts.length})</h1>
      {contacts.length === 0 ? (
        <p className="text-gray-500">Chưa có đăng ký nào.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-4 py-3 font-semibold text-gray-600">#</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Họ tên</th>
                <th className="px-4 py-3 font-semibold text-gray-600">SĐT</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Email</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Lời nhắn</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Ngày</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((c, i) => (
                <tr key={c.id} className="border-b border-gray-100 last:border-0">
                  <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{c.name}</td>
                  <td className="px-4 py-3 text-gray-700">{c.phone}</td>
                  <td className="px-4 py-3 text-gray-700">{c.email || '-'}</td>
                  <td className="max-w-xs truncate px-4 py-3 text-gray-700">{c.message || '-'}</td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{new Date(c.created_at).toLocaleString('vi-VN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
