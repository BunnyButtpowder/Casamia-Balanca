import { useState, useEffect } from 'react'
import { api } from '../../../services/api'
import type { MapSection } from '../../../types/sections'

export default function MapEditor() {
  const [form, setForm] = useState<MapSection | null>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'saving' | 'saved' | 'error'>('loading')

  useEffect(() => {
    api.getSection<MapSection>('map').then((data) => {
      setForm(data)
      setStatus('idle')
    }).catch(() => setStatus('error'))
  }, [])

  const handleSave = async () => {
    if (!form) return
    setStatus('saving')
    try {
      await api.updateSection('map', form)
      setStatus('saved')
      setTimeout(() => setStatus('idle'), 2000)
    } catch {
      setStatus('error')
    }
  }

  const updateLocation = (index: number, field: 'name' | 'time', val: string) => {
    if (!form) return
    const locations = [...form.locations]
    locations[index] = { ...locations[index], [field]: val }
    setForm({ ...form, locations })
  }

  const removeLocation = (index: number) => {
    if (!form) return
    setForm({ ...form, locations: form.locations.filter((_, i) => i !== index) })
  }

  if (status === 'loading' || !form) return <div className="text-gray-500">Đang tải...</div>

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Vị trí</h1>
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
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Link tải tài liệu</label>
            <input value={form.downloadUrl} onChange={(e) => setForm({ ...form, downloadUrl: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500" />
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm space-y-4">
          <h2 className="font-semibold text-gray-800">Địa điểm lân cận ({form.locations.length} mục)</h2>
          {form.locations.map((loc, i) => (
            <div key={i} className="flex items-center gap-3 border-b border-gray-100 pb-3 last:border-0">
              <input value={loc.name} onChange={(e) => updateLocation(i, 'name', e.target.value)} placeholder="Tên địa điểm" className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500" />
              <input value={loc.time} onChange={(e) => updateLocation(i, 'time', e.target.value)} placeholder="Thời gian" className="w-32 rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500" />
              <button onClick={() => removeLocation(i)} className="text-red-500 hover:text-red-700 text-sm">Xoá</button>
            </div>
          ))}
          <button
            onClick={() => setForm({ ...form, locations: [...form.locations, { name: '', time: '' }] })}
            className="rounded-lg border border-dashed border-gray-300 px-4 py-2 text-sm text-gray-500 hover:border-gray-400 hover:text-gray-700"
          >
            + Thêm địa điểm
          </button>
        </div>
      </div>
    </div>
  )
}
