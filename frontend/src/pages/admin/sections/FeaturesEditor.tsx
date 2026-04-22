import { useState, useEffect } from 'react'
import { api } from '../../../services/api'
import type { FeaturesSection } from '../../../types/sections'
import MediaUploader from '../components/MediaUploader'

export default function FeaturesEditor() {
  const [form, setForm] = useState<FeaturesSection | null>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'saving' | 'saved' | 'error'>('loading')

  useEffect(() => {
    api.getSection<FeaturesSection>('features').then((data) => {
      setForm(data)
      setStatus('idle')
    }).catch(() => setStatus('error'))
  }, [])

  const handleSave = async () => {
    if (!form) return
    setStatus('saving')
    try {
      await api.updateSection('features', form)
      setStatus('saved')
      setTimeout(() => setStatus('idle'), 2000)
    } catch {
      setStatus('error')
    }
  }

  const updateStat = (index: number, field: 'value' | 'label', val: string) => {
    if (!form) return
    const stats = [...form.stats]
    stats[index] = { ...stats[index], [field]: val }
    setForm({ ...form, stats })
  }

  const updateSlide = (index: number, field: keyof FeaturesSection['slides'][0], val: string) => {
    if (!form) return
    const slides = [...form.slides]
    slides[index] = { ...slides[index], [field]: val }
    setForm({ ...form, slides })
  }

  const removeSlide = (index: number) => {
    if (!form) return
    setForm({ ...form, slides: form.slides.filter((_, i) => i !== index) })
  }

  if (status === 'loading' || !form) return <div className="text-gray-500">Đang tải...</div>

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Tiện ích</h1>
        <button onClick={handleSave} disabled={status === 'saving'} className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
          {status === 'saving' ? 'Đang lưu...' : status === 'saved' ? 'Đã lưu!' : 'Lưu'}
        </button>
      </div>
      {status === 'error' && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">Có lỗi xảy ra</div>}

      <div className="space-y-6">
        <div className="rounded-xl bg-white p-6 shadow-sm space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Tiêu đề</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Phụ đề</label>
            <input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Mô tả</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500" />
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm space-y-4">
          <h2 className="font-semibold text-gray-800">Thống kê ({form.stats.length} mục)</h2>
          {form.stats.map((stat, i) => (
            <div key={i} className="grid gap-4 sm:grid-cols-2 border-b border-gray-100 pb-4 last:border-0">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Giá trị #{i + 1}</label>
                <input value={stat.value} onChange={(e) => updateStat(i, 'value', e.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Nhãn #{i + 1}</label>
                <textarea value={stat.label} onChange={(e) => updateStat(i, 'label', e.target.value)} rows={2} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500" />
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm space-y-4">
          <h2 className="font-semibold text-gray-800">Slides tiện ích ({form.slides.length} mục)</h2>
          {form.slides.map((slide, i) => (
            <div key={i} className="rounded-lg border border-gray-200 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-600">Slide #{i + 1}</span>
                <button onClick={() => removeSlide(i)} className="text-red-500 hover:text-red-700 text-sm">Xoá</button>
              </div>
              <MediaUploader value={slide.src} onChange={(url) => updateSlide(i, 'src', url)} label="Hình ảnh" />
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Tiêu đề</label>
                  <input value={slide.title} onChange={(e) => updateSlide(i, 'title', e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Mô tả</label>
                  <input value={slide.desc} onChange={(e) => updateSlide(i, 'desc', e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Danh mục</label>
                  <select value={slide.cat} onChange={(e) => updateSlide(i, 'cat', e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-blue-500">
                    <option value="health-care">Tiện ích sức khoẻ</option>
                    <option value="service">Tiện ích dịch vụ</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
          <button
            onClick={() => setForm({ ...form, slides: [...form.slides, { src: '', title: '', desc: '', cat: 'health-care' }] })}
            className="rounded-lg border border-dashed border-gray-300 px-4 py-2 text-sm text-gray-500 hover:border-gray-400 hover:text-gray-700"
          >
            + Thêm slide
          </button>
        </div>
      </div>
    </div>
  )
}
