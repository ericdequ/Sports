import siteMetadata from '@/data/siteMetadata'
import publication from './publication.cjs'

export default function generateRss(posts, page = 'feed.xml') {
  return publication.generateRss(posts, siteMetadata, page)
}
