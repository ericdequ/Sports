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
      <div className="divide-y divide-primary-200 dark:divide-primary-700">
        <motion.div
          className="space-y-2 pt-6 pb-8 md:space-y-5 overflow-x-hidden overflow-y-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-primary-900 dark:text-primary-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            Latest
          </h1>
          <p className="text-lg leading-7 text-secondary-500 dark:text-secondary-400">
            {siteMetadata.description}
          </p>
        </motion.div>
        <motion.ul
          className="divide-y divide-primary-200 dark:divide-primary-700"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {!posts.length && (
            <p className="py-12 text-center text-secondary-500 dark:text-secondary-400">
              No posts found.
            </p>
          )}
          {posts.slice(0, MAX_DISPLAY).map((frontMatter) => {
            const { slug, date, title, summary, tags } = frontMatter
            return (
              <motion.li key={slug} className="py-12" variants={postVariants}>
                <article>
                  <div className="space-y-2 xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0">
                    <dl>
                      <dt className="sr-only">Published on</dt>
                      <dd className="text-base font-medium leading-6 text-secondary-500 dark:text-secondary-400">
                        <time dateTime={date}>{formatDate(date)}</time>
                      </dd>
                    </dl>
                    <div className="space-y-5 xl:col-span-3">
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-2xl font-bold leading-8 tracking-tight  mb-3 my-3">
                            <Link
                              href={`/blog/${slug}`}
                              className="text-primary-800 dark:text-primary-100 hover:text-primary-600 dark:hover:text-primary-200"
                            >
                              {title}
                            </Link>
                          </h2>
                          <div className="flex flex-wrap">
                            {tags &&
                              Array.isArray(tags) &&
                              tags.map((tag) => (
                                <Tag key={tag} text={tag} className="animate-magical-fade" />
                              ))}
                          </div>
                        </div>
                        <div className="prose max-w-none text-secondary-500 dark:text-secondary-400">
                        <Link
                              href={`/blog/${slug}`}
                              className=""
                            >
                          {summary}
                          </Link>
                        </div>
                      </div>
                      <div className="text-base font-medium leading-6">
                        <Link
                          href={`/blog/${slug}`}
                          className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 animate-magical-fade"
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Link
            href="/blog"
            className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 "
            aria-label="View all posts"
          >
            All Posts &rarr;
          </Link>
        </motion.div>
      )}
      {siteMetadata.newsletter.provider !== '' && (
        <motion.div
          className="flex items-center justify-center pt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {/* Newsletter component */}
        </motion.div>
      )}
    </>
  )
}
