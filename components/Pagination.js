import { motion } from 'framer-motion'
import Link from '@/components/Link'

export default function Pagination({ totalPages, currentPage }) {
  const prevPage = parseInt(currentPage) - 1 > 0
  const nextPage = parseInt(currentPage) + 1 <= parseInt(totalPages)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-2 pt-6 pb-8 md:space-y-5"
    >
      <nav className="flex items-center justify-between">
        {!prevPage ? (
          <button
            rel="previous"
            className="cursor-not-allowed rounded-md px-4 py-2 text-sm font-medium text-gray-500 transition-colors duration-200 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 disabled:opacity-50"
            disabled={!prevPage}
          >
            Previous
          </button>
        ) : (
          <Link href={currentPage - 1 === 1 ? `/blog/` : `/blog/page/${currentPage - 1}`}>
            <motion.button
              rel="previous"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              Previous
            </motion.button>
          </Link>
        )}
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-sm text-gray-700 dark:text-gray-200"
        >
          Page {currentPage} of {totalPages}
        </motion.span>
        {!nextPage ? (
          <button
            rel="next"
            className="cursor-not-allowed rounded-md px-4 py-2 text-sm font-medium text-gray-500 transition-colors duration-200 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 disabled:opacity-50"
            disabled={!nextPage}
          >
            Next
          </button>
        ) : (
          <Link href={`/blog/page/${currentPage + 1}`}>
            <motion.button
              rel="next"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              Next
            </motion.button>
          </Link>
        )}
      </nav>
    </motion.div>
  )
}
