import dynamic from 'next/dynamic'
import { PageSEO } from '@/components/SEO'
import mapData from '@/data/mapData'

// MapExplorer is client-only (it loads MapLibre from the browser at runtime).
const MapExplorer = dynamic(() => import('@/components/MapExplorer'), {
  ssr: false,
  loading: () => (
    <div className="flex h-[65vh] items-center justify-center text-sm text-gray-500">
      Loading map…
    </div>
  ),
})

export default function MapPage() {
  const { meta } = mapData
  return (
    <>
      <PageSEO title={meta.title} description={meta.subtitle} />
      <div className="py-8">
        <div className="mb-6 space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
            {meta.title}
          </h1>
          <p className="max-w-3xl text-gray-600 dark:text-gray-400">{meta.subtitle}</p>
        </div>
        <MapExplorer data={mapData} />
        {meta.attribution && <p className="mt-4 text-xs text-gray-400">{meta.attribution}</p>}
      </div>
    </>
  )
}
