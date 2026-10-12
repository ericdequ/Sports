const assert = require('assert/strict')
const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')
const manifest = JSON.parse(fs.readFileSync('.next/prerender-manifest.json', 'utf8'))
let checked = 0
function visit(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name)
    if (entry.isDirectory()) visit(file)
    else if (/\.mdx?$/.test(entry.name)) {
      const { data } = matter(fs.readFileSync(file, 'utf8'))
      if (data.draft === true) continue
      const route = '/blog/' + file.replace(/^data\/blog\//, '').replace(/\.mdx?$/, '')
      assert(manifest.routes[route], `Missing prerendered article: ${route}`)
      assert(!manifest.notFoundRoutes.includes(route), `Article became a 404: ${route}`)
      checked += 1
    }
  }
}
visit('data/blog')
console.log(`Verified ${checked} published article routes; no 404 fallbacks`)
