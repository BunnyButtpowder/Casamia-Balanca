export interface HeroSection {
  videoUrl: string
  titleLine1Word1: string
  titleLine1Word2: string
  titleLine2Word1: string
  titleLine2Word2: string
  subtitle: string
}

export interface AboutSection {
  headingLine1: string
  headingLine2: string
  tvcYoutubeId: string
  secondHeadingLine1Part1: string
  secondHeadingLine1Part2: string
  secondHeadingLine2Part1: string
  secondHeadingLine2Part2: string
  bannerImage: string
  bannerImageMobile: string
  statsParagraph: string
  stats: Array<{ label: string; value: string }>
}

export interface MapSection {
  title: string
  subtitle: string
  description: string
  locations: Array<{ name: string; time: string }>
  downloadUrl: string
}

export interface FeaturesSection {
  title: string
  subtitle: string
  description: string
  stats: Array<{ value: string; label: string }>
  slides: Array<{ src: string; title: string; desc: string; cat: string }>
}

export interface ProductsSection {
  heading1Part1: string
  heading1Part2: string
  heading2Part1: string
  heading2Part2: string
  description: string
  bannerImage: string
  bannerImageMobile: string
  exteriorImages: string[]
  architectTitle: string
  architectName: string
  architectDescription: string
  awards: Array<{ image: string; title: string; description: string }>
  parkHomeTitle: string
  parkHomeExteriorLabel: string
  parkHomeInteriorLabel: string
  parkHomeExteriorTitle: string
  parkHomeInteriorTitle: string
  parkHomeDescription: string
  parkHomeExteriorImages: string[]
  parkHomeInteriorImages: string[]
  parkHomeHeading: string
  parkHomeSubheading1: string
  parkHomeSubheading2: string
  operationsTitle1: string
  operationsTitle2: string
  operationsSubtitle: string
  villageLogoUrl: string
  villageDescription: string
  villageImages: Array<{ src: string; title: string; desc: string }>
}

export interface ValueSection {
  heading1Part1: string
  heading1Part2: string
  heading2Part1: string
  heading2Part2: string
  paragraph1: string
  paragraph2: string
  bannerImage: string
  bannerImageMobile: string
  aerialImage: string
  sceneryImage: string
  developerTitle: string
  developerSubtitle: string
  developerDescription: string
  awards: Array<{ image: string; title: string; description: string }>
  deliveryTitle: string
  deliverySubtitle: string
  deliveryItems: string[]
}

export interface FooterSection {
  galleryImages: string[]
  salesOfficeAddress: string
  phone: string
  socialLinks: { tiktok: string; facebook: string; zalo: string }
  copyright: string
}

export interface AllSections {
  hero: HeroSection
  about: AboutSection
  map: MapSection
  features: FeaturesSection
  products: ProductsSection
  value: ValueSection
  footer: FooterSection
}
