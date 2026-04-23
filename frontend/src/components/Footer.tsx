import { useState, useEffect } from 'react'
import { MapPin, Phone } from 'lucide-react'
import { api } from '../services/api'
import type { FooterSection } from '../types/sections'

interface FooterProps {
  data?: FooterSection
  className?: string
}

export default function Footer({ data: propData, className }: FooterProps) {
  const [fetched, setFetched] = useState<FooterSection | null>(null)

  useEffect(() => {
    if (!propData) {
      api.getSection<FooterSection>('footer').then(setFetched).catch(() => {})
    }
  }, [propData])

  const data = propData ?? fetched
  if (!data) return null

  return (
    <div className={`relative overflow-hidden rounded-t-3xl bg-secondary ${className}`}>
      <img
        src="/bg-footer.png"
        alt=""
        loading="lazy"
        decoding="async"
        className="pointer-events-none absolute inset-0 scale-150 object-cover md:scale-140"
      />

      <div className="relative mx-auto max-w-9xl px-6 py-14 sm:px-10 sm:py-20 lg:px-20">
        <div className="flex flex-col-reverse gap-12 md:flex-row md:gap-16">
          {/* Left column — logo, info, socials */}
          <div className="md:w-[38%] md:shrink-0">
            <div className="items-center justify-center flex">
              <img
                src="/logo-footer.png"
                alt="Casamia Balanca Hoi An"
                loading="lazy"
                decoding="async"
                className="w-44 object-contain sm:w-52 2xl:w-64"
              />
            </div>

            <div className="mt-8 space-y-6 text-sm text-white/90 sm:text-base">
              <div>
                <h3 className="font-bold uppercase tracking-wider text-white text-center md:text-start">Văn phòng bán hàng</h3>
                <p className="mt-2 flex items-start text-balance gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{data.salesOfficeAddress}</span>
                </p>
                <p className="mt-1 flex items-center gap-2">
                  <Phone className="h-4 w-4 shrink-0" />
                  <span>{data.phone}</span>
                </p>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-xs font-bold uppercase tracking-wider text-white sm:text-sm text-center md:text-start">Cập nhật thông tin tại</p>
              <div className="mt-3 flex gap-3 justify-center md:justify-start">
                <a href={data.socialLinks.tiktok} className="rounded-xl flex h-10 w-10 items-center justify-center bg-white text-secondary transition-opacity hover:opacity-90">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.75a8.18 8.18 0 0 0 4.76 1.52V6.84a4.84 4.84 0 0 1-1-.15z" /></svg>
                </a>
                <a href={data.socialLinks.facebook} className="rounded-xl flex h-10 w-10 items-center justify-center bg-white text-secondary transition-opacity hover:opacity-90">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                </a>
                <a href={data.socialLinks.zalo} className="rounded-xl flex h-10 w-10 items-center justify-center bg-white text-secondary transition-opacity hover:opacity-90">
                  <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor"><title>Zalo</title><path d="M12.49 10.2722v-.4496h1.3467v6.3218h-.7704a.576.576 0 01-.5763-.5729l-.0006.0005a3.273 3.273 0 01-1.9372.6321c-1.8138 0-3.2844-1.4697-3.2844-3.2823 0-1.8125 1.4706-3.2822 3.2844-3.2822a3.273 3.273 0 011.9372.6321l.0006.0005zM6.9188 7.7896v.205c0 .3823-.051.6944-.2995 1.0605l-.03.0343c-.0542.0615-.1815.206-.2421.2843L2.024 14.8h4.8948v.7682a.5764.5764 0 01-.5767.5761H0v-.3622c0-.4436.1102-.6414.2495-.8476L4.8582 9.23H.1922V7.7896h6.7266zm8.5513 8.3548a.4805.4805 0 01-.4803-.4798v-7.875h1.4416v8.3548H15.47zM20.6934 9.6C22.52 9.6 24 11.0807 24 12.9044c0 1.8252-1.4801 3.306-3.3066 3.306-1.8264 0-3.3066-1.4808-3.3066-3.306 0-1.8237 1.4802-3.3044 3.3066-3.3044zm-10.1412 5.253c1.0675 0 1.9324-.8645 1.9324-1.9312 0-1.065-.865-1.9295-1.9324-1.9295s-1.9324.8644-1.9324 1.9295c0 1.0667.865 1.9312 1.9324 1.9312zm10.1412-.0033c1.0737 0 1.945-.8707 1.945-1.9453 0-1.073-.8713-1.9436-1.945-1.9436-1.0753 0-1.945.8706-1.945 1.9436 0 1.0746.8697 1.9453 1.945 1.9453z" /></svg>
                </a>
              </div>
            </div>

            <p className="mt-6 text-xs text-center md:text-start text-white/50">
              {data.copyright}
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

              <form className="mt-8 space-y-5" onSubmit={async (e) => {
                e.preventDefault()
                const form = e.currentTarget
                const formData = new FormData(form)
                const phoneVal = (formData.get('phone') as string).replace(/\s/g, '')
                const emailVal = (formData.get('email') as string).trim()

                if (!/^(0|\+84)\d{9,10}$/.test(phoneVal)) {
                  const phoneInput = form.querySelector<HTMLInputElement>('input[name="phone"]')
                  phoneInput?.setCustomValidity('Vui lòng nhập số điện thoại hợp lệ (VD: 0901234567)')
                  phoneInput?.reportValidity()
                  return
                }
                if (emailVal && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
                  const emailInput = form.querySelector<HTMLInputElement>('input[name="email"]')
                  emailInput?.setCustomValidity('Vui lòng nhập email hợp lệ (VD: vidu@mail.com)')
                  emailInput?.reportValidity()
                  return
                }

                try {
                  await api.submitContact({
                    name: formData.get('name') as string,
                    phone: phoneVal,
                    email: emailVal || undefined,
                    message: formData.get('message') as string,
                  })
                  form.reset()
                } catch { /* ignore */ }
              }}>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-black/70 sm:text-sm">Họ tên</label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Điền thông tin của bạn"
                    className="border-b border-black/20 bg-transparent py-2 text-sm outline-none placeholder:text-black/30 focus:border-secondary"
                  />
                </div>

                <div className="flex flex-col gap-5 sm:flex-row sm:gap-6">
                  <div className="flex flex-1 flex-col gap-1">
                    <label className="text-xs font-semibold text-black/70 sm:text-sm">Số điện thoại</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="Tối thiểu 10 chữ số"
                      onChange={(e) => e.target.setCustomValidity('')}
                      className="border-b border-black/20 bg-transparent py-2 text-sm outline-none placeholder:text-black/30 focus:border-secondary"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-1">
                    <label className="text-xs font-semibold text-black/70 sm:text-sm">Email</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="vidu@mail.com"
                      onChange={(e) => e.target.setCustomValidity('')}
                      className="border-b border-black/20 bg-transparent py-2 text-sm outline-none placeholder:text-black/30 focus:border-secondary"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-black/70 sm:text-sm">Yêu cầu tư vấn</label>
                  <input
                    type="text"
                    name="message"
                    placeholder="Hãy để lại lời nhắn để tư vấn viên có thể hỗ trợ Quý khách"
                    className="border-b border-black/20 bg-transparent py-2 text-sm outline-none placeholder:text-black/30 focus:border-secondary"
                  />
                </div>

                <div className="flex justify-center pt-2">
                  <button
                    type="submit"
                    className="rounded-xl cursor-pointer bg-secondary px-10 py-3 text-sm font-semibold uppercase tracking-wider text-white transition-opacity hover:opacity-90 sm:text-base"
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
  )
}
