import Link from '@/components/Link'
import { PageSEO } from '@/components/SEO'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import { getAllFilesFrontMatter } from '@/lib/mdx'
import formatDate from '@/lib/utils/formatDate'

import { motion } from 'framer-motion'

const MAX_DISPLAY = 5

export async function getStaticProps() {
  const posts = await getAllFilesFrontMatter('blog')
  return { props: { posts } }
}

export default function Home({ posts }) {
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
      <PageSEO title={siteMetadata.title} description={siteMetadata.description} />
      <div>
        <motion.div
          className="home-hero"
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="hero-eyebrow">Latest field notes</p>
          <h1 className="hero-title">
            {siteMetadata.title}
          </h1>
          <p className="hero-copy">
            {siteMetadata.description}
          </p>
        </motion.div>
        <motion.ul
          className="post-list"
          variants={containerVariants}
          initial={false}
          animate="visible"
        >
          {!posts.length && 'No posts found.'}
          {posts.slice(0, MAX_DISPLAY).map((frontMatter) => {
            const { slug, date, title, summary, tags } = frontMatter
            return (
              <motion.li key={slug} variants={postVariants}>
                <article className="home-post-card">
                  <div className="space-y-5 md:grid md:grid-cols-4 md:gap-8 md:space-y-0">
                    <dl className="md:pt-1">
                      <dt className="sr-only">Published on</dt>
                      <dd className="meta-date">
                        <time dateTime={date}>{formatDate(date)}</time>
                      </dd>
                    </dl>
                    <div className="space-y-5 md:col-span-3">
                      <div className="space-y-4">
                        <div>
                          <h2 className="text-2xl font-black leading-tight sm:text-3xl">
                            <Link
                              href={`/blog/${slug}`}
                              className="text-gray-950 transition-colors hover:text-[var(--theme-accent)] dark:text-white"
                            >
                              {title}
                            </Link>
                          </h2>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {tags &&
                              Array.isArray(tags) &&
                              tags.map((tag) => <Tag key={tag} text={tag} />)}
                          </div>
                        </div>
                        <div className="max-w-none text-base leading-8 text-gray-600 dark:text-gray-300">
                          {summary}
                        </div>
                      </div>
                      <div>
                        <Link
                          href={`/blog/${slug}`}
                          className="read-link"
                          aria-label={`Read "${title}"`}
                        >
                          Read more &rarr;
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              </motion.li>
            )
          })}
        </motion.ul>
      </div>
      {posts.length > MAX_DISPLAY && (
        <motion.div
          className="flex justify-end text-base font-medium leading-6"
          initial={false}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Link
            href="/blog"
            className="read-link"
            aria-label="all posts"
          >
            All Posts &rarr;
          </Link>
        </motion.div>
      )}
      {siteMetadata.newsletter.provider !== '' && (
        <motion.div
          className="flex items-center justify-center pt-4"
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          

        </motion.div>
      )}
    </>
  )
}
