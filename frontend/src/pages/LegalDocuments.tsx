import Header from '../components/Header'
import Footer from '../components/Footer'
import ScrollToTopButton from '../components/ScrollToTopButton'
import Seo from '../components/Seo'

interface LegalItem {
  doc: string
  date: string
  issuer: string
  desc: string
}

interface LegalSection {
  title: string
  items: LegalItem[]
}

const LEGAL_SECTIONS: LegalSection[] = [
  {
    title: '1. Quy hoạch & Phê duyệt dự án',
    items: [
      { doc: 'Quyết định số 3534/QĐ-UBND', date: '03/10/2017', issuer: 'Ủy ban nhân dân tỉnh Quảng Nam', desc: 'Phê duyệt Quy hoạch chi tiết xây dựng (tỷ lệ 1/500) Khu đô thị Cồn Tiến.' },
      { doc: 'Quyết định số 553/QĐ-UBND', date: '01/03/2019', issuer: 'Ủy ban nhân dân tỉnh Quảng Nam', desc: 'Phê duyệt điều chỉnh cục bộ và ban hành Quy định quản lý xây dựng theo đồ án điều chỉnh quy hoạch chi tiết (1/500).' },
      { doc: 'Quyết định số 2823/QĐ-UBND', date: '06/10/2021', issuer: 'Ủy ban nhân dân tỉnh Quảng Nam', desc: 'Phê duyệt điều chỉnh quy hoạch và ban hành Quy định quản lý theo đồ án điều chỉnh quy hoạch chi tiết (1/500).' },
      { doc: 'Quyết định số 2122/QĐ-UBND', date: '29/11/2024', issuer: 'Ủy ban nhân dân Thành phố Hội An', desc: 'Phê duyệt điều chỉnh cục bộ quy hoạch chi tiết xây dựng (1/500) Khu đô thị Cồn Tiến.' },
    ],
  },
  {
    title: '2. Chủ trương đầu tư',
    items: [
      { doc: 'Công văn số 4027/UBND-KTN', date: '23/07/2018', issuer: 'Ủy ban nhân dân tỉnh Quảng Nam', desc: 'Chấp thuận chủ trương đầu tư dự án.' },
      { doc: 'Công văn số 2322/UBND-KTN', date: '02/05/2019', issuer: 'Ủy ban nhân dân tỉnh Quảng Nam', desc: 'Điều chỉnh chấp thuận chủ trương đầu tư.' },
      { doc: 'Quyết định số 3700/QĐ-UBND', date: '17/12/2021', issuer: 'Ủy ban nhân dân tỉnh Quảng Nam', desc: 'Điều chỉnh chủ trương đầu tư (lần 2).' },
      { doc: 'Quyết định số 1137/QĐ-UBND', date: '13/05/2024', issuer: 'Ủy ban nhân dân tỉnh Quảng Nam', desc: 'Điều chỉnh chủ trương đầu tư (lần 3).' },
      { doc: 'Quyết định số 2536/QĐ-UBND', date: '24/10/2024', issuer: 'Ủy ban nhân dân tỉnh Quảng Nam', desc: 'Điều chỉnh chủ trương đầu tư (lần 4).' },
      { doc: 'Quyết định số 3124/QĐ-UBND', date: '24/12/2024', issuer: 'Ủy ban nhân dân tỉnh Quảng Nam', desc: 'Điều chỉnh chủ trương đầu tư (lần 5).' },
    ],
  },
  {
    title: '3. Quyết định giao đất & điều chỉnh sử dụng đất',
    items: [
      { doc: 'Quyết định số 2002/QĐ-UBND', date: '18/06/2019', issuer: 'Ủy ban nhân dân tỉnh Quảng Nam', desc: 'Thu hồi đất, giao đất (đợt 1).' },
      { doc: 'Quyết định số 4058/QĐ-UBND', date: '12/12/2019', issuer: 'Ủy ban nhân dân tỉnh Quảng Nam', desc: 'Thu hồi đất, giao đất (đợt 2).' },
      { doc: 'Quyết định số 796/QĐ-UBND', date: '28/03/2022', issuer: 'Ủy ban nhân dân tỉnh Quảng Nam', desc: 'Thu hồi, giao đất (đợt 3).' },
      { doc: 'Quyết định số 209/QĐ-UBND', date: '03/02/2023', issuer: 'Ủy ban nhân dân tỉnh Quảng Nam', desc: 'Thu hồi, giao đất (đợt 4).' },
      { doc: 'Quyết định số 3320/QĐ-UBND', date: '31/12/2024', issuer: 'Ủy ban nhân dân tỉnh Quảng Nam', desc: 'Thu hồi, giao đất (đợt 5 – hoàn tất).' },
      { doc: 'Quyết định số 59/QĐ-UBND', date: '07/01/2022', issuer: 'Ủy ban nhân dân tỉnh Quảng Nam', desc: 'Điều chỉnh cơ cấu sử dụng đất (đợt 1 & 2).' },
      { doc: 'Quyết định số 3319/QĐ-UBND', date: '31/12/2024', issuer: 'Ủy ban nhân dân tỉnh Quảng Nam', desc: 'Điều chỉnh cơ cấu sử dụng đất (đợt 3 & 4).' },
    ],
  },
  {
    title: '4. Nghiệm thu & điều kiện kinh doanh',
    items: [
      { doc: 'Thông báo số 13/TB-SXD', date: '05/03/2025', issuer: 'Sở Xây dựng tỉnh Quảng Nam', desc: 'Kết quả kiểm tra công tác nghiệm thu hoàn thành hạ tầng kỹ thuật dự án.' },
      { doc: 'Văn bản số 1674/SXD', date: '19/06/2025', issuer: 'Sở Xây dựng tỉnh Quảng Nam', desc: 'Xác nhận đủ điều kiện kinh doanh bất động sản hình thành trong tương lai.' },
      { doc: 'Phụ lục kèm theo văn bản số 1674/SXD', date: '19/06/2025', issuer: 'Sở Xây dựng tỉnh Quảng Nam', desc: 'Danh mục sản phẩm đủ điều kiện kinh doanh.' },
    ],
  },
  {
    title: '5. Thông tin pháp lý doanh nghiệp',
    items: [
      { doc: 'Giấy chứng nhận đăng ký doanh nghiệp (lần 7)', date: '26/08/2025', issuer: 'Sở Tài chính Thành phố Đà Nẵng', desc: 'Cấp cho đơn vị phát triển dự án.' },
    ],
  },
]

