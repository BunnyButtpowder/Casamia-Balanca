import { createContext, useCallback, useContext, useState } from 'react'
import { AlertCircle, CheckCircle, XCircle, X } from 'lucide-react'

interface BaseToast {
  id: number
  message: string
}

interface MessageToast extends BaseToast {
  type: 'success' | 'error'
}

interface ConfirmToast extends BaseToast {
  type: 'confirm'
  confirmLabel: string
  cancelLabel: string
  tone: 'danger' | 'default'
  resolve: (value: boolean) => void
}

type Toast = MessageToast | ConfirmToast

interface ConfirmOptions {
  confirmLabel?: string
  cancelLabel?: string
  tone?: 'danger' | 'default'
}

interface ToastContextValue {
  success: (message: string) => void
  error: (message: string) => void
  confirm: (message: string, options?: ConfirmOptions) => Promise<boolean>
}

const ToastContext = createContext<ToastContextValue | null>(null)

let nextId = 0

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const remove = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const pushMessage = useCallback((type: MessageToast['type'], message: string) => {
    const id = ++nextId
    setToasts((prev) => [...prev, { id, type, message }])
    setTimeout(() => remove(id), 4000)
  }, [remove])

  const resolveConfirm = useCallback((toast: ConfirmToast, value: boolean) => {
    toast.resolve(value)
    remove(toast.id)
  }, [remove])

  const confirm = useCallback(
    (message: string, options: ConfirmOptions = {}) =>
      new Promise<boolean>((resolve) => {
        const id = ++nextId
        setToasts((prev) => [
          ...prev,
          {
            id,
            type: 'confirm',
            message,
            confirmLabel: options.confirmLabel ?? 'Xác nhận',
            cancelLabel: options.cancelLabel ?? 'Hủy',
            tone: options.tone ?? 'danger',
            resolve,
          },
        ])
      }),
    [],
  )

  const value: ToastContextValue = {
    success: useCallback((msg: string) => pushMessage('success', msg), [pushMessage]),
    error: useCallback((msg: string) => pushMessage('error', msg), [pushMessage]),
    confirm,
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-4 right-4 z-200 flex flex-col gap-2">
        {toasts.map((t) => {
          if (t.type === 'confirm') {
            return (
              <div
                key={t.id}
                role="alertdialog"
                aria-modal="false"
                className="flex w-80 flex-col gap-3 rounded-lg bg-white p-4 shadow-lg ring-1 ring-gray-200 animate-[slideIn_0.2s_ease-out]"
              >
                <div className="flex items-start gap-2">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                  <span className="text-sm text-gray-800">{t.message}</span>
                </div>
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => resolveConfirm(t, false)}
                    className="cursor-pointer rounded px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-100"
                  >
                    {t.cancelLabel}
                  </button>
                  <button
                    type="button"
                    onClick={() => resolveConfirm(t, true)}
                    className={`cursor-pointer rounded px-3 py-1.5 text-xs font-medium text-white transition-colors ${
                      t.tone === 'danger'
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {t.confirmLabel}
                  </button>
                </div>
              </div>
            )
          }

          return (
            <div
              key={t.id}
              className={`flex items-start gap-2 rounded-lg px-4 py-3 text-sm shadow-lg animate-[slideIn_0.2s_ease-out] ${
                t.type === 'success'
                  ? 'bg-green-600 text-white'
                  : 'bg-red-600 text-white'
              }`}
            >
              {t.type === 'success' ? (
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0" />
              ) : (
                <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
              )}
              <span className="max-w-xs">{t.message}</span>
              <button
                type="button"
                onClick={() => remove(t.id)}
                className="ml-2 shrink-0 cursor-pointer rounded p-0.5 hover:bg-white/20"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )
        })}
      </div>
      <style>{`@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
