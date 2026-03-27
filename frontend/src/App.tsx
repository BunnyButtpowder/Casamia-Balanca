import { useState } from 'react'
import { useLenis } from './hooks/useLenis'
import { MapPin, ChevronLeft, ChevronRight } from 'lucide-react'

const NAV_LEFT = ['Giới thiệu', 'Vị trí', 'Tiện ích']
const NAV_RIGHT = ['Sản phẩm', 'Giá trị', 'Liên hệ']
const NAV_LINK_CLASS =
  'relative text-sm uppercase font-semibold tracking-widest text-[#0F4672] transition-colors hover:text-[#0F4672] after:absolute after:bottom-[-4px] after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 hover:after:scale-x-100'

function App() {
  useLenis()
  const [menuOpen, setMenuOpen] = useState(false)
  const [carouselCat, setCarouselCat] = useState('all')

  const allSlides = [
    {
      src: '/carousel-1.png',
      title: 'Công viên chủ đề và các tuyến phố cây xanh',
      desc: 'Hệ thống cây xanh, mặt nước được kết nối, xếp lớp  tạo nên lá phổi xanh, đảm bảo chất lượng không khí thuần khiết cho khu đô thị.',
      cat: 'landscape',
    },
    {
      src: '/carousel-2.jpg',
      title: 'Tiện ích sống chăm sóc sức khoẻ hàng ngày',
      desc: 'Hồ bơi tràn viền hướng biển, mang đến trải nghiệm nghỉ dưỡng đẳng cấp quốc tế.',
      cat: 'service',
    },
    {
      src: '/carousel-3.jpg',
      title: 'Tiện ích nghỉ dưỡng chuyên sâu',
      desc: 'Không gian giải trí thượng lưu với tầm nhìn toàn cảnh sông nước và hoàng hôn.',
      cat: 'service',
    },
  ]

  const carouselSlides = carouselCat === 'all' ? allSlides : allSlides.filter((s) => s.cat === carouselCat)

  const [slideIdx, setSlideIdx] = useState(1)
  const [animate, setAnimate] = useState(true)

  // Exterior carousel
  const exteriorImages = [
    '/carousel-1.png',
    '/carousel-2.jpg',
    '/carousel-3.jpg',
  ]
  const [extIdx, setExtIdx] = useState(0)
  const extMax = exteriorImages.length - 1
  const extPrev = () => setExtIdx((i) => Math.max(0, i - 1))
  const extNext = () => setExtIdx((i) => Math.min(extMax, i + 1))

  const handleCatChange = (cat: string) => {
    setCarouselCat(cat)
    setAnimate(false)
    setSlideIdx(1)
  }

  const extendedSlides = [
    carouselSlides[carouselSlides.length - 1],
    ...carouselSlides,
    carouselSlides[0],
  ]

  const prevSlide = () => { setAnimate(true); setSlideIdx((i) => i - 1) }
  const nextSlide = () => { setAnimate(true); setSlideIdx((i) => i + 1) }

  const handleCarouselTransitionEnd = () => {
    if (slideIdx === 0) {
      setAnimate(false)
      setSlideIdx(carouselSlides.length)
    } else if (slideIdx === extendedSlides.length - 1) {
      setAnimate(false)
      setSlideIdx(1)
    }
  }

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
            <div className="font-sagire flex items-center justify-center gap-3 font-light text-secondary ">
              <span className="text-2xl sm:text-3xl md:text-6xl">
                Là mỗi ngày sống
              </span>
              <span className="text-3xl sm:text-4xl md:text-7xl">Khoẻ</span>
            </div>
            <div className="mt-2 sm:mt-4" />
            <div className="font-sagire flex items-center justify-center gap-3 font-light text-secondary ">
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
            src="/gradient-from-t.png"
            alt=""
            className="pointer-events-none absolute top-0 left-0 w-screen object-cover"
          />
          <div className="absolute top-30 left-0 z-20 flex w-screen flex-col items-center font-light text-secondary">
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
                  <p className="whitespace-pre-line text-sm leading-snug font-medium text-secondary sm:text-base">
                    {stat.label}
                  </p>
                  <p className="mt-2 font-sagire text-3xl text-secondary sm:text-3xl md:text-4xl">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="map" className="relative z-0">
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
          <div className="pointer-events-none absolute inset-x-0 top-[10%] z-20 px-4 sm:top-[14%] sm:px-6 md:top-[18%] lg:top-[20%]">
            <div className="mx-auto max-w-6xl md:max-w-6xl 2xl:max-w-7xl">
              <div className="w-full md:w-auto md:pl-[23%] xl:pl-[40%]">
                <div className="flex flex-col items-center text-center md:items-end md:text-right">
                  <h1 className="font-sagire leading-[1.05] text-2xl sm:text-3xl md:text-5xl text-secondary">
                    Đô thị sinh thái hiếm hoi
                  </h1>
                  <span className="mt-2 font-inter font-medium uppercase text-2xl sm:text-lg md:text-xl text-secondary">
                    Nằm trong lõi di sản hội an
                  </span>
                  <div className="mt-10 text-sm sm:text-base md:text-lg font-medium text-justify text-black max-w-md">Dự án nằm liền kề rừng dừa Bảy Mẫu 200 năm tuổi, trong vùng đệm của khu dự trữ sinh quyển thế giới Cù Lao Chàm - Hội An, nơi hội thủy của ba dòng sông lớn: Thu Bồn, Cổ Cò, Trường Giang.</div>
                  <div className="pointer-events-auto mt-6 w-full max-w-md overflow-y-auto max-h-60 location-scrollbar" data-lenis-prevent>
                    {[
                      { name: 'Rừng dừa Bảy Mẫu', time: '1 - 2 phút' },
                      { name: 'Biển Cửa Đại / Cầu Cửa Đại', time: '5 phút' },
                      { name: 'Bãi biển An Bàng', time: '5 - 7 phút' },
                      { name: 'Phố cổ Hội An', time: '5 - 10 phút' },
                      { name: 'Sân bay quốc tế', time: '30 - 40 phút' },
                      { name: 'Bãi biển An Bàng', time: '5 - 7 phút' },
                      { name: 'Rừng dừa Bảy Mẫu', time: '1 - 2 phút' },
                      { name: 'Phố cổ Hội An', time: '5 - 10 phút' },
                    ].map((item, i, arr) => (
                      <div
                        key={`${item.name}-${i}`}
                        className={`location-item group flex items-center gap-3 px-4 py-3 cursor-default ${i < arr.length - 1 ? 'border-b border-gray-300' : ''}`}
                      >
                        <MapPin className="w-4 h-4 shrink-0 text-[#0F4672] group-hover:text-secondary transition-colors duration-300" />
                        <span className="flex-1 text-sm text-start font-medium text-black group-hover:text-secondary group-hover:translate-x-1.5 transition-all duration-300">{item.name}</span>
                        <span className="text-sm font-semibold text-black group-hover:text-secondary transition-colors duration-300 whitespace-nowrap">{item.time}</span>
                      </div>
                    ))}
                  </div>
                  <button className="pointer-events-auto btn-inverted-corners mt-4 bg-secondary px-5 py-4 text-sm font-semibold uppercase tracking-wider text-white transition-opacity hover:opacity-90 cursor-pointer">
                    Tải tài liệu dự án
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features — overlaps bottom of map */}
      <section
        id="features"
        className="relative z-10 rounded-t-3xl bg-white py-8"
      >
        <div className="mx-auto">
          <div className="mx-auto max-w-7xl 2xl:max-w-max flex flex-col gap-8 rounded-2xl px-6 py-10 sm:px-10 sm:py-12 md:flex-row md:items-center md:gap-12 lg:px-14">
            <p className="max-w-sm text-sm text-justify leading-relaxed text-black font-medium md:shrink-0 md:text-base">
              Hệ thống cây xanh, mặt nước được kết nối, xếp lớp&nbsp;&nbsp;tạo nên la phổi xanh, đảm bảo chất lượng không khí thuần khiết cho khu đô thị, đồng thời xây dựng di sản sống xanh cho thế hệ tương lai.
            </p>
            <div className="grid flex-1 grid-cols-3 gap-6 sm:grid-cols-5 md:gap-0">
              {[
                { value: '08', label: 'Ha\ncây xanh' },
                { value: '05', label: 'Công viên\nchủ đề' },
                { value: '19', label: 'Trụ hoa giấy\nkỷ lục' },
                { value: '25 m', label: 'Hệ thống\nkênh nội khu' },
                { value: '70 m', label: 'Đường kính\nhồ trung tâm' },
              ].map((stat, i) => (
                <div
                  key={stat.value}
                  className={`text-start px-5 ${i > 0 ? ' md:border-l md:border-black/20' : ''}`}
                >
                  <p className="font-sagire text-3xl text-secondary md:text-4xl">
                    {stat.value}
                  </p>
                  <p className="mt-2 whitespace-pre-line text-sm leading-snug font-medium text-[#0F4672] sm:text-base 2xl:text-lg">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="overflow-hidden">
              <div
                className={`flex ${animate ? 'transition-transform duration-700 ease-in-out' : ''}`}
                style={{ transform: `translateX(calc(17.5% - ${slideIdx * 65}% - ${slideIdx * 12}px))` }}
                onTransitionEnd={handleCarouselTransitionEnd}
              >
                {extendedSlides.map((slide, i) => (
                  <div
                    key={`${slide.src}-${i}`}
                    className={`w-[65%] shrink-0 px-1.5 ${animate ? 'transition-opacity duration-700' : ''}`}
                  >
                    <div className="inverted-corners-lg relative overflow-hidden">
                      <img
                        src={slide.src}
                        alt={slide.title}
                        className="aspect-video w-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/30 via-black/30 to-transparent backdrop-blur-[2px] px-6 pb-6 sm:px-10 sm:pb-8">
                        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between">
                          <h3 className="font-sagire text-xl text-balance text-white sm:text-2xl md:text-3xl">
                            {slide.title}
                          </h3>
                          <p className="max-w-md text-sm text-justify text-white/80 sm:text-base 2xl:max-w-2xl">
                            {slide.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={prevSlide}
              aria-label="Previous slide"
              className="btn-inverted-corners absolute left-[2%] top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center bg-white text-secondary transition-colors duration-500 hover:bg-secondary hover:text-white cursor-pointer sm:h-12 sm:w-12"
            >
              <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next slide"
              className="btn-inverted-corners absolute right-[2%] top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center bg-white text-secondary transition-colors duration-500 hover:bg-secondary hover:text-white cursor-pointer sm:h-12 sm:w-12"
            >
              <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          </div>
          <div className="mt-10">
            <div className="relative flex justify-center">
              <div className="pointer-events-none absolute bottom-0 h-px w-[80%] bg-black/10" />
              <div className="relative z-10 flex items-center gap-8 sm:gap-12">
                {[
                  { key: 'all', label: 'Tất cả' },
                  { key: 'landscape', label: 'Tiện ích cảnh quan' },
                  { key: 'service', label: 'Tiện ích dịch vụ' },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => handleCatChange(tab.key)}
                    className={`relative cursor-pointer pb-1 text-sm font-semibold tracking-widest transition-colors duration-300 sm:text-sm 2xl:text-base uppercase ${carouselCat === tab.key
                      ? 'text-secondary after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-secondary'
                      : 'text-[#0F4672] after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 hover:after:scale-x-100'
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Exterior */}
      <section id="exterior" className="relative py-16">
        <img
          src="/gradient-from-t.png"
          alt=""
          className="pointer-events-none absolute top-0 left-0 w-screen object-cover z-10"
        />
        <div className="relative">
          <img
            src="/leaf.png"
            alt=""
            className="pointer-events-none absolute -top-30 -right-70 hidden w-auto object-contain sm:block z-20"
          />

          <div className="absolute top-18 left-0 z-20 flex w-screen flex-col items-center font-light text-secondary">
            <div className="flex justify-center gap-5">
              <span className="font-sagire text-2xl sm:text-3xl md:text-7xl">
                An nhàn
              </span>
              <span className="font-alishanty text-3xl sm:text-4xl md:text-8xl">khai thác</span>
            </div>
            <div className="flex justify-center gap-5">
              <span className="font-sagire text-2xl sm:text-3xl md:text-7xl">
                An tâm
              </span>
              <span className="font-alishanty text-3xl sm:text-4xl md:text-8xl">sinh lời</span>
            </div>
          </div>
          <img
            src="/exterior.jpg"
            alt=""
            className="mt-10 w-full object-contain sm:mt-14 md:mt-20 rounded-b-3xl"
          />
          <div className="absolute bottom-0 left-1/2 mb-10 w-full max-w-6xl -translate-x-1/2 py-8 pr-3 sm:py-5 sm:pr-7">
            <p className="mx-auto max-w-xl text-center text-sm font-medium leading-relaxed text-white sm:text-base 2xl:text-lg">
              Kiến trúc của dự án là sự tiếp nối tinh tế của di sản kiến trúc Hội An với nếp nhà của những mái ngói nâu xếp lớp, vật liệu đá sa thạch từ Thánh địa Mỹ Sơn. 100% biệt thự thiết kế mở, thông tầng và hệ cửa kính lớn để đón trọn ánh sáng tự nhiên và gió trời.
            </p>
          </div>
        </div>
        <div className="relative min-h-[700px] sm:min-h-[800px] md:min-h-[900px]">
          <img
            src="/bg-pattern.png"
            alt=""
            className="pointer-events-none object-cover sm:block "
          />
          {/* Overlay: title + description + award | carousel */}
          <div className="absolute inset-0 z-10 flex items-center">
            <div className="mx-auto flex w-full h-full flex-col gap-8 py-20 pl-6 pr-0 md:flex-row md:items-stretch md:gap-10 lg:pl-14">
              {/* Left column */}
              <div className="flex flex-col justify-center md:shrink-0">
                <h2 className="font-sagire text-3xl leading-tight text-secondary sm:text-4xl md:text-5xl">
                  Kiệt tác xanh
                </h2>
                <p className="font-alishanty text-4xl text-secondary sm:text-5xl md:text-6xl">
                  “<span className="text-5xl sm:text-6xl md:text-8xl">3</span> trong <span className="text-5xl sm:text-6xl md:text-8xl">1</span>”
                </p>
                <span className="mt-1 text-xs font-semibold uppercase tracking-widest text-secondary sm:text-sm">
                  Thiết kế bởi KTS Võ Trọng Nghĩa
                </span>
                <p className="mt-5 max-w-sm text-sm leading-relaxed font-medium text-justify text-black sm:text-base">
                  Mỗi nếp nhà là một sắc xanh, toàn khu đô thị là một khu vườn xanh mang nét đẹp hoài cổ và bình tâm của phố Hội. Lối kiến trúc giao thoa giữa bảo tồn di sản và tư duy xanh hiện đại mang đến dòng sản phẩm biệt thự đẹp bất biến với thời gian, công năng linh hoạt, vừa phù hợp với hoạt động nghỉ dưỡng, vừa phù hợp với nhu cầu cho thuê, khai thác, vận hành du lịch.
                </p>
                <div className='flex justify-center'>
                  <img
                    src="/award.png"
                    alt="Asia Property Awards 2021"
                    className="mt-6 w-28 object-contain sm:w-52"
                  />
                </div>

              </div>

              {/* Right column — carousel, touches right edge */}
              <div className="relative min-h-0 flex-1 pr-6 md:pr-0">
                <div className="h-full overflow-hidden">
                  <div
                    className="flex h-full gap-3 transition-transform duration-500 ease-in-out"
                    style={{
                      transform: extIdx === extMax
                        ? 'translateX(calc(-100% + 60%))'
                        : `translateX(calc(-${extIdx * 60}% - ${extIdx * 12}px))`,
                    }}
                  >
                    {exteriorImages.map((src) => (
                      <div
                        key={src}
                        className="h-full w-[60%] shrink-0"
                      >
                        <div className="inverted-corners-lg h-full overflow-hidden">
                          <img
                            src={src}
                            alt=""
                            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  onClick={extPrev}
                  aria-label="Previous"
                  className="btn-inverted-corners absolute -left-6 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center bg-secondary text-white transition-colors duration-300 hover:bg-secondary/90 hover:text-white cursor-pointer sm:h-12 sm:w-12"
                >
                  <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
                <button
                  onClick={extNext}
                  aria-label="Next"
                  className="btn-inverted-corners absolute right-30 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center bg-secondary text-white transition-colors duration-300 hover:bg-secondary/90 hover:text-white cursor-pointer sm:h-12 sm:w-12"
                >
                  <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </div>
            </div>
          </div>
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
