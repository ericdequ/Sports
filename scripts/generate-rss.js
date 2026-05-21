const fs = require('fs')
const path = require('path')
const globby = require('globby')
const matter = require('gray-matter')
const siteMetadata = require('../data/siteMetadata')

const escape = (html) =>
  String(html || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')

const normalizeSlug = (file) =>
  file
    .replace(/\\/g, '/')
    .replace(/^data\/blog\//, '')
    .replace(/\.(mdx|md)$/, '')

const generateRssItem = (post) => `
  <item>
    <guid>${siteMetadata.siteUrl}/blog/${post.slug}</guid>
    <title>${escape(post.title)}</title>
    <link>${siteMetadata.siteUrl}/blog/${post.slug}</link>
    ${post.summary ? `<description>${escape(post.summary)}</description>` : ''}
    <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    <author>${siteMetadata.email} (${siteMetadata.author})</author>
    ${post.tags ? post.tags.map((tag) => `<category>${escape(tag)}</category>`).join('') : ''}
    ${post.images ? post.images.map((image) => `<image>${escape(image)}</image>`).join('') : ''}
  </item>
`

async function main() {
  const files = await globby(['data/blog/**/*.md', 'data/blog/**/*.mdx'])
  const posts = files
    .map((file) => {
      const source = fs.readFileSync(file, 'utf8')
      const { data } = matter(source)
      return { ...data, slug: normalizeSlug(file) }
    })
    .filter((post) => post.draft !== true && post.date)
    .sort((a, b) => new Date(b.date) - new Date(a.date))

  if (!posts.length) return

  const rss = `
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <title>${escape(siteMetadata.title)}</title>
      <link>${siteMetadata.siteUrl}/blog</link>
      <description>${escape(siteMetadata.description)}</description>
      <language>${siteMetadata.language}</language>
      <managingEditor>${siteMetadata.email} (${siteMetadata.author})</managingEditor>
      <webMaster>${siteMetadata.email} (${siteMetadata.author})</webMaster>
      <lastBuildDate>${new Date(posts[0].date).toUTCString()}</lastBuildDate>
      <atom:link href="${siteMetadata.siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
      ${posts.map(generateRssItem).join('')}
    </channel>
  </rss>
`

  fs.writeFileSync(path.join('public', 'feed.xml'), rss)
}

main()
