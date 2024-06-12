import { TagSEO } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import ListLayout from '@/layouts/ListLayout'
import generateRss from '@/lib/generate-rss'
import { getAllFilesFrontMatter } from '@/lib/mdx'
import { getAllTags } from '@/lib/tags'
import kebabCase from '@/lib/utils/kebabCase'
import fs from 'fs'
import path from 'path'
import { motion } from 'framer-motion'


const root = process.cwd()

export async function getStaticPaths() {
  const tags = await getAllTags('blog')
  return {
    paths: Object.keys(tags).map((tag) => ({
      params: {
        tag,
      },
    })),
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  try {
    const allPosts = await getAllFilesFrontMatter('blog')
    const filteredPosts = allPosts.filter(
      (post) => post.draft !== true && post.tags.map((t) => kebabCase(t)).includes(params.tag)
    )

    // rss
    if (filteredPosts.length > 0) {
      const rss = generateRss(filteredPosts, `tags/${params.tag}/feed.xml`)
      const rssPath = path.join(root, 'public', 'tags', params.tag)
      fs.mkdirSync(rssPath, { recursive: true })
      fs.writeFileSync(path.join(rssPath, 'feed.xml'), rss)
    }

    return { props: { posts: filteredPosts, tag: params.tag } }
  } catch (error) {
    console.error(`Error in getStaticProps for tag ${params.tag}:`, error)
    return { notFound: true }
  }
}

export default function Tag({ posts, tag }) {
  if (!tag) {
    return <div>Tag not found</div>
  }

  // Capitalize first letter and convert space to dash
  const title = tag[0].toUpperCase() + tag.split(' ').join('-').slice(1)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const postVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeInOut',
      },
    },
  }

  return (
    <>
      <TagSEO
        title={`${tag} - ${siteMetadata.author}`}
        description={`${tag} tags - ${siteMetadata.author}`}
      />
      <motion.div
        className="divide-y divide-gray-200 dark:divide-gray-700 overflow-x-hidden overflow-y-hidden"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        
      >
        
        <ListLayout
          posts={posts}
          title={title}
          variants={postVariants}
          initial="hidden"
          animate="visible"
        />
      </motion.div>
    </>
  )
}