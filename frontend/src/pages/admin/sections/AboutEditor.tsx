import { useState, useEffect } from 'react'
import { api } from '../../../services/api'
import type { AboutSection } from '../../../types/sections'
import MediaUploader from '../components/MediaUploader'

export default function AboutEditor() {
  const [form, setForm] = useState<AboutSection | null>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'saving' | 'saved' | 'error'>('loading')

  useEffect(() => {
    api.getSection<AboutSection>('about').then((data) => {
      setForm(data)
      setStatus('idle')
    }).catch(() => setStatus('error'))
  }, [])

  const handleSave = async () => {
    if (!form) return
    setStatus('saving')
    try {
      await api.updateSection('about', form)
      setStatus('saved')
      setTimeout(() => setStatus('idle'), 2000)
    } catch {
      setStatus('error')
    }
  }

  const updateStat = (index: number, field: 'label' | 'value', val: string) => {
    if (!form) return
    const stats = [...form.stats]
    stats[index] = { ...stats[index], [field]: val }
    setForm({ ...form, stats })
  }

  if (status === 'loading' || !form) return <div className="text-gray-500">Đang tải...</div>

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Giới thiệu</h1>
        <button onClick={handleSave} disabled={status === 'saving'} className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
          {status === 'saving' ? 'Đang lưu...' : status === 'saved' ? 'Đã lưu!' : 'Lưu'}
        </button>
      </div>
      {status === 'error' && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">Có lỗi xảy ra</div>}

      <div className="space-y-6">
        <div className="rounded-xl bg-white p-6 shadow-sm space-y-4">
          <h2 className="font-semibold text-gray-800">Tiêu đề phần 1</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Dòng 1</label>
              <input value={form.headingLine1} onChange={(e) => setForm({ ...form, headingLine1: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Dòng 2</label>
              <input value={form.headingLine2} onChange={(e) => setForm({ ...form, headingLine2: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500" />
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm space-y-4">
          <h2 className="font-semibold text-gray-800">TVC Video</h2>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">YouTube Video ID</label>
            <input value={form.tvcYoutubeId} onChange={(e) => setForm({ ...form, tvcYoutubeId: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500" />
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm space-y-4">
          <h2 className="font-semibold text-gray-800">Tiêu đề phần 2</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Dòng 1 - Phần 1 (font Sagire)</label>
              <input value={form.secondHeadingLine1Part1} onChange={(e) => setForm({ ...form, secondHeadingLine1Part1: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Dòng 1 - Phần 2 (font Alishanty)</label>
              <input value={form.secondHeadingLine1Part2} onChange={(e) => setForm({ ...form, secondHeadingLine1Part2: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Dòng 2 - Phần 1 (font Sagire)</label>
              <input value={form.secondHeadingLine2Part1} onChange={(e) => setForm({ ...form, secondHeadingLine2Part1: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Dòng 2 - Phần 2 (font Alishanty)</label>
              <input value={form.secondHeadingLine2Part2} onChange={(e) => setForm({ ...form, secondHeadingLine2Part2: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500" />
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm space-y-4">
          <h2 className="font-semibold text-gray-800">Hình nền banner</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Desktop</label>
              <MediaUploader value={form.bannerImage} onChange={(url) => setForm({ ...form, bannerImage: url })} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Mobile</label>
              <MediaUploader value={form.bannerImageMobile} onChange={(url) => setForm({ ...form, bannerImageMobile: url })} />
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm space-y-4">
          <h2 className="font-semibold text-gray-800">Đoạn văn thống kê</h2>
          <textarea value={form.statsParagraph} onChange={(e) => setForm({ ...form, statsParagraph: e.target.value })} rows={3} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500" />
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm space-y-4">
          <h2 className="font-semibold text-gray-800">Thống kê ({form.stats.length} mục)</h2>
          {form.stats.map((stat, i) => (
            <div key={i} className="grid gap-4 sm:grid-cols-2 border-b border-gray-100 pb-4 last:border-0">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Nhãn #{i + 1}</label>
                <textarea value={stat.label} onChange={(e) => updateStat(i, 'label', e.target.value)} rows={2} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Giá trị #{i + 1}</label>
                <input value={stat.value} onChange={(e) => updateStat(i, 'value', e.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500" />
              </div>
            </div>
          ))}
          <button
            onClick={() => setForm({ ...form, stats: [...form.stats, { label: '', value: '' }] })}
            className="rounded-lg border border-dashed border-gray-300 px-4 py-2 text-sm text-gray-500 hover:border-gray-400 hover:text-gray-700"
          >
            + Thêm thống kê
          </button>
        </div>
      </div>
    </div>
  )
}
