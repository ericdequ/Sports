import { motion } from 'framer-motion'
import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Link from './Link'
import SectionContainer from './SectionContainer'

import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import Image from 'next/image'

const Logo = '/logoo-removebg.png'

const LayoutWrapper = ({ children }) => {
  return (
    <SectionContainer>
      <div className="flex min-h-screen flex-col justify-between">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between py-10"
        >
          <div>
            <Link href="/" aria-label={siteMetadata.headerTitle}>
              <div className="flex items-center justify-between">
                <div className="mr-3">
                  <Image
                    src={Logo}
                    alt="Logo"
                    width={270}
                    height={270}
                    className="rounded-full shadow-md"
                  />
                </div>
                {typeof siteMetadata.headerTitle === 'string' ? (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="hidden h-6 text-2xl font-semibold sm:block"
                  >
                    {siteMetadata.headerTitle}
                  </motion.div>
                ) : (
                  siteMetadata.headerTitle
                )}
              </div>
            </Link>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center text-base leading-5"
          >
            <div className="hidden sm:block">
              {headerNavLinks.map((link) => (
                <motion.div
                  key={link.title}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="inline-block"
                >
                  <Link
                    href={link.href}
                    className="p-1 font-medium text-gray-900 dark:text-gray-100 sm:p-4 hover:text-primary-500 dark:hover:text-primary-400 transition-colors duration-200"
                  >
                    {link.title}
                  </Link>
                </motion.div>
              ))}
            </div>
            <ThemeSwitch />
            <MobileNav />
          </motion.div>
        </motion.header>
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-auto"
        >
          {children}
        </motion.main>
      </div>
    </SectionContainer>
  )
}

export default LayoutWrapper
