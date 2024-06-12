const fs = require('fs')
const globby = require('globby')
const matter = require('gray-matter')
const prettier = require('prettier')
const siteMetadata = require('../data/siteMetadata')

;(async () => {
  const prettierConfig = await prettier.resolveConfig('./.prettierrc.js')

  const pages = await globby([
    'pages/*.js',
    'pages/*.tsx',
    'data/blog/**/*.mdx',
    'data/blog/**/*.md',
    'public/tags/**/*.xml',
    '!pages/_*.js',
    '!pages/_*.tsx',
    '!pages/api',
  ])

  const sitemap = `
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${pages
        .map((page) => {
          // Exclude drafts from the sitemap
          if (page.search('.md') >= 1 && fs.existsSync(page)) {
            const source = fs.readFileSync(page, 'utf8')
            const fm = matter(source)
            if (fm.data.draft) {
              return
            }
            if (fm.data.canonicalUrl) {
              return
            }
          }

          const path = page
            .replace('pages/', '/')
            .replace('data/blog', '/blog')
            .replace('public/', '/')
            .replace('.js', '')
            .replace('.tsx', '')
            .replace('.mdx', '')
            .replace('.md', '')
            .replace('/feed.xml', '')

          const route = path === '/index' ? '' : path

          if (page.search('pages/404.') > -1 || page.search(`pages/blog/[...slug].`) > -1) {
            return
          }

          // Get the last modification date of the page
          const stats = fs.statSync(page)
          const lastModified = stats.mtime.toISOString()

          // Set the change frequency and priority based on the page type
          let changefreq = 'monthly'
          let priority = 0.7

          if (page.search('pages/index.') > -1) {
            changefreq = 'daily'
            priority = 1.0
          } else if (page.search('data/blog') > -1) {
            changefreq = 'weekly'
            priority = 0.8
          }

          return `
            <url>
              <loc>${siteMetadata.siteUrl}${route}</loc>
              <lastmod>${lastModified}</lastmod>
              <changefreq>${changefreq}</changefreq>
              <priority>${priority}</priority>
            </url>
          `
        })
        .join('')}
    </urlset>
  `

  const formatted = prettier.format(sitemap, {
    ...prettierConfig,
    parser: 'html',
  })

  // eslint-disable-next-line no-sync
  fs.writeFileSync('public/sitemap.xml', formatted)
})()
