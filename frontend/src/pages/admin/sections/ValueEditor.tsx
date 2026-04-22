import { useState, useEffect } from 'react'
import { api } from '../../../services/api'
import type { ValueSection } from '../../../types/sections'

export default function ValueEditor() {
  const [form, setForm] = useState<ValueSection | null>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'saving' | 'saved' | 'error'>('loading')

  useEffect(() => {
    api.getSection<ValueSection>('value').then((data) => {
      setForm(data)
      setStatus('idle')
    }).catch(() => setStatus('error'))
  }, [])

  const handleSave = async () => {
    if (!form) return
    setStatus('saving')
    try {
      await api.updateSection('value', form)
      setStatus('saved')
      setTimeout(() => setStatus('idle'), 2000)
    } catch {
      setStatus('error')
    }
  }

  const updateAward = (index: number, field: keyof ValueSection['awards'][0], val: string) => {
    if (!form) return
    const awards = [...form.awards]
    awards[index] = { ...awards[index], [field]: val }
    setForm({ ...form, awards })
  }

  const updateDeliveryItem = (index: number, val: string) => {
    if (!form) return
    const items = [...form.deliveryItems]
    items[index] = val
    setForm({ ...form, deliveryItems: items })
  }

  if (status === 'loading' || !form) return <div className="text-gray-500">Đang tải...</div>

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Giá trị</h1>
        <button onClick={handleSave} disabled={status === 'saving'} className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
          {status === 'saving' ? 'Đang lưu...' : status === 'saved' ? 'Đã lưu!' : 'Lưu'}
        </button>
      </div>
      {status === 'error' && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">Có lỗi xảy ra</div>}

      <div className="space-y-6">
        <div className="rounded-xl bg-white p-6 shadow-sm space-y-4">
          <h2 className="font-semibold text-gray-800">Tiêu đề chính</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Dòng 1 - Phần 1 (Sagire)</label>
              <input value={form.heading1Part1} onChange={(e) => setForm({ ...form, heading1Part1: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Dòng 1 - Phần 2 (Alishanty)</label>
              <input value={form.heading1Part2} onChange={(e) => setForm({ ...form, heading1Part2: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Dòng 2 - Phần 1 (Sagire)</label>
              <input value={form.heading2Part1} onChange={(e) => setForm({ ...form, heading2Part1: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Dòng 2 - Phần 2 (Alishanty)</label>
              <input value={form.heading2Part2} onChange={(e) => setForm({ ...form, heading2Part2: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Đoạn văn 1</label>
            <textarea value={form.paragraph1} onChange={(e) => setForm({ ...form, paragraph1: e.target.value })} rows={3} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Đoạn văn 2</label>
            <textarea value={form.paragraph2} onChange={(e) => setForm({ ...form, paragraph2: e.target.value })} rows={3} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500" />
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm space-y-4">
          <h2 className="font-semibold text-gray-800">Chủ đầu tư</h2>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Tiêu đề</label>
            <input value={form.developerTitle} onChange={(e) => setForm({ ...form, developerTitle: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Phụ đề</label>
            <input value={form.developerSubtitle} onChange={(e) => setForm({ ...form, developerSubtitle: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Mô tả</label>
            <textarea value={form.developerDescription} onChange={(e) => setForm({ ...form, developerDescription: e.target.value })} rows={3} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500" />
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm space-y-4">
          <h2 className="font-semibold text-gray-800">Giải thưởng chủ đầu tư ({form.awards.length})</h2>
          {form.awards.map((award, i) => (
            <div key={i} className="grid gap-3 sm:grid-cols-3 border-b border-gray-100 pb-4 last:border-0">
              <input value={award.image} onChange={(e) => updateAward(i, 'image', e.target.value)} placeholder="URL hình" className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-blue-500" />
              <input value={award.title} onChange={(e) => updateAward(i, 'title', e.target.value)} placeholder="Tiêu đề" className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-blue-500" />
              <input value={award.description} onChange={(e) => updateAward(i, 'description', e.target.value)} placeholder="Mô tả" className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-blue-500" />
            </div>
          ))}
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm space-y-4">
          <h2 className="font-semibold text-gray-800">Phương án bàn giao</h2>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Tiêu đề</label>
            <input value={form.deliveryTitle} onChange={(e) => setForm({ ...form, deliveryTitle: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Phụ đề</label>
            <input value={form.deliverySubtitle} onChange={(e) => setForm({ ...form, deliverySubtitle: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Các phương án</label>
            {form.deliveryItems.map((item, i) => (
              <div key={i} className="mb-2 flex items-center gap-3">
                <input value={item} onChange={(e) => updateDeliveryItem(i, e.target.value)} className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500" />
                <button onClick={() => setForm({ ...form, deliveryItems: form.deliveryItems.filter((_, idx) => idx !== i) })} className="text-red-500 hover:text-red-700 text-sm">Xoá</button>
              </div>
            ))}
            <button onClick={() => setForm({ ...form, deliveryItems: [...form.deliveryItems, ''] })} className="rounded-lg border border-dashed border-gray-300 px-4 py-2 text-sm text-gray-500 hover:border-gray-400">+ Thêm</button>
          </div>
        </div>
      </div>
    </div>
  )
}
