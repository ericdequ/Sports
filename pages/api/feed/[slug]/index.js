import { NextResponse } from 'next/server'
import generateRss from '@/lib/generate-rss'
import { getAllPosts } from '@/lib/posts' // Assuming you have this utility


export async function GET() {
    try {
      const posts = await getAllPosts()
      const rss = generateRss(posts)
      
      return new NextResponse(rss, {
        headers: {
          'Content-Type': 'application/xml',
          'Cache-Control': 'public, s-maxage=1200, stale-while-revalidate=600'
        }
      })
    } catch (error) {
      console.error('Error generating RSS feed:', error)
      return new NextResponse('Error generating feed', { status: 500 })
    }
  }