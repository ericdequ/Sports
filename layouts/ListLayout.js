import { motion } from 'framer-motion'
import Link from '@/components/Link'
import Tag from '@/components/Tag'
import { useState } from 'react'
import Pagination from '@/components/Pagination'
import formatDate from '@/lib/utils/formatDate'
import Image from 'next/image'

export default function ListLayout({ posts, title, initialDisplayPosts = [], pagination }) {
  const [searchValue, setSearchValue] = useState('')
  const filteredBlogPosts = posts.filter((frontMatter) => {
    const searchContent = frontMatter.title + frontMatter.summary + frontMatter.tags.join(' ')
    return searchContent.toLowerCase().includes(searchValue.toLowerCase())
  })

  const displayPosts =
    initialDisplayPosts.length > 0 && !searchValue ? initialDisplayPosts : filteredBlogPosts

  return (
    <>
      <div className="divide-y divide-primary-300 dark:divide-primary-700 overflow-x-hidden overflow-y-hidden">
        <motion.div
          className="space-y-6 pt-6 pb-8 md:space-y-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className="text-4xl font-extrabold leading-10 tracking-tight text-primary-900 dark:text-primary-100 sm:text-5xl sm:leading-12 md:text-6xl md:leading-14">
            {title}
          </h1>
          <div className="relative max-w-lg mx-auto">
            <label htmlFor="search" className="sr-only">
              Search articles
            </label>
            <input
              id="search"
              type="text"
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search articles"
              className="block w-full rounded-md border border-primary-300 bg-white px-4 py-2 text-primary-900 focus:border-primary-500 focus:ring-primary-500 dark:border-primary-700 dark:bg-primary-500 dark:text-primary-100"
            />
            <svg
              className="absolute right-3 top-3 h-5 w-5 text-primary-400 dark:text-primary-300"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </motion.div>
        <motion.ul
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          initial="hidden"
          animate="visible"
        >
          {!filteredBlogPosts.length && (
            <p className="py-4 text-center text-primary-500 dark:text-primary-400">
              No posts found.
            </p>
          )}
          {displayPosts.map((frontMatter) => {
            const { slug, date, title, summary, tags, images } = frontMatter
            const firstImage = images && images.length > 0 ? images[0] : null
            return (
              <motion.li
                key={slug}
                className="py-6"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <Link href={`/blog/${slug}`}>
                  <article
                    className="relative p-6 border border-primary-300 dark:border-primary-700 rounded-lg shadow-sm hover:shadow-md hover:border-primary-500 dark:hover:border-primary-500 transition duration-200"
                    style={{
                      backgroundImage: `url(${firstImage})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center">
                      <div className="flex-grow">
                        <dl>
                          <dt className="sr-only">Published on</dt>
                          <dd className="text-base font-medium leading-6 text-white">
                            <time dateTime={date}>{formatDate(date)}</time>
                          </dd>
                        </dl>
                        <div className="space-y-3">
                          <h3 className="text-2xl font-bold leading-8 tracking-tight text-white">
                            <Link
                              href={`/blog/${slug}`}
                              className="hover:underline transition duration-200"
                            >
                              {title}
                            </Link>
                          </h3>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {tags.map((tag) => (
                              <Tag key={tag} text={tag} className="bg-white text-primary-900" />
                            ))}
                          </div>
                          <Link href={`/blog/${slug}`} className="block mt-2">
                            <div className="prose max-w-none text-white">{summary}</div>
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-black opacity-50 rounded-lg"></div>
                  </article>
                </Link>
              </motion.li>
            )
          })}
        </motion.ul>
      </div>
      {pagination && pagination.totalPages > 1 && !searchValue && (
        <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
      )}
    </>
  )
}
