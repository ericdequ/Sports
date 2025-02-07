// pages/api/tags/index.js
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { tag } = req.query
    const posts = await getAllPosts()
    
    // If no tag is provided, return tag counts
    if (!tag) {
      const tagCounts = posts.reduce((acc, post) => {
        if (post.tags) {
          post.tags.forEach(tag => {
            acc[tag] = (acc[tag] || 0) + 1
          })
        }
        return acc
      }, {})
      
      return res.status(200).json({
        tags: Object.entries(tagCounts).map(([tag, count]) => ({
          tag,
          count,
          url: `/api/feed/tag/${encodeURIComponent(tag)}`
        }))
      })
    }
    
    // Filter posts by tag
    const filteredPosts = posts.filter(post => 
      post.tags && post.tags.includes(tag)
    )
    
    return res.status(200).json({
      tag,
      count: filteredPosts.length,
      posts: filteredPosts
    })
  } catch (error) {
    console.error('Error handling tag request:', error)
    return res.status(500).json({ error: 'Error processing request' })
  }
}