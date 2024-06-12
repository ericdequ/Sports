const fs = require('fs')
const globby = require('globby')
const matter = require('gray-matter')
const axios = require('axios')
const dotenv = require('dotenv')

dotenv.config()

const API_KEY = process.env.API_KEY
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow'
const BASE_URL = 'https://www.rics-notebook.com'
const keyLocation = 'https://www.rics-notebook.com/2252e998ff1146cfb763c5b1f9b9a7da.txt'

;(async () => {
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

  const urls = pages
    .map((page) => {
      // Exclude drafts from the submission
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

      return `${BASE_URL}${route}`
    })
    .filter(Boolean)

  try {
    const response = await axios.post(
      INDEXNOW_ENDPOINT,
      {
        host: BASE_URL,
        key: API_KEY,
        keyLocation: keyLocation,
        urlList: urls,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    if (response.status === 200) {
      console.log('URLs submitted to IndexNow successfully.')
    } else {
      console.error('Failed to submit URLs to IndexNow.')
    }
  } catch (error) {
    console.error('Error submitting URLs to IndexNow:', error.message)
  }
})()
