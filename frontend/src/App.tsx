import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import Home from './pages/Home'
const News = lazy(() => import('./pages/News'))
const NewsDetail = lazy(() => import('./pages/NewsDetail'))

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tin-tuc" element={<Suspense fallback={null}><News /></Suspense>} />
        <Route path="/tin-tuc/:slug" element={<Suspense fallback={null}><NewsDetail /></Suspense>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
