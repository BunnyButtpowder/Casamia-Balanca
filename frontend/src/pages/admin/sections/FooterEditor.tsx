import { useState, useEffect } from 'react'
import { api } from '../../../services/api'
import type { FooterSection } from '../../../types/sections'
import MediaUploader from '../components/MediaUploader'

export default function FooterEditor() {
  const [form, setForm] = useState<FooterSection | null>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'saving' | 'saved' | 'error'>('loading')

  useEffect(() => {
    api.getSection<FooterSection>('footer').then((data) => {
      setForm(data)
      setStatus('idle')
    }).catch(() => setStatus('error'))
  }, [])

  const handleSave = async () => {
    if (!form) return
    setStatus('saving')
    try {
      await api.updateSection('footer', form)
      setStatus('saved')
      setTimeout(() => setStatus('idle'), 2000)
    } catch {
      setStatus('error')
    }
  }

  const updateGalleryImage = (index: number, val: string) => {
    if (!form) return
    const images = [...form.galleryImages]
    images[index] = val
    setForm({ ...form, galleryImages: images })
  }

  if (status === 'loading' || !form) return <div className="text-gray-500">Đang tải...</div>

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Footer</h1>
        <button onClick={handleSave} disabled={status === 'saving'} className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
          {status === 'saving' ? 'Đang lưu...' : status === 'saved' ? 'Đã lưu!' : 'Lưu'}
        </button>
      </div>
      {status === 'error' && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">Có lỗi xảy ra</div>}

      <div className="space-y-6">
        <div className="rounded-xl bg-white p-6 shadow-sm space-y-4">
          <h2 className="font-semibold text-gray-800">Thư viện hình ảnh ({form.galleryImages.length})</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {form.galleryImages.map((img, i) => (
              <div key={i} className="relative">
                <MediaUploader value={img} onChange={(url) => updateGalleryImage(i, url)} />
                <button onClick={() => setForm({ ...form, galleryImages: form.galleryImages.filter((_, idx) => idx !== i) })} className="absolute -right-2 -top-2 rounded-full bg-red-500 px-1.5 py-0.5 text-xs text-white hover:bg-red-600">Xoá</button>
              </div>
            ))}
          </div>
          <button onClick={() => setForm({ ...form, galleryImages: [...form.galleryImages, ''] })} className="rounded-lg border border-dashed border-gray-300 px-4 py-2 text-sm text-gray-500 hover:border-gray-400">+ Thêm</button>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm space-y-4">
          <h2 className="font-semibold text-gray-800">Thông tin liên hệ</h2>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Địa chỉ văn phòng</label>
            <textarea value={form.salesOfficeAddress} onChange={(e) => setForm({ ...form, salesOfficeAddress: e.target.value })} rows={2} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Số điện thoại</label>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500" />
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm space-y-4">
          <h2 className="font-semibold text-gray-800">Mạng xã hội</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">TikTok URL</label>
              <input value={form.socialLinks.tiktok} onChange={(e) => setForm({ ...form, socialLinks: { ...form.socialLinks, tiktok: e.target.value } })} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Facebook URL</label>
              <input value={form.socialLinks.facebook} onChange={(e) => setForm({ ...form, socialLinks: { ...form.socialLinks, facebook: e.target.value } })} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Zalo URL</label>
              <input value={form.socialLinks.zalo} onChange={(e) => setForm({ ...form, socialLinks: { ...form.socialLinks, zalo: e.target.value } })} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500" />
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Bản quyền</label>
            <input value={form.copyright} onChange={(e) => setForm({ ...form, copyright: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500" />
          </div>
        </div>
      </div>
    </div>
  )
}
