import { Request, Response } from 'express'
import pool from '../config/db.js'
import { RowDataPacket } from 'mysql2'
import { AuthRequest } from '../middleware/auth.js'

export async function getAllSections(_req: Request, res: Response) {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT section_key, content FROM site_sections'
    )

    const sections: Record<string, unknown> = {}
    for (const row of rows) {
      sections[row.section_key] = typeof row.content === 'string' ? JSON.parse(row.content) : row.content
    }

    res.json(sections)
  } catch (err) {
    console.error('Get all sections error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export async function getSection(req: Request, res: Response) {
  const { key } = req.params
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT content FROM site_sections WHERE section_key = ?',
      [key]
    )

    if (rows.length === 0) {
      res.status(404).json({ error: 'Section not found' })
      return
    }

    const content = typeof rows[0].content === 'string' ? JSON.parse(rows[0].content) : rows[0].content
    res.json(content)
  } catch (err) {
    console.error('Get section error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export async function updateSection(req: AuthRequest, res: Response) {
  const { key } = req.params
  const { content } = req.body

  if (!content) {
    res.status(400).json({ error: 'Content is required' })
    return
  }

  try {
    const [result] = await pool.query(
      'UPDATE site_sections SET content = ?, updated_by = ? WHERE section_key = ?',
      [JSON.stringify(content), req.user?.id, key]
    )

    const updateResult = result as { affectedRows: number }
    if (updateResult.affectedRows === 0) {
      res.status(404).json({ error: 'Section not found' })
      return
    }

    res.json({ success: true })
  } catch (err) {
    console.error('Update section error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}
