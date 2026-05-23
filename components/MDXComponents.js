/* eslint-disable react/display-name */
import { useMemo } from 'react'
import { getMDXComponent } from 'mdx-bundler/client'
import { motion } from 'framer-motion'
import Image from './Image'
import CustomLink from './Link'
import TOCInline from './TOCInline'
import Pre from './Pre'

export const MDXComponents = {
  Image,
  TOCInline,
  a: CustomLink,
  pre: Pre,
  wrapper: ({ components, layout, ...rest }) => {
    const Layout = require(`../layouts/${layout}`).default
    return (
      <motion.div
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={'overflow-x-hidden·overflow-y-hidden'}
      >
        <Layout {...rest} />
      </motion.div>
    )
  },
}

export const MDXLayoutRenderer = ({ layout, mdxSource, ...rest }) => {
  const MDXLayout = useMemo(() => getMDXComponent(mdxSource), [mdxSource])
  return (
    <motion.div initial={false} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <MDXLayout layout={layout} components={MDXComponents} {...rest} />
    </motion.div>
  )
}
