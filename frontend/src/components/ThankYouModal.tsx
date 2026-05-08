import { useEffect } from 'react'
import { Check } from 'lucide-react'

interface ThankYouModalProps {
    open: boolean
    onClose: () => void
    title?: string
    subtitle?: string
    buttonLabel?: string
}

export default function ThankYouModal({
    open,
    onClose,
    title = 'Cảm ơn Quý khách\nđã để lại thông tin',
    subtitle = 'Chân thành cảm ơn Quý khách đã quan tâm đến\nkhông gian sống tại Casamia.',
    buttonLabel = 'Quay lại',
}: ThankYouModalProps) {
    useEffect(() => {
        if (!open) return
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        const prevOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        window.addEventListener('keydown', onKeyDown)
        return () => {
            document.body.style.overflow = prevOverflow
            window.removeEventListener('keydown', onKeyDown)
        }
    }, [open, onClose])

    if (!open) return null

    return (
        <div
            className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 px-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
        >
            <div
                className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-warm shadow-2xl sm:max-w-md"
                onClick={(e) => e.stopPropagation()}
            >
                <img
                    src="/popup-bg.png"
                    alt=""
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 top-0 mx-auto w-full select-none"
                />

                <div className="relative flex flex-col items-center px-6 pt-14 pb-8 text-center sm:px-10 sm:pt-16 sm:pb-10">
                    <Check
                        className="text-secondary"
                        strokeWidth={3}
                        size={72}
                        aria-hidden="true"
                    />

                    <h3 className="mt-8 whitespace-pre-line font-sagire text-3xl leading-tight text-secondary sm:mt-10 sm:text-4xl">
                        {title}
                    </h3>

                    <p className="mt-3 whitespace-pre-line text-sm text-black/70 sm:text-base">
                        {subtitle}
                    </p>

                    <button
                        type="button"
                        onClick={onClose}
                        className="mt-6 cursor-pointer rounded-md bg-secondary px-8 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-white transition-opacity hover:opacity-90 sm:mt-8 sm:text-sm"
                    >
                        {buttonLabel}
                    </button>
                </div>
            </div>
        </div>
    )
}
