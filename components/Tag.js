import Link from 'next/link'
import kebabCase from '@/lib/utils/kebabCase'
import { motion } from 'framer-motion'

const Tag = ({ text }) => {
  if (!text) {
    return null
  }

  const tagVariants = {
    hover: {
      scale: 1.1,
      transition: {
        duration: 0.2,
        ease: 'easeInOut',
      },
    },
    tap: {
      scale: 0.9,
      transition: {
        duration: 0.2,
        ease: 'easeInOut',
      },
    },
  }

  const textVariants = {
    hover: {
      color: '#4B5563',
      transition: {
        duration: 0.2,
        ease: 'easeInOut',
      },
    },
  }

  const tagSlug = kebabCase(text)

  return (
    <motion.div
      className="inline-block rounded-full bg-gray-200 dark:bg-gray-700 px-4 py-2"
      variants={tagVariants}
      whileHover="hover"
      whileTap="tap"
    >
      <Link href={`/tags/${tagSlug}`} passHref>
        <motion.span
          className="text-lg font-semibold text-gray-800 dark:text-gray-200"
          variants={textVariants}
        >
          {text}
        </motion.span>
      </Link>
    </motion.div>
  )
}

export default Tag
