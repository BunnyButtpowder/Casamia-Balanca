import { Router } from 'express'
import { submitDownload, getDownloads } from '../controllers/downloads.controller.js'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()

router.post('/', submitDownload)
router.get('/', authMiddleware, getDownloads)

export default router
