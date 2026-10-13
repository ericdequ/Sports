'use strict'

// Canonical publication rules. Satellite copies are synchronized by
// scripts/sync-publication.mjs; keep site metadata and presentation local.
const escapeXml = (value) =>
  String(value ?? '')
    // XML 1.0 forbids these code points; matching them here is intentional sanitation.
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\ufffe\uffff]/g, '')
    .replace(
      /[&<>"']/g,
      (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[char])
    )

function dateTime(value) {
  if (value instanceof Date) return value.getTime()
  if (
    typeof value !== 'string' ||
    !/^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2}))?$/.test(value)
  )
    return NaN
  const calendar = value.slice(0, 10)
  const midnight = Date.parse(`${calendar}T00:00:00Z`)
  if (!Number.isFinite(midnight) || new Date(midnight).toISOString().slice(0, 10) !== calendar)
    return NaN
  if (
    value.length > 10 &&
    (Number(value.slice(11, 13)) > 23 ||
      Number(value.slice(14, 16)) > 59 ||
      Number(value.slice(17, 19)) > 59)
  )
    return NaN
  return Date.parse(value)
}

// Preserve the existing corpus' JavaScript date interpretation. Strict
// calendar/time-zone validation is reserved for explicit publishAt scheduling;
// the authoring validator separately enforces real YYYY-MM-DD dates for new posts.
function publicationDateTime(value) {
  if (!(value instanceof Date) && typeof value !== 'string') return NaN
  return new Date(value).getTime()
}

function isPublicPost(post, now = Date.now()) {
  return Boolean(
    post &&
      (post.draft === false || post.draft === undefined) &&
      Number.isFinite(publicationDateTime(post.date)) &&
      (post.publishAt === undefined ||
        (Number.isFinite(dateTime(post.publishAt)) && dateTime(post.publishAt) <= now))
  )
}

function selectPublicPosts(posts, now = Date.now()) {
  const seen = new Set()
  return posts
    .filter((post) => {
      if (post.draft === true) return false
      if (post.draft !== undefined && typeof post.draft !== 'boolean') {
        throw new Error(`Ambiguous draft flag: ${post.slug || '<unknown>'}`)
      }
      if (!Number.isFinite(publicationDateTime(post.date)))
        throw new Error(`Invalid publication date: ${post.slug || '<unknown>'}`)
      if (post.publishAt !== undefined && !Number.isFinite(dateTime(post.publishAt)))
        throw new Error(`Invalid publishAt: ${post.slug || '<unknown>'}`)
      if (!isPublicPost(post, now)) return false
      if (typeof post.title !== 'string' || !post.title.trim())
        throw new Error(`Missing public title: ${post.slug}`)
      if (
        typeof post.slug !== 'string' ||
        !post.slug ||
        // Reject control characters in source slugs before building URLs.
        // eslint-disable-next-line no-control-regex
        /[\\?#\u0000-\u001f]/.test(post.slug) ||
        post.slug.split('/').some((part) => !part || part === '.' || part === '..')
      ) {
        throw new Error('Invalid public post slug')
      }
      if (seen.has(post.slug)) throw new Error(`Duplicate public slug: ${post.slug}`)
      seen.add(post.slug)
      return true
    })
    .sort(
      (a, b) =>
        publicationDateTime(b.date) - publicationDateTime(a.date) || a.slug.localeCompare(b.slug)
    )
}

function siteBase(siteMetadata) {
  const url = new URL(siteMetadata.siteUrl)
  if (
    !['http:', 'https:'].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.search ||
    url.hash
  ) {
    throw new Error('Expected a public HTTP(S) site URL')
  }
  return url.href.replace(/\/$/, '')
}

function articleUrl(post, siteMetadata) {
  return `${siteBase(siteMetadata)}/blog/${post.slug.split('/').map(encodeURIComponent).join('/')}`
}

function generateRssItem(post, siteMetadata) {
  const url = escapeXml(articleUrl(post, siteMetadata))
  const images = (Array.isArray(post.images) ? post.images : post.images ? [post.images] : [])
    .map((image) => {
      try {
        const url = new URL(image, `${siteBase(siteMetadata)}/`)
        return ['http:', 'https:'].includes(url.protocol) ? url.href : null
      } catch {
        return null
      }
    })
    .filter(Boolean)
  return `<item>
<guid isPermaLink="true">${url}</guid>
<title>${escapeXml(post.title)}</title>
<link>${url}</link>
${post.summary ? `<description>${escapeXml(post.summary)}</description>` : ''}
<pubDate>${new Date(publicationDateTime(post.date)).toUTCString()}</pubDate>
<author>${escapeXml(`${siteMetadata.email || ''} (${siteMetadata.author || ''})`)}</author>
${(Array.isArray(post.tags) ? post.tags : [])
  .map((tag) => `<category>${escapeXml(tag)}</category>`)
  .join('')}
${images.map((image) => `<image>${escapeXml(image)}</image>`).join('')}
</item>`
}

function generateRss(input, siteMetadata, page = 'feed.xml', { now = Date.now() } = {}) {
  const posts = selectPublicPosts(input, now)
  const base = siteBase(siteMetadata)
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel>
<title>${escapeXml(siteMetadata.title)}</title>
<link>${escapeXml(`${base}/blog`)}</link>
<description>${escapeXml(siteMetadata.description)}</description>
<language>${escapeXml(siteMetadata.language || 'en')}</language>
<managingEditor>${escapeXml(
    `${siteMetadata.email || ''} (${siteMetadata.author || ''})`
  )}</managingEditor>
${
  posts.length
    ? `<lastBuildDate>${new Date(publicationDateTime(posts[0].date)).toUTCString()}</lastBuildDate>`
    : ''
}
<atom:link href="${escapeXml(`${base}/${page}`)}" rel="self" type="application/rss+xml"/>
${posts.map((post) => generateRssItem(post, siteMetadata)).join('\n')}
</channel></rss>\n`
}

function normalizeUrl(value) {
  const url = new URL(value)
  url.pathname = url.pathname
    .split('/')
    .map((part) => encodeURIComponent(decodeURIComponent(part)))
    .join('/')
  return url.href
}

function compareUrlInventory(expected, actual) {
  const want = new Set(expected.map(normalizeUrl))
  const normalized = actual.map(normalizeUrl)
  const have = new Set(normalized)
  const missing = [...want].filter((url) => !have.has(url)).sort()
  const unexpected = [...have].filter((url) => !want.has(url)).sort()
  const duplicates = normalized.filter((url, index) => normalized.indexOf(url) !== index)
  return {
    valid: !missing.length && !unexpected.length && !duplicates.length,
    missing,
    unexpected,
    duplicates,
  }
}

module.exports = {
  articleUrl,
  compareUrlInventory,
  dateTime,
  escapeXml,
  generateRss,
  generateRssItem,
  isPublicPost,
  selectPublicPosts,
}
