import express from 'express'
import cors, { type CorsOptions } from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.routes.js'
import sectionsRoutes from './routes/sections.routes.js'
import contactsRoutes from './routes/contacts.routes.js'
import downloadsRoutes from './routes/downloads.routes.js'
import uploadRoutes from './routes/upload.routes.js'
import newsRoutes from './routes/news.routes.js'
import galleryRoutes from './routes/gallery.routes.js'

dotenv.config()

const app = express()
const PORT = Number(process.env.PORT) || 3001

const allowedOrigins = new Set<string>([
  'https://casamiabalancahoian.vn',
  'https://www.casamiabalancahoian.vn',
  'http://localhost:5173',
])

const extraOrigins = (process.env.CORS_ORIGINS ?? '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean)
for (const o of extraOrigins) allowedOrigins.add(o)

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true)
    if (allowedOrigins.has(origin)) return callback(null, true)
    return callback(new Error(`Not allowed by CORS: ${origin}`))
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204,
}

app.use(cors(corsOptions))
app.options('*', cors(corsOptions))
app.use(express.json())
app.use('/uploads', express.static('uploads'))

app.get('/', (_req, res) => {
  res.status(200).send('API is running')
})

app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok' })
})

app.use('/api/auth', authRoutes)
app.use('/api/sections', sectionsRoutes)
app.use('/api/contacts', contactsRoutes)
app.use('/api/downloads', downloadsRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/news', newsRoutes)
app.use('/api/gallery', galleryRoutes)

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`)
})