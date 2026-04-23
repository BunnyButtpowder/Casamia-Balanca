import { Request, Response } from 'express'
import pool from '../config/db.js'
import { RowDataPacket } from 'mysql2'

export async function submitContact(req: Request, res: Response) {
  const { name, phone, email, message } = req.body
  if (!name || !phone) {
    res.status(400).json({ error: 'Name and phone are required' })
    return
  }

  try {
    await pool.query(
      'INSERT INTO contact_submissions (name, phone, email, message) VALUES (?, ?, ?, ?)',
      [name, phone, email || null, message || null]
    )
    res.json({ success: true })
  } catch (err) {
    console.error('Submit contact error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export async function getContacts(_req: Request, res: Response) {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM contact_submissions ORDER BY created_at DESC'
    )
    res.json(rows)
  } catch (err) {
    console.error('Get contacts error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}
