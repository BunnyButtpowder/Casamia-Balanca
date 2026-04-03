import { useRef } from "react"
import { MapPin, Phone } from 'lucide-react'

export default function Footer({ fixed = true }: { fixed?: boolean }) {
    const footerRef = useRef<HTMLElement>(null)

    return (
        <footer ref={footerRef} id="contact" className={`${fixed ? 'fixed bottom-0 left-0 right-0 z-50' : 'relative'} overflow-hidden rounded-t-3xl bg-secondary`}>
                <div className="relative overflow-hidden">
                    <img
                        src="/bg-footer.png"
                        alt=""
                        className="pointer-events-none absolute inset-0 h-full w-full scale-140 object-cover mt-20"
                    />

                    <div className="relative mx-auto max-w-6xl px-6 py-14 sm:px-10 sm:py-20 lg:px-20">
                        <div className="flex flex-col-reverse gap-12 md:flex-row md:gap-16">
                            {/* Left column — logo, info, socials */}
                            <div className="md:w-[38%] md:shrink-0">
                                <div className="items-center justify-center flex">
                                    <img
                                        src="/logo-footer.png"
                                        alt="Casamia Balanca Hoi An"
                                        className="w-44 object-contain sm:w-52"
                                    />
                                </div>

                                <div className="mt-8 space-y-6 text-sm text-white/90 sm:text-base">
                                    <div>
                                        <h3 className="font-bold uppercase tracking-wider text-white">Văn phòng Hà Nội</h3>
                                        <p className="mt-2 flex items-start gap-2">
                                            <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                                            <span>Tầng 15, tòa nhà Handico Tower, Đường Phạm Hùng, Phường Từ Liêm, TP. Hà Nội</span>
                                        </p>
                                        <p className="mt-1 flex items-center gap-2">
                                            <Phone className="h-4 w-4 shrink-0" />
                                            <span>1800 6918</span>
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="font-bold uppercase tracking-wider text-white">Văn phòng Hội An</h3>
                                        <p className="mt-2 flex items-start gap-2">
                                            <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                                            <span>Số nhà LK3.17, KĐT Casamia Phường Hội An Đông, Đà Nẵng</span>
                                        </p>
                                        <p className="mt-1 flex items-center gap-2">
                                            <Phone className="h-4 w-4 shrink-0" />
                                            <span>1800 6918</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <p className="text-xs font-bold uppercase tracking-wider text-white sm:text-sm">Cập nhật thông tin tại</p>
                                    <div className="mt-3 flex gap-3">
                                        <a href="#" className="rounded-xl flex h-10 w-10 items-center justify-center bg-white text-secondary transition-opacity hover:opacity-90">
                                            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.75a8.18 8.18 0 0 0 4.76 1.52V6.84a4.84 4.84 0 0 1-1-.15z" /></svg>
                                        </a>
                                        <a href="#" className="rounded-xl flex h-10 w-10 items-center justify-center bg-white text-secondary transition-opacity hover:opacity-90">
                                            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                                        </a>
                                    </div>
                                </div>

                                <p className="mt-6 text-xs text-white/50">
                                    &copy;Bản quyền thuộc về Casamia Balanca Hội An
                                </p>
                            </div>

                            {/* Right column — subscribe form */}
                            <div className="flex-1">
                                <div className="rounded-2xl bg-white px-8 py-8 sm:px-10 sm:py-10">
                                    <h3 className="font-sagire text-center text-2xl text-secondary sm:text-3xl md:text-4xl">
                                        Đăng ký nhận tư vấn
                                    </h3>
                                    <p className="mt-2 text-center text-xs text-black/70 sm:text-sm">
                                        Vui lòng để lại thông tin.<br />
                                        Tư vấn viên sẽ liên hệ quý khách trong thời gian sớm nhất.
                                    </p>

                                    <form className="mt-8 space-y-5" onSubmit={(e) => e.preventDefault()}>
                                        <div className="flex flex-col gap-1">
                                            <label className="text-xs font-semibold text-black/70 sm:text-sm">Họ tên</label>
                                            <input
                                                type="text"
                                                placeholder="Điền thông tin của bạn"
                                                className="border-b border-black/20 bg-transparent py-2 text-sm outline-none placeholder:text-black/30 focus:border-secondary"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-5 sm:flex-row sm:gap-6">
                                            <div className="flex flex-1 flex-col gap-1">
                                                <label className="text-xs font-semibold text-black/70 sm:text-sm">Số điện thoại</label>
                                                <input
                                                    type="tel"
                                                    placeholder="Tối thiểu 10 chữ số"
                                                    className="border-b border-black/20 bg-transparent py-2 text-sm outline-none placeholder:text-black/30 focus:border-secondary"
                                                />
                                            </div>
                                            <div className="flex flex-1 flex-col gap-1">
                                                <label className="text-xs font-semibold text-black/70 sm:text-sm">Email</label>
                                                <input
                                                    type="email"
                                                    placeholder="vidu@mail.com"
                                                    className="border-b border-black/20 bg-transparent py-2 text-sm outline-none placeholder:text-black/30 focus:border-secondary"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-1">
                                            <label className="text-xs font-semibold text-black/70 sm:text-sm">Yêu cầu tư vấn</label>
                                            <input
                                                type="text"
                                                placeholder="Hãy để lại lời nhắn để tư vấn viên có thể hỗ trợ Quý khách"
                                                className="border-b border-black/20 bg-transparent py-2 text-sm outline-none placeholder:text-black/30 focus:border-secondary"
                                            />
                                        </div>

                                        <div className="flex justify-center pt-2">
                                            <button
                                                type="submit"
                                                className="rounded-xl bg-secondary px-10 py-3 text-sm font-semibold uppercase tracking-wider text-white transition-opacity hover:opacity-90 sm:text-base"
                                            >
                                                Đăng ký tư vấn
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
    )
}