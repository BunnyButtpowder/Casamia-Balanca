import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import Home from './pages/Home'
import ScrollToTop from './components/ScrollToTop'
const News = lazy(() => import('./pages/News'))
const NewsDetail = lazy(() => import('./pages/NewsDetail'))

// Admin pages
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'))
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const HeroEditor = lazy(() => import('./pages/admin/sections/HeroEditor'))
const AboutEditor = lazy(() => import('./pages/admin/sections/AboutEditor'))
const MapEditor = lazy(() => import('./pages/admin/sections/MapEditor'))
const FeaturesEditor = lazy(() => import('./pages/admin/sections/FeaturesEditor'))
const ProductsEditor = lazy(() => import('./pages/admin/sections/ProductsEditor'))
const ValueEditor = lazy(() => import('./pages/admin/sections/ValueEditor'))
const FooterEditor = lazy(() => import('./pages/admin/sections/FooterEditor'))
const ContactsList = lazy(() => import('./pages/admin/ContactsList'))
const DownloadsList = lazy(() => import('./pages/admin/DownloadsList'))
const ChangePassword = lazy(() => import('./pages/admin/ChangePassword'))

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tin-tuc" element={<Suspense fallback={null}><News /></Suspense>} />
        <Route path="/tin-tuc/:slug" element={<Suspense fallback={null}><NewsDetail /></Suspense>} />

        {/* Admin routes */}
        <Route path="/admin/login" element={<Suspense fallback={null}><AdminLogin /></Suspense>} />
        <Route path="/admin" element={<Suspense fallback={null}><AdminLayout /></Suspense>}>
          <Route index element={<AdminDashboard />} />
          <Route path="hero" element={<HeroEditor />} />
          <Route path="about" element={<AboutEditor />} />
          <Route path="map" element={<MapEditor />} />
          <Route path="features" element={<FeaturesEditor />} />
          <Route path="products" element={<ProductsEditor />} />
          <Route path="value" element={<ValueEditor />} />
          <Route path="footer" element={<FooterEditor />} />
          <Route path="contacts" element={<ContactsList />} />
          <Route path="downloads" element={<DownloadsList />} />
          <Route path="change-password" element={<ChangePassword />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
