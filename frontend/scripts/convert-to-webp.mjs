#!/usr/bin/env node
/**
 * Convert all PNG/JPG images in public/ to WebP format.
 * Keeps originals so older references still work, but new code should use .webp.
 *
 * Usage: node scripts/convert-to-webp.mjs
 */
import sharp from 'sharp'
import { readdir, stat } from 'node:fs/promises'
import { join, extname, basename } from 'node:path'

const PUBLIC_DIR = join(import.meta.dirname, '..', 'public')
const QUALITY = 80
// Skip tiny icons / favicons
const MIN_SIZE_BYTES = 10_000

const EXTENSIONS = new Set(['.png', '.jpg', '.jpeg'])

async function convert() {
  const files = await readdir(PUBLIC_DIR)
  let converted = 0
  let skipped = 0

  for (const file of files) {
    const ext = extname(file).toLowerCase()
    if (!EXTENSIONS.has(ext)) continue

    const src = join(PUBLIC_DIR, file)
    const info = await stat(src)
    if (info.size < MIN_SIZE_BYTES) {
      skipped++
      continue
    }

    const dest = join(PUBLIC_DIR, basename(file, ext) + '.webp')
    try {
      const result = await sharp(src)
        .webp({ quality: QUALITY })
        .toFile(dest)

      const savings = ((1 - result.size / info.size) * 100).toFixed(1)
      console.log(
        `  ${file} (${(info.size / 1024).toFixed(0)}KB) -> ${basename(dest)} (${(result.size / 1024).toFixed(0)}KB) [${savings}% smaller]`
      )
      converted++
    } catch (err) {
      console.error(`  SKIP ${file}: ${err.message}`)
      skipped++
    }
  }

  console.log(`\nDone: ${converted} converted, ${skipped} skipped`)
}

convert()
