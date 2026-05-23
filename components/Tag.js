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

  const tagSlug = kebabCase(text)

  return (
    <motion.div className="tag-chip" variants={tagVariants} whileHover="hover" whileTap="tap">
      <Link href={`/tags/${tagSlug}`} passHref>
        <span>{text}</span>
      </Link>
    </motion.div>
  )
}

export default Tag
