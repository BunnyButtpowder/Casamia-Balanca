import { useRef, useState } from 'react'
import { Upload, X } from 'lucide-react'
import { api, resolveUploadUrl } from '../../../services/api'

interface MediaUploaderProps {
  value: string
  onChange: (url: string) => void
  accept?: 'image' | 'video'
  label?: string
}

const ACCEPT_MAP = {
  image: 'image/jpeg,image/png,image/webp',
  video: 'video/mp4,video/webm,video/quicktime',
}

export default function MediaUploader({ value, onChange, accept = 'image', label }: MediaUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (file: File) => {
    setUploading(true)
    try {
      const { url } = await api.uploadFile(file, value || undefined)
      onChange(url)
    } catch {
      // silently fail — parent handles error state
    } finally {
      setUploading(false)
    }
  }

  const resolved = resolveUploadUrl(value)

  return (
    <div>
      {label && <label className="mb-1 block text-xs font-medium text-gray-600">{label}</label>}
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPT_MAP[accept]}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleUpload(file)
          e.target.value = ''
        }}
      />
      {value ? (
        <div className="relative rounded-lg border border-gray-200 bg-gray-50 p-2">
          {accept === 'video' ? (
            <video src={resolved} controls className="max-h-40 w-full rounded object-contain" />
          ) : (
            <img src={resolved} alt="" className="max-h-40 w-full rounded object-contain" />
          )}
          <div className="mt-1.5 flex items-center justify-between">
            <span className="max-w-[60%] truncate text-xs text-gray-500">{value}</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="rounded bg-gray-200 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-300"
              >
                Thay đổi
              </button>
              <button
                type="button"
                onClick={() => onChange('')}
                className="rounded bg-red-100 p-1 text-red-600 hover:bg-red-200"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 px-4 py-6 text-sm text-gray-500 hover:border-blue-400 hover:text-blue-500 disabled:opacity-50"
        >
          {uploading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
              Đang tải lên...
            </>
          ) : (
            <>
              <Upload size={18} />
              Nhấn để tải lên
            </>
          )}
        </button>
      )}
    </div>
  )
}
