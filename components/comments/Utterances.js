import React, { useEffect, useCallback } from 'react'
import { useTheme } from 'next-themes'

import siteMetadata from '@/data/siteMetadata'

const COMMENTS_ID = 'comments-container'
const hasValue = (value) => typeof value === 'string' && value.trim().length > 0

const Utterances = () => {
  const { theme, resolvedTheme } = useTheme()
  const config = siteMetadata.comment.utterancesConfig
  const commentsTheme =
    theme === 'dark' || resolvedTheme === 'dark'
      ? config.darkTheme || 'github-dark'
      : config.theme || 'github-light'
  const hasConfig = hasValue(config.repo) && hasValue(config.issueTerm)

  const loadComments = useCallback(() => {
    if (!hasConfig) return

    const comments = document.getElementById(COMMENTS_ID)
    if (!comments) return
    comments.innerHTML = ''

    const script = document.createElement('script')
    script.src = 'https://utteranc.es/client.js'
    script.setAttribute('repo', config.repo)
    script.setAttribute('issue-term', config.issueTerm || 'pathname')
    script.setAttribute('label', config.label || 'comments')
    script.setAttribute('theme', commentsTheme)
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
      <div className="utterances-frame relative" id={COMMENTS_ID} />
    </div>
  )
}

export default Utterances
