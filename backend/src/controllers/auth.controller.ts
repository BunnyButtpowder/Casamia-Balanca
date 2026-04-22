import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import pool from '../config/db.js'
import { RowDataPacket } from 'mysql2'

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
