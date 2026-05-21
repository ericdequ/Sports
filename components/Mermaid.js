import { useEffect, useId, useRef, useState } from 'react'
import { useTheme } from 'next-themes'

const Mermaid = ({ chart }) => {
  const id = useId().replace(/:/g, '')
  const ref = useRef(null)
  const { resolvedTheme } = useTheme()
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    const renderChart = async () => {
      if (!ref.current || !chart) return

      try {
        setError('')
        const mermaid = (await import('mermaid')).default
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: 'strict',
          theme: resolvedTheme === 'dark' ? 'dark' : 'default',
        })

        const { svg } = await mermaid.render(`mermaid-${id}`, chart)
        if (active && ref.current) {
          ref.current.innerHTML = svg
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : 'Unable to render Mermaid diagram')
        }
      }
    }

    renderChart()

    return () => {
      active = false
    }
  }, [chart, id, resolvedTheme])

  if (error) {
    return (
      <pre className="my-6 overflow-x-auto rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
        {error}
      </pre>
    )
  }

  return (
    <div className="mermaid-diagram my-8 overflow-x-auto rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <div ref={ref} className="flex min-w-full justify-center" />
    </div>
  )
}

export default Mermaid
