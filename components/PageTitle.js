import { motion } from 'framer-motion'

export default function PageTitle({ children }) {
  const words = typeof children === 'string' ? children.split(' ') : []

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.04 * i },
    }),
  }

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
      },
    },
  }

  const wiggle = {
    x: [0, 1, -1, 1, -1, 0],
    y: [0, 0.5, -0.5, 0.5, -0.5, 0],
    scale: [1, 1.02, 1, 1.02, 1],
    rotate: [0, 0.5, -0.5, 0.5, -0.5, 0],
    transition: {
      duration: 2,
      ease: 'easeInOut',
      loop: Infinity,
    },
  }

  return (
    <motion.h1
      variants={container}
      initial="hidden"
      animate="visible"
      className="text-2xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-3xl sm:leading-10 md:text-4xl md:leading-14 lg:text-5xl lg:leading-none xl:text-6xl overflow-hidden"
    >
      <div className="flex flex-wrap justify-center">
        {words.map((word, index) => (
          <motion.span
            key={`${word}-${index}`}
            variants={child}
            whileHover={wiggle}
            className="mr-2 inline-block whitespace-pre"
            style={{ overflow: 'hidden' }}
          >
            {word}
            {index < words.length - 1 ? '\u00A0' : ''}
          </motion.span>
        ))}
      </div>
    </motion.h1>
  )
}
