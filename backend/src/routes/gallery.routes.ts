import { Router } from 'express'
import { getGallery, getGalleryItem, createGalleryItem, updateGalleryItem, deleteGalleryItem } from '../controllers/gallery.controller.js'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()

router.get('/', getGallery)
router.get('/:id', getGalleryItem)
router.post('/', authMiddleware, createGalleryItem)
router.put('/:id', authMiddleware, updateGalleryItem)
router.delete('/:id', authMiddleware, deleteGalleryItem)

export default router
