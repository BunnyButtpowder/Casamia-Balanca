import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * Moves <link rel="stylesheet"> tags before <script> tags in the built HTML
 * so the browser discovers CSS earlier and can download it in parallel with JS,
 * shortening the critical request chain.
 */
function cssPreloadPlugin(): Plugin {
  return {
    name: 'css-preload',
    enforce: 'post',
    transformIndexHtml(html) {
      // Extract all Vite-injected stylesheet links
      const cssLinkRe = /<link rel="stylesheet" crossorigin href="(\/assets\/[^"]+\.css)">/g
      const cssLinks: string[] = []
      let match
      while ((match = cssLinkRe.exec(html)) !== null) {
        cssLinks.push(match[0])
      }
      if (cssLinks.length === 0) return html

      // Remove original stylesheet links from their current position
      html = html.replace(/<link rel="stylesheet" crossorigin href="\/assets\/[^"]+\.css">\n?\s*/g, '')

      // Insert them right after <meta charset> so the browser discovers CSS
      // before any scripts — eliminates the JS→CSS sequential chain
      html = html.replace(
        /(<meta charset="UTF-8" \/>)/,
        `$1\n  ${cssLinks.join('\n  ')}`
      )
      return html
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), cssPreloadPlugin()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Core framework — cached long-term, rarely changes
          if (id.includes('node_modules/react-dom')) return 'react-dom'
          if (id.includes('node_modules/react/') || id.includes('node_modules/scheduler')) return 'react'
          // Router separate — only needed if using multi-page
          if (id.includes('node_modules/react-router')) return 'router'
          // Lenis — already lazy-loaded via dynamic import
          if (id.includes('node_modules/lenis')) return 'lenis'
          // Icons — tree-shaken but still a chunk
          if (id.includes('node_modules/lucide-react')) return 'lucide'
        },
      },
    },
    cssMinify: 'lightningcss',
  },
})
