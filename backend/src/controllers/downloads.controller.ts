import { Request, Response } from 'express'
import pool from '../config/db.js'
import { RowDataPacket } from 'mysql2'

export async function submitDownload(req: Request, res: Response) {
  const { name, phone, city, email } = req.body
  if (!name || !phone) {
    res.status(400).json({ error: 'Name and phone are required' })
    return
  }

  try {
    await pool.query(
      'INSERT INTO download_submissions (name, phone, city, email) VALUES (?, ?, ?, ?)',
      [name, phone, city || null, email || null]
    )
    res.json({ success: true })
  } catch (err) {
    console.error('Submit download error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export async function getDownloads(_req: Request, res: Response) {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM download_submissions ORDER BY created_at DESC'
    )
    res.json(rows)
  } catch (err) {
    console.error('Get downloads error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}
