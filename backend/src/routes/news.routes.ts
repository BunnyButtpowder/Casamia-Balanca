import { Router } from 'express'
import { getNews, getNewsArticle, createNews, updateNews, deleteNews } from '../controllers/news.controller.js'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()

router.get('/', getNews)
router.get('/:id', getNewsArticle)
router.post('/', authMiddleware, createNews)
router.put('/:id', authMiddleware, updateNews)
router.delete('/:id', authMiddleware, deleteNews)

export default router
