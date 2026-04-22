import { useState, useEffect } from 'react'
import { api } from '../../../services/api'
import type { HeroSection } from '../../../types/sections'
import MediaUploader from '../components/MediaUploader'

export default function HeroEditor() {
  const [form, setForm] = useState<HeroSection>({
    videoUrl: '',
    titleLine1Word1: '',
    titleLine1Word2: '',
    titleLine2Word1: '',
    titleLine2Word2: '',
    subtitle: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'saving' | 'saved' | 'error'>('loading')

  useEffect(() => {
    api.getSection<HeroSection>('hero').then((data) => {
      setForm(data)
      setStatus('idle')
    }).catch(() => setStatus('error'))
  }, [])

  const handleSave = async () => {
    setStatus('saving')
    try {
      await api.updateSection('hero', form)
      setStatus('saved')
      setTimeout(() => setStatus('idle'), 2000)
    } catch {
      setStatus('error')
    }
  }

  if (status === 'loading') return <div className="text-gray-500">Đang tải...</div>

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Hero Section</h1>
        <button onClick={handleSave} disabled={status === 'saving'} className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
          {status === 'saving' ? 'Đang lưu...' : status === 'saved' ? 'Đã lưu!' : 'Lưu'}
        </button>
      </div>
      {status === 'error' && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">Có lỗi xảy ra</div>}
      <div className="space-y-5 rounded-xl bg-white p-6 shadow-sm">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Video</label>
          <MediaUploader value={form.videoUrl} onChange={(url) => setForm({ ...form, videoUrl: url })} accept="video" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Dòng 1 - Từ 1 (font Alishanty)</label>
            <input value={form.titleLine1Word1} onChange={(e) => setForm({ ...form, titleLine1Word1: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Dòng 1 - Từ 2 (font Sagire)</label>
            <input value={form.titleLine1Word2} onChange={(e) => setForm({ ...form, titleLine1Word2: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Dòng 2 - Từ 1 (font Alishanty)</label>
            <input value={form.titleLine2Word1} onChange={(e) => setForm({ ...form, titleLine2Word1: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Dòng 2 - Từ 2 (font Sagire)</label>
            <input value={form.titleLine2Word2} onChange={(e) => setForm({ ...form, titleLine2Word2: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500" />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Phụ đề</label>
          <input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500" />
        </div>
      </div>
    </div>
  )
}
