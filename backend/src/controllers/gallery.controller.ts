import { Request, Response } from 'express'
import pool from '../config/db.js'
import { RowDataPacket, ResultSetHeader } from 'mysql2'
import { AuthRequest } from '../middleware/auth.js'

export async function getGallery(_req: Request, res: Response) {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM gallery_items ORDER BY sort_order ASC, created_at DESC'
    )
    const items = rows.map((row) => ({
      ...row,
      images: typeof row.images === 'string' ? JSON.parse(row.images) : row.images ?? [],
    }))
    res.json(items)
  } catch (err) {
    console.error('Get gallery error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export async function getGalleryItem(req: Request, res: Response) {
  const { id } = req.params
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM gallery_items WHERE id = ?',
      [id]
    )
    if (rows.length === 0) {
      res.status(404).json({ error: 'Item not found' })
      return
    }
    const item = rows[0]
    item.images = typeof item.images === 'string' ? JSON.parse(item.images) : item.images ?? []
    res.json(item)
  } catch (err) {
    console.error('Get gallery item error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export async function createGalleryItem(req: AuthRequest, res: Response) {
  const { title, date, thumbnail, category, url, images, sort_order } = req.body
  if (!title) {
    res.status(400).json({ error: 'Title is required' })
    return
  }

  try {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO gallery_items (title, date, thumbnail, category, url, images, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [title, date || '', thumbnail || '', category || 'image', url || '', images ? JSON.stringify(images) : null, sort_order ?? 0]
    )
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM gallery_items WHERE id = ?',
      [result.insertId]
    )
    const item = rows[0]
    item.images = typeof item.images === 'string' ? JSON.parse(item.images) : item.images ?? []
    res.json(item)
  } catch (err) {
    console.error('Create gallery item error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export async function updateGalleryItem(req: AuthRequest, res: Response) {
  const { id } = req.params
  const { title, date, thumbnail, category, url, images, sort_order } = req.body

  try {
    const [existing] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM gallery_items WHERE id = ?',
      [id]
    )
    if (existing.length === 0) {
      res.status(404).json({ error: 'Item not found' })
      return
    }

    await pool.query(
      'UPDATE gallery_items SET title = ?, date = ?, thumbnail = ?, category = ?, url = ?, images = ?, sort_order = ? WHERE id = ?',
      [title, date || '', thumbnail || '', category || 'image', url || '', images ? JSON.stringify(images) : null, sort_order ?? 0, id]
    )
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM gallery_items WHERE id = ?',
      [id]
    )
    const item = rows[0]
    item.images = typeof item.images === 'string' ? JSON.parse(item.images) : item.images ?? []
    res.json(item)
  } catch (err) {
    console.error('Update gallery item error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export async function deleteGalleryItem(req: AuthRequest, res: Response) {
  const { id } = req.params
  try {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM gallery_items WHERE id = ?',
      [id]
    )
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Item not found' })
      return
    }
    res.json({ success: true })
  } catch (err) {
    console.error('Delete gallery item error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}
