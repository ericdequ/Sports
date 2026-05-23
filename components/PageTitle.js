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
      initial={false}
      animate="visible"
      className="overflow-hidden text-balance text-3xl font-black leading-tight text-gray-950 dark:text-white sm:text-4xl md:text-5xl xl:text-6xl"
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
