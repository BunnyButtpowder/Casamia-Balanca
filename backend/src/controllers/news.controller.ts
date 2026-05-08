import { Request, Response } from 'express'
import pool from '../config/db.js'
import { RowDataPacket, ResultSetHeader } from 'mysql2'
import { AuthRequest } from '../middleware/auth.js'

export async function getNews(_req: Request, res: Response) {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM news_articles ORDER BY created_at DESC'
    )
    const articles = rows.map((row) => ({
      ...row,
      content: typeof row.content === 'string' ? JSON.parse(row.content) : row.content,
    }))
    res.json(articles)
  } catch (err) {
    console.error('Get news error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export async function getNewsArticle(req: Request, res: Response) {
  const { id } = req.params
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM news_articles WHERE id = ?',
      [id]
    )
    if (rows.length === 0) {
      res.status(404).json({ error: 'Article not found' })
      return
    }
    const article = rows[0]
    article.content = typeof article.content === 'string' ? JSON.parse(article.content) : article.content
    res.json(article)
  } catch (err) {
    console.error('Get news article error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export async function createNews(req: AuthRequest, res: Response) {
  const { slug, title, date, image, category, source_url, content } = req.body
  if (!slug || !title) {
    res.status(400).json({ error: 'Slug and title are required' })
    return
  }

  try {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO news_articles (slug, title, date, image, category, source_url, content) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [slug, title, date || '', image || '', category || 'du-an', source_url || '', JSON.stringify(content || [])]
    )
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM news_articles WHERE id = ?',
      [result.insertId]
    )
    const article = rows[0]
    article.content = typeof article.content === 'string' ? JSON.parse(article.content) : article.content
    res.json(article)
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'code' in err && (err as { code: string }).code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: 'Slug already exists' })
      return
    }
    console.error('Create news error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export async function updateNews(req: AuthRequest, res: Response) {
  const { id } = req.params
  const { slug, title, date, image, category, source_url, content } = req.body

  try {
    const [existing] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM news_articles WHERE id = ?',
      [id]
    )
    if (existing.length === 0) {
      res.status(404).json({ error: 'Article not found' })
      return
    }

    await pool.query(
      'UPDATE news_articles SET slug = ?, title = ?, date = ?, image = ?, category = ?, source_url = ?, content = ? WHERE id = ?',
      [slug, title, date || '', image || '', category || 'du-an', source_url || '', JSON.stringify(content || []), id]
    )
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM news_articles WHERE id = ?',
      [id]
    )
    const article = rows[0]
    article.content = typeof article.content === 'string' ? JSON.parse(article.content) : article.content
    res.json(article)
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'code' in err && (err as { code: string }).code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: 'Slug already exists' })
      return
    }
    console.error('Update news error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export async function deleteNews(req: AuthRequest, res: Response) {
  const { id } = req.params
  try {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM news_articles WHERE id = ?',
      [id]
    )
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Article not found' })
      return
    }
    res.json({ success: true })
  } catch (err) {
    console.error('Delete news error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}
