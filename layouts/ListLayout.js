import { motion } from 'framer-motion'
import Link from '@/components/Link'
import Tag from '@/components/Tag'
import { useState } from 'react'
import Pagination from '@/components/Pagination'
import formatDate from '@/lib/utils/formatDate'

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
      <div className="overflow-x-hidden overflow-y-hidden">
        <motion.div
          className="archive-hero"
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p className="hero-eyebrow">Archive</p>
          <h1 className="hero-title">{title}</h1>
          <div className="relative mx-auto w-full max-w-xl">
            <label htmlFor="search" className="sr-only">
              Search articles
            </label>
            <input
              id="search"
              type="text"
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search articles"
              className="search-input"
            />
            <svg
              className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
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
          initial={false}
          animate="visible"
        >
          {!filteredBlogPosts.length && (
            <p className="py-8 text-center text-gray-500">No posts found.</p>
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
                <article className="archive-card">
                  {firstImage && (
                    <div
                      className="archive-card-media"
                      style={{ backgroundImage: `url(${firstImage})` }}
                    />
                  )}
                  <div className="archive-card-body">
                    <dl>
                      <dt className="sr-only">Published on</dt>
                      <dd className="meta-date">
                        <time dateTime={date}>{formatDate(date)}</time>
                      </dd>
                    </dl>
                    <h3 className="mt-3 text-2xl font-black leading-tight text-gray-950 dark:text-white">
                      <Link
                        href={`/blog/${slug}`}
                        className="transition-colors hover:text-[var(--theme-accent)]"
                      >
                        {title}
                      </Link>
                    </h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <Tag key={tag} text={tag} />
                      ))}
                    </div>
                    <p className="mt-4 text-base leading-8 text-gray-600 dark:text-gray-300">
                      {summary}
                    </p>
                    <Link href={`/blog/${slug}`} className="read-link mt-5 inline-flex">
                      Read article &rarr;
                    </Link>
                  </div>
                </article>
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
