import React, { useEffect, useCallback } from 'react'
import { useTheme } from 'next-themes'

import siteMetadata from '@/data/siteMetadata'

const COMMENTS_ID = 'comments-container'
const hasValue = (value) => typeof value === 'string' && value.trim().length > 0

const Giscus = () => {
  const { theme, resolvedTheme } = useTheme()
  const config = siteMetadata.comment.giscusConfig
  const commentsTheme =
    config.themeURL === ''
      ? theme === 'dark' || resolvedTheme === 'dark'
        ? config.darkTheme
        : config.theme
      : config.themeURL
  const hasConfig =
    hasValue(config.repo) &&
    hasValue(config.repositoryId) &&
    hasValue(config.category) &&
    hasValue(config.categoryId)

  const loadComments = useCallback(() => {
    if (!hasConfig) return

    const comments = document.getElementById(COMMENTS_ID)
    if (!comments) return
    comments.innerHTML = ''

    const script = document.createElement('script')
    script.src = 'https://giscus.app/client.js'
    script.setAttribute('data-repo', config.repo)
    script.setAttribute('data-repo-id', config.repositoryId)
    script.setAttribute('data-category', config.category)
    script.setAttribute('data-category-id', config.categoryId)
    script.setAttribute('data-mapping', config.mapping || 'pathname')
    script.setAttribute('data-reactions-enabled', config.reactions || '1')
    script.setAttribute('data-emit-metadata', config.metadata || '0')
    script.setAttribute('data-input-position', config.inputPosition || 'bottom')
    script.setAttribute('data-lang', config.lang || 'en')
    script.setAttribute('data-theme', commentsTheme)
    script.setAttribute('crossorigin', 'anonymous')
    script.async = true
    comments.appendChild(script)
  }, [commentsTheme, config, hasConfig])

  useEffect(() => {
    loadComments()
    return () => {
      const comments = document.getElementById(COMMENTS_ID)
      if (comments) comments.innerHTML = ''
    }
  }, [loadComments])

  if (!hasConfig) return null

  return (
    <div className="pt-6 pb-6 text-left text-gray-700 dark:text-gray-300">
      <div className="giscus" id={COMMENTS_ID} />
    </div>
  )
}

export default Giscus
