import { useState, useEffect } from 'react'
import { api } from '../../../services/api'
import type { ProductsSection } from '../../../types/sections'

export default function ProductsEditor() {
  const [form, setForm] = useState<ProductsSection | null>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'saving' | 'saved' | 'error'>('loading')

  useEffect(() => {
    api.getSection<ProductsSection>('products').then((data) => {
      setForm(data)
      setStatus('idle')
    }).catch(() => setStatus('error'))
  }, [])

  const handleSave = async () => {
    if (!form) return
    setStatus('saving')
    try {
      await api.updateSection('products', form)
      setStatus('saved')
      setTimeout(() => setStatus('idle'), 2000)
    } catch {
      setStatus('error')
    }
  }

  const updateImageList = (field: 'exteriorImages' | 'parkHomeExteriorImages' | 'parkHomeInteriorImages', index: number, val: string) => {
    if (!form) return
    const arr = [...form[field]]
    arr[index] = val
    setForm({ ...form, [field]: arr })
  }

  const removeImage = (field: 'exteriorImages' | 'parkHomeExteriorImages' | 'parkHomeInteriorImages', index: number) => {
    if (!form) return
    setForm({ ...form, [field]: form[field].filter((_, i) => i !== index) })
  }

  const addImage = (field: 'exteriorImages' | 'parkHomeExteriorImages' | 'parkHomeInteriorImages') => {
    if (!form) return
    setForm({ ...form, [field]: [...form[field], ''] })
  }

  const updateAward = (index: number, field: keyof ProductsSection['awards'][0], val: string) => {
    if (!form) return
    const awards = [...form.awards]
    awards[index] = { ...awards[index], [field]: val }
    setForm({ ...form, awards })
  }

  const updateVillageImage = (index: number, field: keyof ProductsSection['villageImages'][0], val: string) => {
    if (!form) return
    const villageImages = [...form.villageImages]
    villageImages[index] = { ...villageImages[index], [field]: val }
    setForm({ ...form, villageImages })
  }

  if (status === 'loading' || !form) return <div className="text-gray-500">Đang tải...</div>

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Sản phẩm</h1>
        <button onClick={handleSave} disabled={status === 'saving'} className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
          {status === 'saving' ? 'Đang lưu...' : status === 'saved' ? 'Đã lưu!' : 'Lưu'}
        </button>
      </div>
      {status === 'error' && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">Có lỗi xảy ra</div>}

      <div className="space-y-6">
        {/* Main heading */}
        <div className="rounded-xl bg-white p-6 shadow-sm space-y-4">
          <h2 className="font-semibold text-gray-800">Tiêu đề chính</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Dòng 1 - Phần 1 (font Sagire)</label>
              <input value={form.heading1Part1} onChange={(e) => setForm({ ...form, heading1Part1: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Dòng 1 - Phần 2 (font Alishanty)</label>
              <input value={form.heading1Part2} onChange={(e) => setForm({ ...form, heading1Part2: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Dòng 2 - Phần 1 (font Sagire)</label>
              <input value={form.heading2Part1} onChange={(e) => setForm({ ...form, heading2Part1: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Dòng 2 - Phần 2 (font Alishanty)</label>
              <input value={form.heading2Part2} onChange={(e) => setForm({ ...form, heading2Part2: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Mô tả</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500" />
          </div>
        </div>

        {/* Exterior carousel */}
        <div className="rounded-xl bg-white p-6 shadow-sm space-y-4">
          <h2 className="font-semibold text-gray-800">Hình ảnh ngoại thất ({form.exteriorImages.length})</h2>
          {form.exteriorImages.map((img, i) => (
            <div key={i} className="flex items-center gap-3">
              <input value={img} onChange={(e) => updateImageList('exteriorImages', i, e.target.value)} placeholder="URL hình ảnh" className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500" />
              <button onClick={() => removeImage('exteriorImages', i)} className="text-red-500 hover:text-red-700 text-sm">Xoá</button>
            </div>
          ))}
          <button onClick={() => addImage('exteriorImages')} className="rounded-lg border border-dashed border-gray-300 px-4 py-2 text-sm text-gray-500 hover:border-gray-400">+ Thêm</button>
        </div>

        {/* Architect */}
        <div className="rounded-xl bg-white p-6 shadow-sm space-y-4">
          <h2 className="font-semibold text-gray-800">Kiến trúc sư</h2>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Tiêu đề</label>
            <input value={form.architectTitle} onChange={(e) => setForm({ ...form, architectTitle: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Tên KTS</label>
            <input value={form.architectName} onChange={(e) => setForm({ ...form, architectName: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Mô tả</label>
            <textarea value={form.architectDescription} onChange={(e) => setForm({ ...form, architectDescription: e.target.value })} rows={3} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500" />
          </div>
        </div>

        {/* Awards */}
        <div className="rounded-xl bg-white p-6 shadow-sm space-y-4">
          <h2 className="font-semibold text-gray-800">Giải thưởng KTS ({form.awards.length})</h2>
          {form.awards.map((award, i) => (
            <div key={i} className="rounded-lg border border-gray-200 p-4 space-y-3">
              <div className="grid gap-3 sm:grid-cols-3">
                <input value={award.image} onChange={(e) => updateAward(i, 'image', e.target.value)} placeholder="URL hình" className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-blue-500" />
                <input value={award.title} onChange={(e) => updateAward(i, 'title', e.target.value)} placeholder="Tiêu đề" className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-blue-500" />
                <input value={award.description} onChange={(e) => updateAward(i, 'description', e.target.value)} placeholder="Mô tả" className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-blue-500" />
              </div>
            </div>
          ))}
        </div>

        {/* Park Home */}
        <div className="rounded-xl bg-white p-6 shadow-sm space-y-4">
          <h2 className="font-semibold text-gray-800">Park Home</h2>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Tiêu đề</label>
            <input value={form.parkHomeTitle} onChange={(e) => setForm({ ...form, parkHomeTitle: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Phụ đề 1</label>
              <input value={form.parkHomeSubheading1} onChange={(e) => setForm({ ...form, parkHomeSubheading1: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Phụ đề 2</label>
              <input value={form.parkHomeSubheading2} onChange={(e) => setForm({ ...form, parkHomeSubheading2: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Nhãn tab ngoại thất</label>
              <input value={form.parkHomeExteriorLabel} onChange={(e) => setForm({ ...form, parkHomeExteriorLabel: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Nhãn tab nội thất</label>
              <input value={form.parkHomeInteriorLabel} onChange={(e) => setForm({ ...form, parkHomeInteriorLabel: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Tiêu đề mẫu ngoại thất</label>
              <input value={form.parkHomeExteriorTitle} onChange={(e) => setForm({ ...form, parkHomeExteriorTitle: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Tiêu đề mẫu nội thất</label>
              <input value={form.parkHomeInteriorTitle} onChange={(e) => setForm({ ...form, parkHomeInteriorTitle: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Mô tả</label>
            <textarea value={form.parkHomeDescription} onChange={(e) => setForm({ ...form, parkHomeDescription: e.target.value })} rows={3} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500" />
          </div>
        </div>

        {/* Park Home exterior images */}
        <div className="rounded-xl bg-white p-6 shadow-sm space-y-4">
          <h2 className="font-semibold text-gray-800">Park Home - Mẫu 1 ({form.parkHomeExteriorImages.length} ảnh)</h2>
          {form.parkHomeExteriorImages.map((img, i) => (
            <div key={i} className="flex items-center gap-3">
              <input value={img} onChange={(e) => updateImageList('parkHomeExteriorImages', i, e.target.value)} className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500" />
              <button onClick={() => removeImage('parkHomeExteriorImages', i)} className="text-red-500 hover:text-red-700 text-sm">Xoá</button>
            </div>
          ))}
          <button onClick={() => addImage('parkHomeExteriorImages')} className="rounded-lg border border-dashed border-gray-300 px-4 py-2 text-sm text-gray-500 hover:border-gray-400">+ Thêm</button>
        </div>

        {/* Park Home interior images */}
        <div className="rounded-xl bg-white p-6 shadow-sm space-y-4">
          <h2 className="font-semibold text-gray-800">Park Home - Mẫu 2 ({form.parkHomeInteriorImages.length} ảnh)</h2>
          {form.parkHomeInteriorImages.map((img, i) => (
            <div key={i} className="flex items-center gap-3">
              <input value={img} onChange={(e) => updateImageList('parkHomeInteriorImages', i, e.target.value)} className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500" />
              <button onClick={() => removeImage('parkHomeInteriorImages', i)} className="text-red-500 hover:text-red-700 text-sm">Xoá</button>
            </div>
          ))}
          <button onClick={() => addImage('parkHomeInteriorImages')} className="rounded-lg border border-dashed border-gray-300 px-4 py-2 text-sm text-gray-500 hover:border-gray-400">+ Thêm</button>
        </div>

        {/* Operations / Village */}
        <div className="rounded-xl bg-white p-6 shadow-sm space-y-4">
          <h2 className="font-semibold text-gray-800">Hợp tác vận hành</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Tiêu đề dòng 1</label>
              <input value={form.operationsTitle1} onChange={(e) => setForm({ ...form, operationsTitle1: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Tiêu đề dòng 2</label>
              <input value={form.operationsTitle2} onChange={(e) => setForm({ ...form, operationsTitle2: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Phụ đề</label>
            <input value={form.operationsSubtitle} onChange={(e) => setForm({ ...form, operationsSubtitle: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Logo Village URL</label>
            <input value={form.villageLogoUrl} onChange={(e) => setForm({ ...form, villageLogoUrl: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Mô tả vận hành</label>
            <textarea value={form.villageDescription} onChange={(e) => setForm({ ...form, villageDescription: e.target.value })} rows={3} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500" />
          </div>
        </div>

        {/* Village images */}
        <div className="rounded-xl bg-white p-6 shadow-sm space-y-4">
          <h2 className="font-semibold text-gray-800">Hình ảnh vận hành ({form.villageImages.length})</h2>
          {form.villageImages.map((img, i) => (
            <div key={i} className="rounded-lg border border-gray-200 p-4 space-y-3">
              <div className="grid gap-3 sm:grid-cols-3">
                <input value={img.src} onChange={(e) => updateVillageImage(i, 'src', e.target.value)} placeholder="URL hình" className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-blue-500" />
                <input value={img.title} onChange={(e) => updateVillageImage(i, 'title', e.target.value)} placeholder="Tiêu đề" className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-blue-500" />
                <input value={img.desc} onChange={(e) => updateVillageImage(i, 'desc', e.target.value)} placeholder="Mô tả" className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-blue-500" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
