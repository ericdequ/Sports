import Link from '@/components/Link'
import { PageSEO } from '@/components/SEO'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import { getAllTags } from '@/lib/tags'
import kebabCase from '@/lib/utils/kebabCase'
import { motion } from 'framer-motion'

export async function getStaticProps() {
  let tags = {}
  try {
    tags = await getAllTags('blog')
  } catch (error) {
    console.error('Error in getStaticProps for tags:', error)
  }
  return { props: { tags } }
}

export default function Tags({ tags }) {
  const sortedTags = Object.keys(tags).sort((a, b) => tags[b] - tags[a])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const tagVariants = {
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
      <PageSEO title={`Tags - ${siteMetadata.title}`} description={siteMetadata.description} />
      <motion.div
        className="mx-auto max-w-3xl overflow-hidden px-4 sm:px-6 xl:max-w-5xl xl:px-0"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-primary-900 dark:text-primary-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            Tags
          </h1>
        </div>
        <motion.div
          className="flex flex-wrap"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {Object.keys(tags).length === 0 && (
            <p className="text-lg text-secondary-500 dark:text-secondary-400">No tags found.</p>
          )}
          {sortedTags.map((t) => {
            const tagSlug = kebabCase(t)
            return (
              <motion.div
                key={tagSlug}
                className="m-2 flex items-center rounded-full bg-primary-100 px-4 py-2 dark:bg-primary-800"
                variants={tagVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href={`/tags/${tagSlug}`} passHref>
                  <motion.a
                    className="mr-2 text-lg font-semibold uppercase text-primary-800 dark:text-primary-200"
                    aria-label={`View posts tagged with ${t}`}
                  >
                    {t}
                  </motion.a>
                </Link>
                <span className="rounded-full bg-primary-200 px-2 py-1 text-xs font-semibold uppercase text-primary-800 dark:bg-primary-700 dark:text-primary-200">
                  {tags[t]}
                </span>
              </motion.div>
            )
          })}
        </motion.div>
      </motion.div>
    </>
  )
}
