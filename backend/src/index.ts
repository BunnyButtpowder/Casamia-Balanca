import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.routes.js'
import sectionsRoutes from './routes/sections.routes.js'
import contactsRoutes from './routes/contacts.routes.js'
import downloadsRoutes from './routes/downloads.routes.js'
import uploadRoutes from './routes/upload.routes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static('uploads'))

app.use('/api/auth', authRoutes)
app.use('/api/sections', sectionsRoutes)
app.use('/api/contacts', contactsRoutes)
app.use('/api/downloads', downloadsRoutes)
app.use('/api/upload', uploadRoutes)

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
