import { useRef, useState } from 'react'
import { ImagePlus } from 'lucide-react'
import { api } from '../../../services/api'
import { useToast } from '../../../components/Toast'

interface AlbumUploaderProps {
  onUploaded: (urls: string[]) => void
  label?: string
}

export default function AlbumUploader({ onUploaded, label = 'Thêm ảnh vào album' }: AlbumUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState({ done: 0, total: 0 })
  const toast = useToast()

  const handleFiles = async (files: FileList) => {
    const fileArr = Array.from(files)
    if (fileArr.length === 0) return
    setUploading(true)
    setProgress({ done: 0, total: fileArr.length })
    const uploaded: string[] = []
    for (let i = 0; i < fileArr.length; i++) {
      try {
        const { url } = await api.uploadFile(fileArr[i])
        uploaded.push(url)
      } catch (err) {
        toast.error(`Tải lên thất bại (${fileArr[i].name}): ${err instanceof Error ? err.message : 'Lỗi'}`)
      }
      setProgress({ done: i + 1, total: fileArr.length })
    }
    if (uploaded.length > 0) onUploaded(uploaded)
    setUploading(false)
    setProgress({ done: 0, total: 0 })
  }

  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-gray-600">{label}</label>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files) handleFiles(e.target.files)
          e.target.value = ''
        }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 px-4 py-6 text-sm text-gray-500 transition-colors hover:border-blue-400 hover:text-blue-500 disabled:opacity-50"
      >
        {uploading ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
            Đang tải {progress.done}/{progress.total}...
          </>
        ) : (
          <>
            <ImagePlus size={18} />
            Chọn nhiều ảnh để tải lên
          </>
        )}
      </button>
    </div>
  )
}
