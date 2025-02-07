
// pages/api/feed/tag/[tag].js
export default async function handler(req, res) {
    if (req.method !== 'GET') {
      return res.status(405).json({ message: 'Method not allowed' })
    }
  
    try {
      const { tag } = req.query
      if (!tag) {
        return res.status(400).json({ error: 'Tag parameter is required' })
      }
  
      const posts = await getAllPosts()
      const filteredPosts = posts.filter(post => 
        post.tags && post.tags.includes(tag)
      )
  
      if (filteredPosts.length === 0) {
        return res.status(404).json({ error: 'No posts found for this tag' })
      }
  
      const rss = generateRss(filteredPosts, `feed/tag/${tag}.xml`)
      
      res.setHeader('Content-Type', 'application/xml')
      res.setHeader('Cache-Control', 'public, s-maxage=1200, stale-while-revalidate=600')
      return res.status(200).send(rss)
    } catch (error) {
      console.error('Error generating tag-specific RSS feed:', error)
      return res.status(500).json({ error: 'Error generating feed' })
    }
  }
  