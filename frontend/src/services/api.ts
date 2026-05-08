const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'
const BACKEND_BASE = API_BASE.replace(/\/api$/, '')
import type { Contact } from '../types/contact'
import type { NewsArticle } from '../types/news'

export function resolveUploadUrl(path: string): string {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `${BACKEND_BASE}${path}`
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('admin_token')
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || res.statusText)
  }
  return res.json()
}

export const api = {
  getSections: () => apiFetch<Record<string, unknown>>('/sections'),
  getSection: <T>(key: string) => apiFetch<T>(`/sections/${key}`),
  updateSection: (key: string, content: unknown) =>
    apiFetch<{ success: boolean }>(`/sections/${key}`, {
      method: 'PUT',
      body: JSON.stringify({ content }),
    }),
  login: (username: string, password: string) =>
    apiFetch<{ token: string; username: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
  changePassword: (currentPassword: string, newPassword: string) =>
    apiFetch<{ success: boolean }>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    }),
  submitContact: (data: { name: string; phone: string; email?: string; message?: string }) =>
    apiFetch<{ success: boolean }>('/contacts', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  submitDownload: (data: { name: string; phone: string; city?: string; email?: string }) =>
    apiFetch<{ success: boolean }>('/downloads', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getContacts: () => apiFetch<Array<Contact>>('/contacts'),
  getDownloads: () => apiFetch<Array<Record<string, unknown>>>('/downloads'),
  // News CRUD
  getNews: () => apiFetch<NewsArticle[]>('/news'),
  getNewsArticle: (id: number) => apiFetch<NewsArticle>(`/news/${id}`),
  createNews: (data: Omit<NewsArticle, 'id' | 'created_at' | 'updated_at'>) =>
    apiFetch<NewsArticle>('/news', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateNews: (id: number, data: Omit<NewsArticle, 'id' | 'created_at' | 'updated_at'>) =>
    apiFetch<NewsArticle>(`/news/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteNews: (id: number) =>
    apiFetch<{ success: boolean }>(`/news/${id}`, { method: 'DELETE' }),

  uploadFile: async (file: File, oldPath?: string): Promise<{ url: string }> => {
    const token = localStorage.getItem('admin_token')
    const formData = new FormData()
    formData.append('file', file)
    if (oldPath) formData.append('oldPath', oldPath)
    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    })
    if (!res.ok) {
      const text = await res.text()
      throw new Error(text || res.statusText)
    }
    return res.json()
  },
}
