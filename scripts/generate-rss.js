const { generateFeeds } = require('./publication-io.cjs')

try {
  const result = generateFeeds()
  console.log(`Generated ${result.feeds} RSS feeds from ${result.posts} public posts`)
} catch (error) {
  console.error(error)
  process.exitCode = 1
}
