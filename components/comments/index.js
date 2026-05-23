import siteMetadata from '@/data/siteMetadata'
import dynamic from 'next/dynamic'

const UtterancesComponent = dynamic(
  () => {
    return import('@/components/comments/Utterances')
  },
  { ssr: false }
)
const GiscusComponent = dynamic(
  () => {
    return import('@/components/comments/Giscus')
  },
  { ssr: false }
)
const DisqusComponent = dynamic(
  () => {
    return import('@/components/comments/Disqus')
  },
  { ssr: false }
)

const hasValue = (value) => typeof value === 'string' && value.trim().length > 0

const Comments = ({ frontMatter }) => {
  const comment = siteMetadata?.comment
  if (!comment || Object.keys(comment).length === 0) return <></>

  const giscusConfig = comment.giscusConfig || {}
  const utterancesConfig = comment.utterancesConfig || {}
  const hasGiscusConfig =
    hasValue(giscusConfig.repo) &&
    hasValue(giscusConfig.repositoryId) &&
    hasValue(giscusConfig.category) &&
    hasValue(giscusConfig.categoryId)
  const hasUtterancesConfig =
    hasValue(utterancesConfig.repo) && hasValue(utterancesConfig.issueTerm)
  const provider = comment.provider

  return (
    <div id="comment">
      {provider === 'giscus' && hasGiscusConfig && <GiscusComponent />}
      {((provider === 'giscus' && !hasGiscusConfig && hasUtterancesConfig) ||
        (provider === 'utterances' && hasUtterancesConfig)) && <UtterancesComponent />}
      {provider === 'disqus' && <DisqusComponent frontMatter={frontMatter} />}
    </div>
  )
}

export default Comments
