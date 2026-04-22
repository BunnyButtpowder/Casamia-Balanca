import dotenv from 'dotenv'
import mysql from 'mysql2/promise'
import bcrypt from 'bcryptjs'

dotenv.config()

async function seed() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  })

  console.log('Connected to database')

  // Create tables
  await connection.query(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)

  await connection.query(`
    CREATE TABLE IF NOT EXISTS site_sections (
      id INT AUTO_INCREMENT PRIMARY KEY,
      section_key VARCHAR(50) UNIQUE NOT NULL,
      content JSON NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      updated_by INT,
      FOREIGN KEY (updated_by) REFERENCES admin_users(id)
    )
  `)

  await connection.query(`
    CREATE TABLE IF NOT EXISTS contact_submissions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      phone VARCHAR(20) NOT NULL,
      email VARCHAR(100),
      message TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)

  await connection.query(`
    CREATE TABLE IF NOT EXISTS download_submissions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      phone VARCHAR(20) NOT NULL,
      city VARCHAR(100),
      email VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)

  console.log('Tables created')

  // Insert admin user (password: admin123)
  const passwordHash = await bcrypt.hash('admin123', 10)
  await connection.query(
    `INSERT INTO admin_users (username, password_hash) VALUES (?, ?)
     ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)`,
    ['admin', passwordHash]
  )

  console.log('Admin user created (username: admin, password: admin123)')

  // Seed sections
  const sections: Record<string, unknown> = {
    hero: {
      videoUrl: '/hero.mp4',
      titleLine1Word1: 'Sống',
      titleLine1Word2: 'đủ sâu',
      titleLine2Word1: 'Giữ',
      titleLine2Word2: 'đủ lâu',
      subtitle: 'Đâu là điều quý giá nhất đời người?',
    },
    about: {
      headingLine1: 'Là mỗi ngày sống Khoẻ',
      headingLine2: 'Là nếp nhà sống An',
      tvcYoutubeId: 'BS30TFRCrg4',
      secondHeadingLine1Part1: 'An cư',
      secondHeadingLine1Part2: 'giữa thiên nhiên',
      secondHeadingLine2Part1: 'An lành',
      secondHeadingLine2Part2: 'từng hơi thở',
      bannerImage: '/3.jpg',
      bannerImageMobile: '/3-mobile.png',
      statsParagraph: 'Địa thế đắc địa hiếm có, Casamia Balanca Hoi An là nơi mỗi ngày cư dân sống an, sống khỏe cùng hệ sinh thái sông - rừng dừa - vịnh biển.',
      stats: [
        { label: 'Tổng\nquy mô', value: '31,1 ha' },
        { label: 'Rừng dừa nước\ntự nhiên', value: '3,6 ha' },
        { label: 'Diện tích cây xanh,\n mặt nước', value: '8 ha' },
        { label: 'Mật độ\nxây dựng', value: '38%' },
        { label: 'Cận hải - Cận giang \n- Cận lâm - Cận lộ', value: '04 cận' },
      ],
    },
    map: {
      title: 'Khu đô thị sinh thái',
      subtitle: 'Liền kề khu dự trữ sinh quyển thế giới',
      description: 'Dự án nằm liền kề rừng dừa Bảy Mẫu 200 năm tuổi, trong vùng đệm của khu dự trữ sinh quyển thế giới Cù Lao Chàm, nơi hội thủy của ba dòng sông lớn: Thu Bồn, Cổ Cò, Trường Giang.',
      locations: [
        { name: 'Rừng dừa Bảy Mẫu', time: '1 - 2 phút' },
        { name: 'Biển Cửa Đại', time: '5 phút' },
        { name: 'Bãi biển An Bàng', time: '5 - 7 phút' },
        { name: 'Phố cổ Hội An', time: '5 - 10 phút' },
        { name: 'Sân bay quốc tế Đà Nẵng', time: '30 - 40 phút' },
      ],
      downloadUrl: 'https://drive.google.com/drive/folders/1hK-gZr3IgHwoXaurZJbYyOnfV8XxGgxM?usp=drive_link',
    },
    features: {
      title: 'Sống theo nhịp Hội An',
      subtitle: 'Giữa dòng chảy quốc tế',
      description: 'Sống an lành giữa thiên nhiên và văn hóa bản địa, đồng thời kết nối linh hoạt với cộng đồng quốc tế. Tại đây, mỗi tiện ích được thiết kế để dung hòa hai nhịp: tận hưởng "vibe Hội An" tĩnh tại và trải nghiệm nhịp sống toàn cầu năng động.',
      stats: [
        { value: '08', label: 'Ha\ncây xanh' },
        { value: '05', label: 'Công viên\nchủ đề' },
        { value: '19', label: 'Trụ hoa giấy\nkỷ lục' },
        { value: '70 m', label: 'Đường kính\nhồ trung tâm' },
      ],
      slides: [
        { src: '/center-square.jpg', title: 'Quảng trường trung tâm', desc: 'Hệ thống cây xanh, mặt nước được kết nối, xếp lớp  tạo nên lá phổi xanh, đảm bảo chất lượng không khí thuần khiết cho khu đô thị.', cat: 'health-care' },
        { src: '/wellness-park.jpg', title: 'Công viên Wellness', desc: 'Hồ bơi tràn viền hướng biển, mang đến trải nghiệm nghỉ dưỡng đẳng cấp quốc tế.', cat: 'health-care' },
        { src: '/pickleball.jpg', title: 'Hệ thống sân Pickle Ball', desc: 'Không gian giải trí thượng lưu với tầm nhìn toàn cảnh sông nước và hoàng hôn.', cat: 'health-care' },
        { src: '/gym-and-fitness.jpg', title: 'Gym & Fitness', desc: 'Không gian giải trí thượng lưu với tầm nhìn toàn cảnh sông nước và hoàng hôn.', cat: 'health-care' },
        { src: '/pool.jpg', title: 'Bể bơi tiêu chuẩn Olympic', desc: 'Không gian giải trí thượng lưu với tầm nhìn toàn cảnh sông nước và hoàng hôn.', cat: 'health-care' },
        { src: '/school.jpg', title: 'Trường mầm non quốc tế', desc: 'Không gian giải trí thượng lưu với tầm nhìn toàn cảnh sông nước và hoàng hôn.', cat: 'health-care' },
        { src: '/hotel.jpg', title: 'Khách sạn 5 sao', desc: 'Không gian giải trí thượng lưu với tầm nhìn toàn cảnh sông nước và hoàng hôn.', cat: 'service' },
        { src: '/mall.jpg', title: 'Trung tâm thương mại', desc: 'Không gian giải trí thượng lưu với tầm nhìn toàn cảnh sông nước và hoàng hôn.', cat: 'service' },
        { src: '/co-working.jpg', title: 'Co-working Space', desc: 'Không gian giải trí thượng lưu với tầm nhìn toàn cảnh sông nước và hoàng hôn.', cat: 'service' },
        { src: '/coffee-shop.jpg', title: 'Coffee & Bistro', desc: 'Không gian giải trí thượng lưu với tầm nhìn toàn cảnh sông nước và hoàng hôn.', cat: 'service' },
        { src: '/bar.jpg', title: 'Sky bar', desc: 'Không gian giải trí thượng lưu với tầm nhìn toàn cảnh sông nước và hoàng hôn.', cat: 'service' },
      ],
    },
    products: {
      heading1Part1: 'An nhàn',
      heading1Part2: 'khai thác',
      heading2Part1: 'An tâm',
      heading2Part2: 'sinh lời',
      bannerImage: '/product.png',
      bannerImageMobile: '/product-mobile.png',
      description: 'Lối kiến trúc giao thoa giữa di sản và tư duy xanh không chỉ tạo nên vẻ đẹp bền vững theo thời gian, mà còn được tính toán để tối ưu công năng lưu trú và trải nghiệm. Không gian vừa tinh tế, giàu bản sắc, vừa phù hợp với nhu cầu vận hành thực tế, giúp chủ sở hữu dễ dàng khai thác, tối ưu hiệu suất cho thuê, tạo dòng tiền ổn định.',
      exteriorImages: ['/carousel-5.png', '/river.jpg', '/pool-view.jpg'],
      architectTitle: 'Kiệt tác xanh được thổi hồn bởi KTS',
      architectName: 'Võ Trọng Nghĩa',
      architectDescription: 'Kiến trúc dự án kế thừa tinh thần Hội An với mái ngói nâu xếp lớp, đá sa thạch Mỹ Sơn và được phát triển bởi KTS Võ Trọng Nghĩa theo định hướng xanh bền vững. Biệt thự thiết kế mở, thông tầng, hệ cửa kính lớn giúp tối ưu ánh sáng và thông gió, tạo không gian thoáng mát, gần gũi thiên nhiên.',
      awards: [
        { image: '/award.png', title: 'Asia Property Awards 2021', description: 'Thiết kế kiến trúc cảnh quan đẹp nhất Việt Nam' },
        { image: '/award-2025.png', title: 'Dự án Đáng sống 2025', description: '"Dự án Đáng sống 2025" do VCCI và Tạp chí Diễn đàn Doanh nghiệp tổ chức.' },
      ],
      parkHomeTitle: 'Tối ưu lưu trú, đón khách toàn cầu',
      parkHomeExteriorLabel: 'Mẫu 1',
      parkHomeInteriorLabel: 'Mẫu 2',
      parkHomeExteriorTitle: 'Mẫu xây thô hoàn thiện mặt ngoài',
      parkHomeInteriorTitle: 'Mẫu hoàn thiện nội thất',
      parkHomeDescription: 'Park Home là dòng biệt thự lưu trú tại phân khu sôi động nhất Casamia Balanca Hội An, được thiết kế đa chức năng linh hoạt, tối ưu vận hành. Sản phẩm phù hợp đón đầu nhu cầu lưu trú dài hạn của khách quốc tế tại Hội An – Đà Nẵng, đồng thời là cơ hội đầu tư khan hiếm, tạo dòng tiền ngay.',
      parkHomeExteriorImages: [
        '/ParkHome/exterior/livingroom.jpg',
        '/ParkHome/exterior/kitchen.jpg',
        '/ParkHome/exterior/bathroom.jpg',
        '/ParkHome/exterior/bedroom.jpg',
        '/ParkHome/exterior/bedroom-2.jpg',
        '/ParkHome/exterior/bedroom-3.jpg',
        '/ParkHome/exterior/reading-room.jpg',
      ],
      parkHomeInteriorImages: [
        '/ParkHome/interior/livingroom.jpg',
        '/ParkHome/interior/kitchen.jpg',
        '/ParkHome/interior/readingroom.jpg',
        '/ParkHome/interior/washingroom.jpg',
        '/ParkHome/interior/bathroom.jpg',
        '/ParkHome/interior/garden.jpg',
      ],
      operationsTitle1: 'Hợp tác vận hành',
      operationsTitle2: '& Sinh lời ngay',
      operationsSubtitle: 'Cùng đơn vị chuyên nghiệp',
      villageLogoUrl: '/logo-village.png',
      villageDescription: 'Casamia Balanca thiết lập mô hình vận hành toàn diện, nói chủ đầu tư Đạt Phương kiến tạo nền tảng, M Village trực tiếp vận hành, và chủ nhà an tâm thụ hưởng đồng thời. Sự kết hợp giữa hệ sinh thái bài bản và đơn vị vận hành giàu kinh nghiệm, am hiểu khách quốc tế giúp tối ưu hiệu suất khai thác, đồng thời giải phóng hoàn toàn áp lực quản lý cho chủ nhà đầu tư ở xa.',
      villageImages: [
        { src: '/carousel-1.jpg', title: 'Công viên chủ đề và các tuyến phố cây xanh', desc: 'Hệ thống cây xanh, mặt nước được kết nối, xếp lớp tạo nên lá phổi xanh, đảm bảo chất lượng không khí thuần khiết cho khu đô thị.' },
        { src: '/carousel-2.png', title: 'Công viên chủ đề và các tuyến phố cây xanh', desc: 'Hệ thống cây xanh, mặt nước được kết nối, xếp lớp tạo nên lá phổi xanh, đảm bảo chất lượng không khí thuần khiết cho khu đô thị.' },
        { src: '/carousel-3.png', title: 'Công viên chủ đề và các tuyến phố cây xanh', desc: 'Hệ thống cây xanh, mặt nước được kết nối, xếp lớp tạo nên lá phổi xanh, đảm bảo chất lượng không khí thuần khiết cho khu đô thị.' },
        { src: '/carousel-6.jpg', title: 'Công viên chủ đề và các tuyến phố cây xanh', desc: 'Hệ thống cây xanh, mặt nước được kết nối, xếp lớp tạo nên lá phổi xanh, đảm bảo chất lượng không khí thuần khiết cho khu đô thị.' },
      ],
      parkHomeHeading: 'Park Home',
      parkHomeSubheading1: 'Đón khách quốc tế,',
      parkHomeSubheading2: 'kích hoạt dòng tiền ngay lập tức',
    },
    value: {
      heading1Part1: 'An toàn',
      heading1Part2: 'tích sản',
      heading2Part1: 'An giữ',
      heading2Part2: 'truyền đời',
      bannerImage: '/safety.png',
      bannerImageMobile: '/safety-mobile.png',
      aerialImage: '/exterior-2.jpg',
      sceneryImage: '/scenery.jpg',
      paragraph1: '100% biệt thự Casamia Balanca sở hữu lâu dài. Tọa lạc trên quỹ đất hiếm trong vùng sinh thái được quy hoạch bảo tồn nghiêm ngặt của Hội An.',
      paragraph2: 'Tính pháp lý vững chắc đi cùng sự khan hiếm không thể mở rộng tạo nên giá trị bền vững theo thời gian, vừa là tài sản tích lũy an toàn, vừa có thể trao truyền cho nhiều thế hệ.',
      developerTitle: 'Chủ đầu tư uy tín',
      developerSubtitle: 'Top 10 thương hiệu phát triển bền vững',
      developerDescription: 'Kiên định với triết lý phát triển bền vững, lấy con người làm trung tâm. Đạt Phương gắn bó sâu sắc với Hội An qua các công trình hạ tầng trọng điểm như cầu Đế Võng, Cửa Đại, tuyến ven biển Võ Chí Công…, tích lũy nền tảng về địa chất, thủy văn và cấu trúc đặc thù, từ đó kiến tạo những sản phẩm có giá trị thực, bền vững theo thời gian.',
      awards: [
        { image: '/award-top-10.png', title: 'TOP 10', description: 'thương hiệu phát triển bền vững (2025)' },
        { image: '/award-top-10(2).png', title: 'TOP 10', description: 'nhà thầu xây dựng hạ tầng - công nghiệp uy tín năm 2026' },
        { image: '/award-top-500.png', title: 'TOP 500', description: 'doanh nghiệp tư nhân lớn nhất Việt Nam' },
      ],
      deliveryTitle: '03 lựa chọn "may đo" không gian',
      deliverySubtitle: 'Phương án bàn giao linh hoạt, tối ưu cho khách hàng',
      deliveryItems: [
        'Hoàn thiện full nội thất - Tham gia chương trình ủy thác cho thuê',
        'Hoàn thiện nội thất cơ bản',
        'Xây thô hoàn thiện mặt ngoài',
      ],
    },
    footer: {
      galleryImages: ['/center-square.jpg', '/carousel-5.png', '/infi-pool.jpg', '/bar.jpg'],
      salesOfficeAddress: 'Khu đô thị Casamia Balanca Hoi An, Phường Hội An Đông, Thành phố Đà Nẵng',
      phone: '(+84)90 136 22 88',
      socialLinks: { tiktok: '#', facebook: '#' },
      copyright: 'Bản quyền thuộc về Casamia Balanca Hội An',
    },
  }

  for (const [key, content] of Object.entries(sections)) {
    await connection.query(
      `INSERT INTO site_sections (section_key, content) VALUES (?, ?)
       ON DUPLICATE KEY UPDATE content = VALUES(content)`,
      [key, JSON.stringify(content)]
    )
    console.log(`Seeded section: ${key}`)
  }

  console.log('Seed completed successfully!')
  await connection.end()
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
