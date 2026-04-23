import { Router } from 'express'
import { getAllSections, getSection, updateSection } from '../controllers/sections.controller.js'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()

router.get('/', getAllSections)
router.get('/:key', getSection)
router.put('/:key', authMiddleware, updateSection)

export default router
