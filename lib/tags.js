import { getAllFilesFrontMatter } from './mdx'
import kebabCase from './utils/kebabCase'

export async function getAllTags(type) {
  const posts = await getAllFilesFrontMatter(type)
  const tagCount = {}
  for (const post of posts) {
    for (const tag of Array.isArray(post.tags) ? post.tags : []) {
      const key = kebabCase(tag)
      tagCount[key] = (tagCount[key] || 0) + 1
    }
  }
  return tagCount
}
