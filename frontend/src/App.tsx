import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import News from './pages/News'
import NewsDetail from './pages/NewsDetail'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tin-tuc" element={<News />} />
        <Route path="/tin-tuc/:slug" element={<NewsDetail />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
