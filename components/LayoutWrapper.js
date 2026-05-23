import { motion } from 'framer-motion'
import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Link from './Link'
import SectionContainer from './SectionContainer'

import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import Image from 'next/image'

const Logo = siteMetadata.siteLogo ? '/' + siteMetadata.siteLogo : '/logoo.webp'

const LayoutWrapper = ({ children }) => {
  return (
    <SectionContainer>
      <div className="flex min-h-screen flex-col justify-between">
        <motion.header
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="site-header"
        >
          <div className="min-w-0">
            <Link href="/" aria-label={siteMetadata.headerTitle}>
              <div className="flex min-w-0 items-center">
                <div className="brand-mark">
                  <Image
                    src={Logo}
                    alt="Logo"
                    width={72}
                    height={72}
                    className="h-full w-full object-contain"
                    priority
                  />
                </div>
                {typeof siteMetadata.headerTitle === 'string' ? (
                  <motion.div
                    initial={false}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="hidden min-w-0 text-base font-black leading-tight text-gray-950 dark:text-white sm:block md:text-xl"
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
            initial={false}
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
                  <Link href={link.href} className="nav-link">
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
          initial={false}
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
