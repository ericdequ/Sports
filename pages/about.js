import { motion } from 'framer-motion';
import { MDXLayoutRenderer } from '@/components/MDXComponents';
import { getFileBySlug } from '@/lib/mdx';
import { PageSEO } from '@/components/SEO';

const DEFAULT_LAYOUT = 'AuthorLayout';

export async function getStaticProps() {
  const authorDetails = await getFileBySlug('authors', ['default']);
  return {
    props: {
      authorDetails,
    },
  };
}

export default function About({ authorDetails }) {
  const { mdxSource, frontMatter } = authorDetails;

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    enter: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeInOut' } },
    exit: { opacity: 0, y: 20, transition: { duration: 0.5, ease: 'easeInOut' } },
  };

  return (
    <>
    <PageSEO
    title={`About - Eric deQuevedo`}
    description={`Founder & Quantum Cyber Solutions`}
  />
    <motion.div
      initial="initial"
      animate="enter"
      exit="exit"
      variants={pageVariants}
    >
      <MDXLayoutRenderer
        layout={frontMatter.layout || DEFAULT_LAYOUT}
        mdxSource={mdxSource}
        frontMatter={frontMatter}
      />
    </motion.div>
    </>
  );
}