import { Router } from 'express'
import { submitContact, getContacts } from '../controllers/contacts.controller.js'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()

router.post('/', submitContact)
router.get('/', authMiddleware, getContacts)

export default router
