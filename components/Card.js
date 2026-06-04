import Image from './Image'
import Link from './Link'

const RepoIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor">
    <path d="M8 0C3.58 0 0 3.64 0 8.49c0 3.74 2.3 6.91 5.47 7.99.4.08.55-.18.55-.4 0-.2-.01-.86-.01-1.56-2.01.39-2.53-.5-2.69-.96-.09-.24-.48-.96-.82-1.16-.28-.16-.68-.55-.01-.56.63-.01 1.08.6 1.23.85.72 1.25 1.87.9 2.33.69.07-.54.28-.9.51-1.11-1.78-.21-3.64-.92-3.64-4.08 0-.9.31-1.64.82-2.22-.08-.21-.36-1.06.08-2.19 0 0 .67-.22 2.2.85A7.38 7.38 0 0 1 8 4.36c.68 0 1.36.09 2 .27 1.53-1.07 2.2-.85 2.2-.85.44 1.13.16 1.98.08 2.19.51.58.82 1.31.82 2.22 0 3.17-1.87 3.87-3.65 4.08.29.26.54.76.54 1.53 0 1.11-.01 2-.01 2.27 0 .22.15.48.55.4A8.38 8.38 0 0 0 16 8.49C16 3.64 12.42 0 8 0Z" />
  </svg>
)

const MAP_STATUS_STYLES = {
  active:
    'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300',
  planned:
    'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900 dark:bg-sky-950/40 dark:text-sky-300',
  requested:
    'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300',
  blocked:
    'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300',
}

const MAP_STATUS_DOT_STYLES = {
  active: 'bg-emerald-500',
  planned: 'bg-sky-500',
  requested: 'bg-amber-500',
  blocked: 'bg-rose-500',
}

const getMapRequestLabel = (request) =>
  request?.label || request?.datasetTitle || request?.datasetId || 'Map data'

const getMapRequestHref = (request) => request?.mapUrl || request?.mapPath || ''

const getMapRequestClassName = (status) =>
  `inline-flex max-w-full items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-bold uppercase leading-none transition hover:-translate-y-0.5 ${
    MAP_STATUS_STYLES[status] || MAP_STATUS_STYLES.requested
  }`

const Card = ({ title, description, imgSrc, href, gitUrl, repoUrl, sourceUrl, mapRequests }) => {
  const projectRepoUrl = gitUrl || repoUrl || sourceUrl
  const visibleMapRequests = Array.isArray(mapRequests) ? mapRequests.slice(0, 3) : []

  return (
    <div className="feature-card">
      {imgSrc && (
        <div className="relative aspect-[16/9] overflow-hidden">
          <Image
            alt={title}
            src={imgSrc}
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-cover object-center"
          />
        </div>
      )}
      <div className="p-5 sm:p-6">
        <h2 className="mb-3 text-xl font-black leading-tight text-gray-950 dark:text-white sm:text-2xl">
          {href ? (
            <Link href={href} aria-label={`Link to ${title}`}>
              {title}
            </Link>
          ) : (
            title
          )}
        </h2>
        <p className="mb-4 text-sm leading-7 text-gray-600 dark:text-gray-300 sm:text-base">
          {description}
        </p>
        {visibleMapRequests.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2" aria-label={`${title} map data links`}>
            {visibleMapRequests.map((request) => {
              const status = request.status || 'requested'
              const label = getMapRequestLabel(request)
              const mapHref = getMapRequestHref(request)
              const className = getMapRequestClassName(status)
              const content = (
                <>
                  <span
                    className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                      MAP_STATUS_DOT_STYLES[status] || MAP_STATUS_DOT_STYLES.requested
                    }`}
                  />
                  <span className="truncate">{label}</span>
                </>
              )

              if (mapHref) {
                return (
                  <Link
                    key={request.id || request.datasetId || label}
                    href={mapHref}
                    title={request.reason || label}
                    className={className}
                  >
                    {content}
                  </Link>
                )
              }

              return (
                <span
                  key={request.id || request.datasetId || label}
                  title={request.reason || label}
                  className={className}
                >
                  {content}
                </span>
              )
            })}
          </div>
        )}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {href && (
            <Link href={href} className="read-link" aria-label={`Link to ${title}`}>
              Learn more &rarr;
            </Link>
          )}
          {projectRepoUrl && (
            <Link
              href={projectRepoUrl}
              className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-gray-950 px-3 py-2 text-xs font-black uppercase tracking-wide text-white shadow-sm transition hover:-translate-y-0.5 hover:border-primary-500 hover:bg-primary-600 dark:border-gray-700 dark:bg-gray-100 dark:text-gray-950 dark:hover:bg-primary-300"
              aria-label={`View source repository for ${title}`}
            >
              <RepoIcon />
              Source
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default Card
