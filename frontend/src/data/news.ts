export type NewsCategory = 'du-an' | 'su-kien'

export interface NewsArticle {
  slug: string
  title: string
  date: string
  image: string
  category: NewsCategory
  content: string[]
}

export const NEWS_CATEGORIES = [
  { value: 'all', label: 'Tất cả' },
  { value: 'du-an', label: 'Thông tin dự án' },
  { value: 'su-kien', label: 'Sự kiện' },
] as const

export const NEWS_ARTICLES: NewsArticle[] = [
  {
    slug: 'bo-ra-8-ty-mua-villa-casamia-hoi-an',
    title: 'Bỏ ra 8 tỷ mua Villa Casamia Hội An: Liệu có đáng?',
    date: '20.10',
    image: '/center-square.jpg',
    category: 'du-an',
    content: [
      'Villa Casamia Hội An đã và đang thu hút sự chú ý lớn trong giới đầu tư bất động sản nghỉ dưỡng. Với mức giá khoảng 8 tỷ đồng cho một căn villa, nhiều người đặt câu hỏi: "Liệu có đáng để đầu tư?" Hãy cùng phân tích chi tiết để trả lời câu hỏi này.',
      'ĐẦU TƯ 8 TỶ VÀO VILLA CASAMIA HỘI AN: LIỆU CÓ ĐÁNG KHÔNG?',
      'Casamia Hội An tọa lạc tại vị trí đắc địa bên bờ sông Thu Bồn, cách phố cổ Hội An chỉ vài phút di chuyển. Dự án được phát triển bởi chủ đầu tư uy tín với tầm nhìn kiến tạo một khu đô thị sinh thái đẳng cấp, hài hòa giữa thiên nhiên và cuộc sống hiện đại.',
      'Với thiết kế kiến trúc Đông Dương tinh tế, mỗi căn villa tại Casamia Balanca được chăm chút tỉ mỉ từng chi tiết. Không gian sống mở, tận dụng tối đa ánh sáng tự nhiên và gió trời, mang đến cảm giác thư thái và gần gũi với thiên nhiên.',
      'ĐẦU TƯ 8 TỶ VÀO VILLA CASAMIA HỘI AN: LIỆU CÓ ĐÁNG KHÔNG?',
      'Về tiềm năng sinh lời, Hội An là một trong những điểm đến du lịch hàng đầu Việt Nam và khu vực. Lượng khách quốc tế đến Hội An tăng trưởng đều đặn qua các năm, tạo ra nhu cầu lớn về lưu trú nghỉ dưỡng cao cấp. Villa Casamia với vị trí đắc địa và tiện ích đồng bộ hoàn toàn có thể khai thác cho thuê với mức lợi nhuận hấp dẫn.',
      'Ngoài giá trị đầu tư, villa Casamia còn là nơi an cư lý tưởng cho gia đình. Hệ thống tiện ích nội khu đa dạng bao gồm hồ bơi, công viên, khu vui chơi trẻ em, nhà hàng, và nhiều dịch vụ cao cấp khác. Cộng đồng cư dân văn minh, an ninh 24/7 đảm bảo cuộc sống an toàn và tiện nghi.',
    ],
  },
  {
    slug: 'casamia-balanca-mo-vang-hay-vung-lay',
    title: 'Casamia Balanca Hội An: "Mỏ Vàng" Hay "Vũng Lầy" Rủi Ro?',
    date: '20.10',
    image: '/infi-pool.jpg',
    category: 'du-an',
    content: [
      'Casamia Balanca Hội An đang là tâm điểm bàn luận trong giới đầu tư bất động sản. Với vị trí đắc địa bên bờ sông Thu Bồn và thiết kế kiến trúc Đông Dương độc đáo, dự án hứa hẹn mang đến cơ hội đầu tư hấp dẫn.',
      'CASAMIA BALANCA: CƠ HỘI HAY RỦI RO?',
      'Thị trường bất động sản nghỉ dưỡng Hội An đang trong giai đoạn phát triển mạnh mẽ. Với lượng khách du lịch quốc tế ngày càng tăng, nhu cầu lưu trú cao cấp luôn ở mức cao. Casamia Balanca với định vị phân khúc cao cấp hoàn toàn có thể tận dụng xu hướng này.',
      'Tuy nhiên, như mọi khoản đầu tư, cần cân nhắc kỹ lưỡng các yếu tố rủi ro. Thị trường bất động sản nghỉ dưỡng có tính chu kỳ, phụ thuộc vào tình hình kinh tế vĩ mô và ngành du lịch. Nhà đầu tư cần có tầm nhìn dài hạn và khả năng tài chính vững vàng.',
      'VÌ SAO CASAMIA BALANCA LÀ "MỎ VÀNG"?',
      'Với hạ tầng giao thông ngày càng hoàn thiện, sân bay Chu Lai mở rộng, và các tuyến cao tốc kết nối, Hội An đang trở thành điểm đến dễ tiếp cận hơn bao giờ hết. Điều này trực tiếp thúc đẩy giá trị bất động sản trong khu vực.',
      'Casamia Balanca với quy hoạch bài bản, pháp lý minh bạch, và tiện ích đồng bộ đang là một trong những dự án đáng cân nhắc nhất tại Hội An thời điểm hiện tại.',
    ],
  },
  {
    slug: 'dung-mua-casamia-hoi-an-neu-chua-doc',
    title: 'Đừng Mua Casamia Hội An Nếu Chưa Đọc Điều Này: Lợi Nhuận Thật Sự?',
    date: '20.10',
    image: '/bar.jpg',
    category: 'du-an',
    content: [
      'Trước khi quyết định đầu tư vào Casamia Hội An, có những thông tin quan trọng mà bạn cần nắm rõ. Bài viết này sẽ phân tích chi tiết về lợi nhuận thực tế mà dự án có thể mang lại.',
      'LỢI NHUẬN TỪ CHO THUÊ VILLA',
      'Theo khảo sát thị trường, các villa nghỉ dưỡng cao cấp tại Hội An có thể cho thuê với mức giá từ 5-15 triệu đồng/đêm tùy theo mùa và loại hình. Với tỷ lệ lấp đầy trung bình 60-70%, lợi nhuận cho thuê hàng năm có thể đạt 8-12% giá trị đầu tư.',
      'Ngoài lợi nhuận cho thuê, giá trị bất động sản tại Hội An có xu hướng tăng đều qua các năm. Trong 5 năm qua, giá đất tại khu vực này đã tăng trung bình 15-20% mỗi năm, cho thấy tiềm năng tăng giá vốn đáng kể.',
      'NHỮNG ĐIỀU CẦN LƯU Ý',
      'Chi phí vận hành và bảo trì villa là yếu tố cần tính toán kỹ. Bao gồm phí quản lý, bảo trì, thuế, và các chi phí phát sinh khác. Nhà đầu tư nên làm việc với đơn vị quản lý chuyên nghiệp để tối ưu hóa lợi nhuận.',
      'Tóm lại, Casamia Hội An là một kênh đầu tư tiềm năng với lợi nhuận hấp dẫn, nhưng cần được phân tích kỹ lưỡng dựa trên tình hình tài chính cá nhân và mục tiêu đầu tư dài hạn.',
    ],
  },
  {
    slug: 'casamia-balanca-to-chuc-le-dong-tho',
    title: 'Casamia Balanca Hội An: Tổ Chức Lễ Động Thổ Giai Đoạn 2',
    date: '15.09',
    image: '/carousel-5.png',
    category: 'su-kien',
    content: [
      'Ngày 15/09, Casamia Balanca Hội An chính thức tổ chức lễ động thổ giai đoạn 2, đánh dấu bước phát triển mới của dự án khu đô thị sinh thái ven sông Thu Bồn.',
      'LỄ ĐỘNG THỔ GIAI ĐOẠN 2',
      'Sự kiện thu hút sự tham gia của hơn 500 khách mời, bao gồm đại diện chính quyền địa phương, đối tác chiến lược, và các nhà đầu tư quan tâm đến dự án.',
      'Giai đoạn 2 của dự án sẽ phát triển thêm 120 căn biệt thự với thiết kế đa dạng, đáp ứng nhu cầu của nhiều phân khúc khách hàng khác nhau.',
    ],
  },
  {
    slug: 'bo-ra-8-ty-mua-villa-casamia-hoi-an-phan-2',
    title: 'Bỏ ra 8 tỷ mua Villa Casamia Hội An: Liệu có đáng? (Phần 2)',
    date: '18.10',
    image: '/exterior.jpg',
    category: 'du-an',
    content: [
      'Tiếp nối phần 1, bài viết này sẽ đi sâu phân tích các yếu tố pháp lý và tài chính khi đầu tư vào Villa Casamia Hội An.',
      'PHÁP LÝ MINH BẠCH',
      'Dự án Casamia Balanca được cấp giấy chứng nhận quyền sử dụng đất lâu dài, đảm bảo quyền lợi cho nhà đầu tư. Hồ sơ pháp lý đầy đủ và minh bạch, được thẩm định bởi các đơn vị tư vấn uy tín.',
      'Nhà đầu tư hoàn toàn yên tâm về tính pháp lý khi sở hữu biệt thự tại Casamia Balanca Hội An.',
    ],
  },
  {
    slug: 'casamia-balanca-mo-vang-hay-vung-lay-phan-2',
    title: 'Casamia Balanca Hội An: "Mỏ Vàng" Hay "Vũng Lầy" Rủi Ro? (Phần 2)',
    date: '22.10',
    image: '/center-square.jpg',
    category: 'du-an',
    content: [
      'Phần 2 của loạt bài phân tích chuyên sâu về tiềm năng đầu tư tại Casamia Balanca Hội An.',
      'PHÂN TÍCH THỊ TRƯỜNG',
      'Thị trường bất động sản nghỉ dưỡng miền Trung đang trải qua giai đoạn tăng trưởng mạnh mẽ nhờ sự phát triển của hạ tầng giao thông và du lịch.',
      'Casamia Balanca với lợi thế vị trí và thiết kế độc đáo đang dần khẳng định vị thế trên thị trường.',
    ],
  },
  {
    slug: 'su-kien-mo-ban-giai-doan-moi',
    title: 'Sự Kiện Mở Bán Giai Đoạn Mới Casamia Balanca',
    date: '05.11',
    image: '/infi-pool.jpg',
    category: 'su-kien',
    content: [
      'Casamia Balanca Hội An chính thức mở bán giai đoạn mới với nhiều ưu đãi hấp dẫn dành cho nhà đầu tư.',
      'ƯU ĐÃI ĐẶC BIỆT',
      'Khách hàng đặt mua trong giai đoạn này sẽ được hưởng chiết khấu lên đến 5% giá trị căn hộ, cùng nhiều phần quà giá trị.',
      'Sự kiện diễn ra từ ngày 05/11 đến 30/11 tại văn phòng bán hàng dự án.',
    ],
  },
  {
    slug: 'dung-mua-casamia-hoi-an-phan-2',
    title: 'Đừng Mua Casamia Hội An Nếu Chưa Đọc Điều Này (Phần 2)',
    date: '25.10',
    image: '/bar.jpg',
    category: 'du-an',
    content: [
      'Tiếp nối phần 1, bài viết phân tích thêm về các yếu tố cần cân nhắc trước khi đầu tư.',
      'CHI PHÍ ẨN CẦN BIẾT',
      'Ngoài giá mua villa, nhà đầu tư cần tính toán thêm các chi phí như thuế chuyển nhượng, phí bảo trì, và chi phí vận hành hàng tháng.',
      'Tuy nhiên, với mức lợi nhuận cho thuê hấp dẫn, các chi phí này hoàn toàn có thể được bù đắp trong thời gian ngắn.',
    ],
  },
  {
    slug: 'trien-lam-kien-truc-xanh-casamia',
    title: 'Triển Lãm Kiến Trúc Xanh Casamia Balanca Tại Hà Nội',
    date: '10.11',
    image: '/carousel-5.png',
    category: 'su-kien',
    content: [
      'Triển lãm kiến trúc xanh Casamia Balanca được tổ chức tại Hà Nội, giới thiệu mô hình kiến trúc bền vững của dự án.',
      'KIẾN TRÚC XANH BỀN VỮNG',
      'Triển lãm trưng bày các mô hình thu nhỏ của biệt thự Casamia Balanca, thể hiện sự kết hợp hài hòa giữa kiến trúc truyền thống Hội An và công nghệ xanh hiện đại.',
      'Sự kiện thu hút hơn 1000 khách tham quan trong 3 ngày diễn ra.',
    ],
  },
]
