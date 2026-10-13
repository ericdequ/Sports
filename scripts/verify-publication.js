const assert = require('node:assert/strict')
const fs = require('node:fs')
const { readPosts, readExpectedFeeds } = require('./publication-io.cjs')
const {
  articleUrl,
  compareUrlInventory,
  generateRss,
  selectPublicPosts,
} = require('../lib/publication.cjs')
const site = require('../data/siteMetadata')

const source = readPosts()
const posts = selectPublicPosts(source)
const { feeds } = readExpectedFeeds()
for (const [file, expected] of feeds) {
  assert.equal(
    fs.readFileSync(`public/${file}`, 'utf8'),
    expected,
    `Public ${file} must match the complete eligible inventory`
  )
}
const expectedFeed = generateRss(posts, site)
const actualFeed = fs.readFileSync('public/feed.xml', 'utf8')
assert.equal(
  actualFeed,
  expectedFeed,
  'Root RSS must exactly match current public source; regenerate before build'
)

const unescapeXml = (value) =>
  value.replace(
    /&(amp|lt|gt|quot|apos|#039|#39);/g,
    (_, name) =>
      ({ amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", '#039': "'", '#39': "'" }[name])
  )
const sitemap = fs.readFileSync('public/sitemap.xml', 'utf8')
const actualUrls = [...sitemap.matchAll(/<loc\s*>\s*([^<]*)\s*<\/loc\s*>/g)]
  .map((match) => unescapeXml(match[1].trim()))
  .filter((url) => new URL(url).pathname.startsWith('/blog/'))
const expectedUrls = posts
  .filter((post) => !post.canonicalUrl)
  .map((post) => articleUrl(post, site))
assert.deepEqual(
  compareUrlInventory(expectedUrls, actualUrls),
  { valid: true, missing: [], unexpected: [], duplicates: [] },
  'Sitemap public-post inventory differs'
)

const manifest = JSON.parse(fs.readFileSync('.next/prerender-manifest.json', 'utf8'))
const sourceRoutes = new Set(source.map((post) => articleUrl(post, site)))
const actualRoutes = Object.keys(manifest.routes)
  .filter((route) => sourceRoutes.has(new URL(route, site.siteUrl).href))
  .filter((route) => !(manifest.notFoundRoutes || []).includes(route))
// Match actual source slugs, including percent-encoded Unicode routes.
const asUrl = (route) => new URL(route, site.siteUrl).href
assert.deepEqual(
  compareUrlInventory(
    posts.map((post) => articleUrl(post, site)),
    actualRoutes.map(asUrl)
  ),
  { valid: true, missing: [], unexpected: [], duplicates: [] },
  'Built article routes must match public source exactly'
)
const listing = JSON.parse(fs.readFileSync('.next/server/pages/blog.json', 'utf8')).pageProps.posts
assert(Array.isArray(listing), 'Expected the built /blog listing')
assert.deepEqual(
  compareUrlInventory(
    posts.map((post) => articleUrl(post, site)),
    listing.map((post) => articleUrl(post, site))
  ),
  { valid: true, missing: [], unexpected: [], duplicates: [] },
  'Built blog listing and RSS must contain the same posts'
)

// Next's Vercel adapter can package public assets during next build. Check
// these copies as well, so a correct public/ file cannot mask stale output.
for (const output of ['.next/output/static', '.vercel/output/static']) {
  if (!fs.existsSync(output)) continue
  for (const file of [...feeds.keys(), 'sitemap.xml']) {
    assert.equal(
      fs.readFileSync(`${output}/${file}`, 'utf8'),
      fs.readFileSync(`public/${file}`, 'utf8'),
      `Packaged ${output}/${file} differs from the verified publication assets`
    )
  }
}
console.log(
  `Verified ${posts.length} public posts across RSS, sitemap, built routes, and blog listing`
)
