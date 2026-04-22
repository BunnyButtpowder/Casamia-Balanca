import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import pool from '../config/db.js'
import { RowDataPacket } from 'mysql2'
import { AuthRequest } from '../middleware/auth.js'

export async function login(req: Request, res: Response) {
  const { username, password } = req.body
  if (!username || !password) {
    res.status(400).json({ error: 'Username and password are required' })
    return
  }

  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT id, username, password_hash FROM admin_users WHERE username = ?',
      [username]
    )

    if (rows.length === 0) {
      res.status(401).json({ error: 'Invalid credentials' })
      return
    }

    const user = rows[0]
    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) {
      res.status(401).json({ error: 'Invalid credentials' })
      return
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    res.json({ token, username: user.username })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export async function changePassword(req: AuthRequest, res: Response) {
  const { currentPassword, newPassword } = req.body
  const userId = req.user?.id

  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }

  if (!currentPassword || !newPassword) {
    res.status(400).json({ error: 'Current password and new password are required' })
    return
  }

  if (newPassword.length < 6) {
    res.status(400).json({ error: 'New password must be at least 6 characters' })
    return
  }

  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT id, password_hash FROM admin_users WHERE id = ?',
      [userId]
    )

    if (rows.length === 0) {
      res.status(404).json({ error: 'User not found' })
      return
    }

    const user = rows[0]
    const valid = await bcrypt.compare(currentPassword, user.password_hash)
    if (!valid) {
      res.status(401).json({ error: 'Current password is incorrect' })
      return
    }

    const newHash = await bcrypt.hash(newPassword, 10)
    await pool.query('UPDATE admin_users SET password_hash = ? WHERE id = ?', [newHash, userId])

    res.json({ success: true })
  } catch (err) {
    console.error('Change password error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}
