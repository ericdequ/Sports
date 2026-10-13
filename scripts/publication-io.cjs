'use strict'
const fs = require('node:fs')
const path = require('node:path')
const matter = require('gray-matter')
const yaml = require('js-yaml')
const datePreservingSchema = yaml.DEFAULT_SCHEMA.extend({
  implicit: [
    new yaml.Type('tag:yaml.org,2002:timestamp', {
      kind: 'scalar',
      resolve: yaml.types.timestamp.resolve,
      construct: (value) => value,
    }),
  ],
})
const { slug: tagSlug } = require('github-slugger')
const publication = require('../lib/publication.cjs')

function walk(directory) {
  if (fs.lstatSync(directory).isSymbolicLink())
    throw new Error(`Refusing publication through symlink: ${directory}`)
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name)
    if (entry.isSymbolicLink()) throw new Error(`Refusing publication through symlink: ${file}`)
    return entry.isDirectory() ? walk(file) : [file]
  })
}

function readPosts(root = process.cwd()) {
  const contentRoot = path.join(root, 'data/blog')
  return walk(contentRoot)
    .filter((file) => /\.mdx?$/.test(file))
    .map((file) => {
      const { data } = matter(fs.readFileSync(file, 'utf8'), {
        engines: { yaml: (header) => yaml.load(header, { schema: datePreservingSchema }) },
      })
      return {
        ...data,
        slug: path
          .relative(contentRoot, file)
          .replace(/\\/g, '/')
          .replace(/\.mdx?$/, ''),
      }
    })
}

function atomicWrite(file, contents) {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  const temporary = `${file}.tmp-${process.pid}`
  try {
    fs.writeFileSync(temporary, contents)
    fs.renameSync(temporary, file)
  } finally {
    if (fs.existsSync(temporary)) fs.unlinkSync(temporary)
  }
}

function readExpectedFeeds(root = process.cwd(), now = Date.now()) {
  for (const directory of ['data', 'public']) {
    const target = path.join(root, directory)
    if (fs.existsSync(target) && fs.lstatSync(target).isSymbolicLink())
      throw new Error(`Refusing publication through symlink: ${target}`)
  }
  const site = require(path.join(root, 'data/siteMetadata.js'))
  const posts = publication.selectPublicPosts(readPosts(root), now)
  const feeds = new Map([['feed.xml', publication.generateRss(posts, site, 'feed.xml', { now })]])
  const tags = new Map()
  for (const post of posts) {
    for (const tag of new Set(
      (Array.isArray(post.tags) ? post.tags : []).map((tag) => tagSlug(tag))
    )) {
      if (!tag || tag === '.' || tag === '..' || /[\\/]/.test(tag))
        throw new Error('Invalid RSS tag slug')
      if (!tags.has(tag)) tags.set(tag, [])
      tags.get(tag).push(post)
    }
  }
  for (const [tag, taggedPosts] of tags) {
    const file = `tags/${tag}/feed.xml`
    feeds.set(file, publication.generateRss(taggedPosts, site, file, { now }))
  }
  // Keep old feed endpoints valid but empty after their last public post is
  // withdrawn. Never leave a stale draft in a previously generated tag feed.
  const tagRoot = path.join(root, 'public/tags')
  if (fs.existsSync(tagRoot)) {
    for (const file of walk(tagRoot).filter((file) => path.basename(file) === 'feed.xml')) {
      const relative = path.relative(path.join(root, 'public'), file).replace(/\\/g, '/')
      if (!feeds.has(relative))
        feeds.set(relative, publication.generateRss([], site, relative, { now }))
    }
  }
  return { posts, feeds }
}

function generateFeeds(root = process.cwd(), now = Date.now()) {
  const { posts, feeds } = readExpectedFeeds(root, now)
  for (const [file, xml] of feeds) atomicWrite(path.join(root, 'public', file), xml)
  return { posts: posts.length, feeds: feeds.size }
}

module.exports = { atomicWrite, generateFeeds, readExpectedFeeds, readPosts }
