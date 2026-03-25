import { useState } from 'react'
import { useLenis } from './hooks/useLenis'

const NAV_LEFT = ['Giới thiệu', 'Vị trí', 'Tiện ích']
const NAV_RIGHT = ['Sản phẩm', 'Giá trị', 'Liên hệ']
const NAV_LINK_CLASS =
  'relative text-sm font-medium tracking-widest text-[#0F4672] transition-colors hover:text-[#0F4672] after:absolute after:bottom-[-4px] after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 hover:after:scale-x-100'

function App() {
  useLenis()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-xs">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4 md:justify-center">
          {/* Mobile hamburger */}
          <button
            type="button"
            aria-label="Toggle menu"
            className="z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span
              className={`h-0.5 w-6 rounded bg-[#0F4672] transition-transform duration-300 ${menuOpen ? 'translate-y-2 rotate-45' : ''}`}
            />
            <span
              className={`h-0.5 w-6 rounded bg-[#0F4672] transition-opacity duration-300 ${menuOpen ? 'opacity-0' : ''}`}
            />
            <span
              className={`h-0.5 w-6 rounded bg-[#0F4672] transition-transform duration-300 ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`}
            />
          </button>

          <div className="hidden items-center gap-8 md:flex">
            {NAV_LEFT.map((item) => (
              <a key={item} href="#" className={NAV_LINK_CLASS}>
                {item}
              </a>
            ))}
          </div>

          <a href="#" className="block md:mx-10">
            <img
              src="/logo.png"
              alt="Casamia Balance Hoi An"
              className="h-10 w-auto object-contain sm:h-14"
            />
          </a>

          <div className="hidden items-center gap-8 md:flex">
            {NAV_RIGHT.map((item) => (
              <a key={item} href="#" className={NAV_LINK_CLASS}>
                {item}
              </a>
            ))}
          </div>

          {/* Spacer to balance hamburger on mobile */}
          <div className="w-10 md:hidden" />
        </nav>

        {/* Mobile menu overlay */}
        <div
          className={`fixed inset-0 z-40 flex flex-col items-center justify-center gap-6 bg-white/95 backdrop-blur-sm transition-all duration-300 md:hidden ${menuOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}
        >
          {[...NAV_LEFT, ...NAV_RIGHT].map((item) => (
            <a
              key={item}
              href="#"
              className="text-lg font-medium tracking-widest text-[#0F4672]"
              onClick={() => setMenuOpen(false)}
            >
              {item}
            </a>
          ))}
        </div>
      </header>

      {/* Hero */}
      <section className="relative flex h-screen items-center justify-center overflow-hidden rounded-b-4xl">
        <img
          src="/hero.gif"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10 px-4 text-center sm:px-6">
          <h1 className="leading-tight font-light text-white">
            <span className="-ml-6 flex items-center justify-center gap-3 sm:-ml-10 md:-ml-27">
              <span className="text-3xl font-alishanty md:text-7xl">Sống</span>
              <span className="text-2xl font-sagire md:text-5xl">đủ sâu</span>
            </span>
            <span className="ml-6 flex items-center justify-center gap-3 sm:ml-10 md:ml-29">
              <span className="text-3xl font-alishanty md:text-7xl">Giữ</span>
              <span className="text-2xl font-sagire md:text-5xl">đủ lâu</span>
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-white uppercase sm:mt-4 sm:text-md">
            Đâu là điều quý giá nhất đời người?
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-0 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center">
          <div className="h-[20vh] w-px bg-[#fff7e953] sm:h-[26vh]" />
          <img
            src="/scroll-down.png"
            alt="Scroll down"
            className="my-2 h-8 w-8 object-contain sm:h-10 sm:w-10"
          />
          <div className="h-6 w-px bg-[#fff7e953]" />
        </div>
      </section>

      {/* About */}
      <section id="about">
        <div className="relative overflow-hidden">
          <img
            src="/vector.png"
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute bottom-6 left-1/2 z-10 mx-auto w-full max-w-4xl -translate-x-1/2 px-4 text-center sm:bottom-12 md:bottom-24 sm:px-6">
            <div className="font-sagire flex items-center justify-center gap-3 font-light text-[#8B181B] ">
              <span className="text-2xl sm:text-3xl md:text-6xl">
                Là mỗi ngày sống
              </span>
              <span className="text-3xl sm:text-4xl md:text-7xl">Khoẻ</span>
            </div>
            <div className="mt-2 sm:mt-4" />
            <div className="font-sagire flex items-center justify-center gap-3 font-light text-[#8B181B] ">
              <span className="text-2xl sm:text-3xl md:text-6xl">
                Là nếp nhà sống
              </span>
              <span className="text-3xl sm:text-4xl md:text-7xl">An</span>
            </div>
          </div>
          <img
            src="/leaf.png"
            alt=""
            className="pointer-events-none absolute bottom-0 -right-20 hidden w-auto object-contain sm:-right-40 sm:block md:-right-110"
          />
        </div>

        {/* Video thumbnail */}
        <div className="group relative -top-4 mx-auto max-w-6xl overflow-hidden px-4 sm:-top-10 sm:px-6 lg:px-0">
          <div className="pointer-events-none absolute -top-7 left-[-12px] z-10 hidden h-14 w-14 rounded-full bg-white sm:block lg:-left-7" />
          <div className="pointer-events-none absolute -top-7 right-[-12px] z-10 hidden h-14 w-14 rounded-full bg-white sm:block lg:-right-7" />
          <div className="pointer-events-none absolute -bottom-7 left-[-12px] z-10 hidden h-14 w-14 rounded-full bg-white sm:block lg:-left-7" />
          <div className="pointer-events-none absolute -bottom-7 right-[-12px] z-10 hidden h-14 w-14 rounded-full bg-white sm:block lg:-right-7" />
          <div className="overflow-hidden rounded-lg sm:rounded-none">
            <img
              src="/img.png"
              alt=""
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
          </div>
          <img
            src="/play-icon.png"
            alt="Play"
            className="pointer-events-none absolute top-1/2 left-1/2 z-20 h-12 w-12 -translate-x-1/2 -translate-y-1/2 object-contain sm:h-14 sm:w-14 md:h-16 md:w-16"
          />
        </div>

        <div className="relative">
          <img
            src="/leaf.png"
            alt=""
            className="pointer-events-none absolute -top-10 -left-10 hidden w-auto object-contain sm:-top-45 sm:-left-20 sm:block z-10"
          />
          <img
            src="/rectangle-2.png"
            alt=""
            className="pointer-events-none absolute top-0 left-0 w-screen object-cover"
          />
          <div className="absolute top-30 left-0 z-20 flex w-screen flex-col items-center font-light text-[#8B181B]">
            <div className="flex justify-center gap-5">
              <span className="font-sagire text-2xl sm:text-3xl md:text-7xl">
                An tâm
              </span>
              <span className="font-alishanty text-3xl sm:text-4xl md:text-8xl">giữa thiên nhiên</span>
            </div>
            <div className="flex justify-center gap-5">
              <span className="font-sagire text-2xl sm:text-3xl md:text-7xl">
                An lành
              </span>
              <span className="font-alishanty text-3xl sm:text-4xl md:text-8xl">từng hơi thở</span>
            </div>
          </div>
          <img
            src="/3.png"
            alt=""
            className="mt-10 w-full object-contain sm:mt-14 md:mt-20 rounded-b-3xl"
          />
          {/* Stats card */}
          <div className="absolute bottom-0 left-1/2 mb-10 w-full max-w-6xl -translate-x-1/2 rounded-2xl bg-[#FFFFFFCC] py-8 pr-3 backdrop-blur-xs sm:py-5 sm:pr-7">
            <p className="mx-auto max-w-3xl text-center text-sm font-medium leading-relaxed text-black sm:text-base">
              Địa thế đắc địa hiếm có, Casamia Balanca là nơi mỗi ngày cư dân sống an,
            </p>
            <p className="mx-auto max-w-3xl text-center text-sm font-medium leading-relaxed text-black sm:text-base">
              sống khỏe cùng hệ sinh thái sống - rừng dừa - biển duy nhất tại Hội An.
            </p>
            <div className="mt-3 grid grid-cols-2 gap-6 sm:mt-5 sm:grid-cols-3 md:grid-cols-6 md:gap-0">
              {[
                { label: 'Tổng\nquy mô', value: '31,1 ha' },
                { label: 'Rừng dừa nước\ntự nhiên', value: '3,6 ha' },
                { label: 'Diện tích mặt nước\ntự nhiên', value: '80%' },
                { label: 'Mật độ\nxây dựng', value: '23,1%' },
                { label: 'Diện tích dành cho\ncây xanh & mặt nước', value: '1/3' },
                { label: 'Diện tích đất\nthương mại, dịch vụ', value: '9%' },
              ].map((stat, i) => (
                <div
                  key={stat.value}
                  className={`text-center px-4${i > 0 ? ' md:border-l md:border-black/20' : ''}`}
                >
                  <p className="whitespace-pre-line text-sm leading-snug font-medium text-[#8B181B] sm:text-base">
                    {stat.label}
                  </p>
                  <p className="mt-2 font-sagire text-3xl text-[#8B181B] sm:text-3xl md:text-4xl">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="map">
        <div className="relative">
          <img
            src="/map-balanca.svg"
            alt=""
            className="w-full object-contain rounded-3xl"
          />
          <div className="group/pin absolute left-[39.8%] top-[59%] w-[8%] -translate-x-1/2 -translate-y-1/2">
            <img 
              src="/balanca-sign.png"
              alt=""
              className="peer/pin relative z-40 w-full object-contain hover:scale-120 transition-[scale] duration-500"
            />
            <span className="peer/inner absolute left-1/2 top-[150%] z-30 -translate-x-1/2 -translate-y-1/2 w-[380%] aspect-square rounded-full border border-dashed border-secondary transition-[scale] duration-600 hover:scale-105 peer-hover/pin:scale-105" />
            <span className="peer/middle absolute left-1/2 top-[150%] z-20 -translate-x-1/2 -translate-y-1/2 w-[610%] aspect-square rounded-full border border-dashed border-secondary/40 transition-[scale] duration-600 hover:scale-105 peer-hover/inner:scale-105 peer-hover/pin:scale-105" />
            <span className="absolute left-1/2 top-[150%] z-10 -translate-x-1/2 -translate-y-1/2 w-[850%] aspect-square rounded-full border border-dashed border-secondary/20 transition-[scale] duration-600 hover:scale-105 peer-hover/inner:scale-105 peer-hover/middle:scale-105 peer-hover/pin:scale-105" />
          </div>
          <div className="absolute inset-x-0 top-[10%] z-20 px-4 sm:top-[14%] sm:px-6 md:top-[18%] lg:top-[20%]">
            <div className="mx-auto max-w-6xl">
              <div className="w-full md:w-auto md:pl-[23%]">
                <div className="flex flex-col items-center text-center text-secondary md:items-end md:text-right">
                  <h1 className="font-sagire leading-[1.05] text-2xl sm:text-3xl md:text-4xl 2xl:text-5xl">
                    Đô thị sinh thái hiếm hoi
                  </h1>
                  <span className="mt-2 font-inter font-normal uppercase text-2xl sm:text-3xl md:text-7xl">
                    Nằm trong lõi di sản hội an
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="residences" className="bg-white px-4 py-16 sm:px-6 sm:py-24 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center sm:mb-16">
            <p className="mb-3 text-xs tracking-[0.3em] text-secondary uppercase sm:mb-4 sm:text-sm">
              Residences
            </p>
            <h2 className="font-serif text-2xl font-light text-white sm:text-3xl md:text-5xl">
              Thoughtfully Designed Spaces
            </h2>
          </div>
          <div className="grid gap-4 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'Heritage Villas',
                desc: 'Inspired by traditional Hoi An architecture with modern comforts and private gardens.',
              },
              {
                title: 'Riverside Apartments',
                desc: 'Contemporary living spaces with panoramic views of the Thu Bon River.',
              },
              {
                title: 'Garden Townhouses',
                desc: 'Family-oriented homes surrounded by lush tropical landscaping.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="border border-white/10 p-6 transition-colors hover:border-secondary/50 sm:p-8"
              >
                <h3 className="mb-3 font-serif text-lg text-white sm:mb-4 sm:text-xl">{item.title}</h3>
                <p className="text-sm leading-relaxed text-white/60 sm:text-base">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="bg-warm px-4 py-16 sm:px-6 sm:py-24 md:py-32">
        <div className="mx-auto max-w-xl text-center">
          <p className="mb-3 text-xs tracking-[0.3em] text-secondary uppercase sm:mb-4 sm:text-sm">
            Get in Touch
          </p>
          <h2 className="font-serif text-2xl font-light text-primary sm:text-3xl md:text-5xl">
            Begin Your Journey
          </h2>
          <p className="mt-4 text-sm text-primary/70 sm:mt-6 sm:text-base">
            Register your interest to receive exclusive updates about Casamia Balance Hoi An.
          </p>
          <a
            href="mailto:info@casamiabalance.vn"
            className="mt-6 inline-block bg-primary px-8 py-3.5 text-xs tracking-widest text-white uppercase transition-opacity hover:opacity-90 sm:mt-8 sm:px-10 sm:py-4 sm:text-sm"
          >
            Contact Us
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark px-4 py-10 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-6xl text-center">
          <p className="font-serif text-base text-white/80 sm:text-lg">Casamia Balance Hoi An</p>
          <p className="mt-2 text-xs text-white/40 sm:text-sm">
            &copy; {new Date().getFullYear()} Casamia Balance. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