export default function LegalDocuments() {
  return (
    <div className="min-h-screen bg-warm">
      <Seo
        title="Văn bản pháp lý"
        description="Văn bản pháp lý dự án Khu đô thị Cồn Tiến – Hội An. Quy hoạch, chủ trương đầu tư, giao đất, nghiệm thu và điều kiện kinh doanh."
        url="/van-ban-phap-ly"
      />
      <Header />

      <main className="mx-auto max-w-4xl px-6 pt-28 pb-16 sm:px-10 sm:pt-32">
        <h1 className="font-sagire text-center text-4xl text-secondary sm:text-5xl">
          Văn bản pháp lý
        </h1>
        <p className="mt-2 text-sm text-center font-medium uppercase tracking-[0.15em] text-black/40">
          Khu đô thị Cồn Tiến – Hội An
        </p>

        <div className="mt-10 space-y-10">
          {LEGAL_SECTIONS.map((section) => (
            <section key={section.title}>
              <h2 className="text-lg md:text-xl 2xl:text-2xl font-bold text-primary">{section.title}</h2>
              <ul className="mt-4 space-y-4">
                {section.items.map((item) => (
                  <li key={item.doc + item.date} className="border-l-2 border-secondary/30 pl-4">
                    <p className="text-sm font-semibold text-primary">{item.doc}</p>
                    <p className="text-xs text-black/50">
                      {item.date} – {item.issuer}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-black/70">{item.desc}</p>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <a
            href="https://drive.google.com/drive/u/0/folders/1o4w-yDpXIIyn46WDIz1eE01uB4ltk7yH"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl bg-secondary px-8 py-3 text-sm font-semibold uppercase tracking-wider text-white transition-opacity hover:opacity-90"
          >
            Xem chi tiết
          </a>
        </div>
      </main>

      <ScrollToTopButton />
      <Footer contentMaxWidth="max-w-4xl" />
    </div>
  )
}
