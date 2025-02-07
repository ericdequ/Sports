import { NextResponse } from 'next/server'
import generateRss from '@/lib/generate-rss'
import { getAllPosts } from '@/lib/posts' // Assuming you have this utility


export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const posts = await getAllPosts()
    const rss = generateRss(posts)
    
    res.setHeader('Content-Type', 'application/xml')
    res.setHeader('Cache-Control', 'public, s-maxage=1200, stale-while-revalidate=600')
    return res.status(200).send(rss)
  } catch (error) {
    console.error('Error generating RSS feed:', error)
    return res.status(500).json({ error: 'Error generating feed' })
  }
}