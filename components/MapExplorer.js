import { useEffect, useMemo, useRef, useState } from 'react'
import { useTheme } from 'next-themes'
import { keyForPoint } from '@/lib/map/tst'

// Self-contained interactive map. Loads MapLibre GL from CDN at runtime so no
// blog needs an extra npm dependency or a Mapbox token. Basemaps are libre /
// fully-free (OpenFreeMap + CARTO, both keyless, OSM data).
//
// Data: pass a bundled fixture via `data`. If `data.meta.endpoint` is set, the
// component fetches LIVE open data from that same-origin API route (using the
// current map viewport as a bbox) and uses it instead, falling back to the
// fixture if the request fails or is empty.
const MAPLIBRE_VERSION = '4.7.1'
const CDN_JS = `https://unpkg.com/maplibre-gl@${MAPLIBRE_VERSION}/dist/maplibre-gl.js`
const CDN_CSS = `https://unpkg.com/maplibre-gl@${MAPLIBRE_VERSION}/dist/maplibre-gl.css`
// Libre / fully-free basemaps only — no tokens, no paid providers.
// Light: OpenFreeMap (https://openfreemap.org) — fully open, keyless, self-hostable, OSM data.
// Dark: CARTO dark-matter — free + keyless, OSM data. Both overridable via env to a
// self-hosted MapLibre/PMTiles style (matches the @ric/maps libre provider convention).
const STYLE_LIGHT =
  process.env.NEXT_PUBLIC_MAPLIBRE_STYLE_URL || 'https://tiles.openfreemap.org/styles/positron'
const STYLE_DARK =
  process.env.NEXT_PUBLIC_MAPLIBRE_STYLE_DARK_URL ||
  'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'

let maplibrePromise = null
function loadMapLibre() {
  if (typeof window === 'undefined') return Promise.reject(new Error('No window'))
  if (window.maplibregl) return Promise.resolve(window.maplibregl)
  if (maplibrePromise) return maplibrePromise
  maplibrePromise = new Promise((resolve, reject) => {
    if (!document.querySelector('link[data-maplibre]')) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = CDN_CSS
      link.setAttribute('data-maplibre', 'true')
      document.head.appendChild(link)
    }
    const script = document.createElement('script')
    script.src = CDN_JS
    script.async = true
    script.onload = () => resolve(window.maplibregl)
    script.onerror = () => reject(new Error('Failed to load the map library.'))
    document.head.appendChild(script)
  })
  return maplibrePromise
}

function escapeHtml(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function buildPopupHtml(point, category) {
  const color = category.color || '#3b82f6'
  const label = category.label || point.category || ''
  const glyph = category.glyph || ''
  const facts = point.facts || {}
  const rows = Object.keys(facts)
    .filter((key) => facts[key] != null && facts[key] !== '')
    .map(
      (key) =>
        `<tr><td style="padding:1px 8px 1px 0;color:#6b7280;white-space:nowrap;vertical-align:top;">${escapeHtml(
          key
        )}</td><td style="padding:1px 0;color:#111827;">${escapeHtml(facts[key])}</td></tr>`
    )
    .join('')
  const link = point.url
    ? `<a href="${escapeHtml(
        point.url
      )}" target="_blank" rel="noopener noreferrer" style="display:inline-block;margin-top:8px;font-size:12px;font-weight:600;color:${color};">Open ↗</a>`
    : ''
  return `<div style="font-family:inherit;max-width:250px;">
    <div style="font-size:11px;letter-spacing:.04em;text-transform:uppercase;font-weight:700;color:${color};">${escapeHtml(
    glyph
  )} ${escapeHtml(label)}</div>
    <div style="font-size:15px;font-weight:700;margin:2px 0 4px;color:#111827;">${escapeHtml(
      point.title
    )}</div>
    <div style="font-size:12px;line-height:1.4;color:#4b5563;margin-bottom:6px;">${escapeHtml(
      point.blurb || ''
    )}</div>
    <table style="font-size:12px;border-collapse:collapse;">${rows}</table>
    ${link}
  </div>`
}

export default function MapExplorer({ data }) {
  const meta = data.meta || {}
  const { resolvedTheme } = useTheme()
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const markersRef = useRef({})
  const [ready, setReady] = useState(false)
  const [error, setError] = useState(null)
  const [live, setLive] = useState(null) // populated from meta.endpoint when available
  const [source, setSource] = useState(meta.endpoint ? 'loading' : 'fixture')

  // Effective data: prefer live open data, fall back to the bundled fixture.
  const categories = useMemo(
    () =>
      live && live.categories && live.categories.length ? live.categories : data.categories || [],
    [live, data]
  )
  // Effective points, each stamped with its unified TST key (name@geohash@time#type)
  // and de-duplicated by it — so the same place is one marker, and the same key
  // identifies that place across every other map in the ric ecosystem.
  const points = useMemo(() => {
    const raw = live && live.points && live.points.length ? live.points : data.points || []
    const seen = new Set()
    const out = []
    for (const p of raw) {
      const k = keyForPoint(p)
      if (seen.has(k)) continue
      seen.add(k)
      out.push({ ...p, __key: k })
    }
    return out
  }, [live, data])
  const lines = useMemo(() => (live && live.lines ? live.lines : data.lines || []), [live, data])

  const [active, setActive] = useState(() => new Set((data.categories || []).map((c) => c.id)))

  const categoryMap = useMemo(() => {
    const map = {}
    for (const category of categories) map[category.id] = category
    return map
  }, [categories])

  // Keep the filter in sync with whatever category set is active (fixture or live).
  useEffect(() => {
    setActive(new Set(categories.map((c) => c.id)))
  }, [categories])

  function styleFor(theme) {
    return theme === 'dark' ? STYLE_DARK : STYLE_LIGHT
  }

  function syncLines(map) {
    if (!lines.length) return
    for (const line of lines) {
      const sourceId = `bev-line-${line.id}`
      const geojson = {
        type: 'Feature',
        properties: {},
        geometry: { type: 'LineString', coordinates: line.coordinates },
      }
      if (map.getSource(sourceId)) {
        map.getSource(sourceId).setData(geojson)
      } else {
        map.addSource(sourceId, { type: 'geojson', data: geojson })
        map.addLayer({
          id: sourceId,
          type: 'line',
          source: sourceId,
          layout: { 'line-cap': 'round', 'line-join': 'round' },
          paint: {
            'line-color': line.color || '#9ca3af',
            'line-width': line.width || 3,
            'line-opacity': 0.75,
            'line-dasharray': line.dashed === false ? [1] : [2, 1.5],
          },
        })
      }
    }
  }

  // Fetch live open data for the current viewport from the same-origin API route.
  function fetchLive(map) {
    if (!meta.endpoint) return
    const b = map.getBounds()
    const bbox = [b.getSouth(), b.getWest(), b.getNorth(), b.getEast()]
      .map((n) => n.toFixed(4))
      .join(',')
    const url = meta.endpoint + (meta.endpoint.includes('?') ? '&' : '?') + 'bbox=' + bbox
    fetch(url)
      .then((r) => r.json())
      .then((json) => {
        if (json && Array.isArray(json.points) && json.points.length) {
          setLive(json)
          setSource('live')
        } else {
          setSource('fixture')
        }
      })
      .catch(() => setSource('fixture'))
  }

  // Initialise the map once.
  useEffect(() => {
    let cancelled = false
    let map
    loadMapLibre()
      .then((maplibregl) => {
        if (cancelled || !containerRef.current) return
        map = new maplibregl.Map({
          container: containerRef.current,
          style: styleFor(resolvedTheme),
          center: meta.center || [0, 20],
          zoom: meta.zoom || 2,
        })
        map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right')
        map.on('load', () => {
          if (cancelled) return
          mapRef.current = map
          syncLines(map)
          setReady(true)
          fetchLive(map)
        })
      })
      .catch((e) => {
        if (!cancelled) setError(e.message)
      })
    return () => {
      cancelled = true
      if (map) map.remove()
      mapRef.current = null
      markersRef.current = {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Swap basemap when the site theme toggles; markers persist, lines re-add.
  useEffect(() => {
    const map = mapRef.current
    if (!map || !ready) return
    map.setStyle(styleFor(resolvedTheme))
    map.once('styledata', () => syncLines(map))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedTheme, ready])

  // Keep line overlays in sync if the effective data changes (e.g. live load).
  useEffect(() => {
    const map = mapRef.current
    if (map && ready) syncLines(map)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lines, ready])

  // (Re)build markers when the map is ready or the effective data / filter changes.
  useEffect(() => {
    const map = mapRef.current
    const maplibregl = typeof window !== 'undefined' ? window.maplibregl : null
    if (!map || !ready || !maplibregl) return
    Object.values(markersRef.current).forEach((m) => m.remove())
    markersRef.current = {}
    points
      .filter((p) => active.has(p.category))
      .forEach((p) => {
        const category = categoryMap[p.category] || {}
        const el = document.createElement('div')
        el.style.cssText =
          'width:30px;height:30px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);' +
          'display:flex;align-items:center;justify-content:center;cursor:pointer;' +
          'border:2px solid rgba(255,255,255,.9);box-shadow:0 2px 6px rgba(0,0,0,.35);background:' +
          (category.color || '#3b82f6') +
          ';'
        const inner = document.createElement('span')
        inner.textContent = category.glyph || '📍'
        inner.style.cssText = 'transform:rotate(45deg);font-size:14px;line-height:1;'
        el.appendChild(inner)
        const popup = new maplibregl.Popup({ offset: 26, closeButton: true }).setHTML(
          buildPopupHtml(p, category)
        )
        const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
          .setLngLat([p.lng, p.lat])
          .setPopup(popup)
          .addTo(map)
        markersRef.current[p.__key] = marker
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, active, points, categoryMap])

  function toggleCategory(id) {
    setActive((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function focusPoint(p) {
    const map = mapRef.current
    if (!map) return
    map.flyTo({ center: [p.lng, p.lat], zoom: Math.max(map.getZoom(), 11), speed: 0.8 })
    const marker = markersRef.current[p.__key]
    const popup = marker && marker.getPopup()
    if (popup && !popup.isOpen()) marker.togglePopup()
  }

  const visiblePoints = points.filter((p) => active.has(p.category))

  return (
    <div>
      {categories.length > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {categories.map((category) => {
            const on = active.has(category.id)
            return (
              <button
                key={category.id}
                onClick={() => toggleCategory(category.id)}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm transition ${
                  on
                    ? 'border-transparent text-white'
                    : 'border-gray-300 text-gray-500 dark:border-gray-600 dark:text-gray-400'
                }`}
                style={on ? { backgroundColor: category.color } : undefined}
              >
                <span aria-hidden>{category.glyph}</span>
                <span>{category.label}</span>
              </button>
            )
          })}
          {source === 'live' && (
            <span className="ml-auto rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/40 dark:text-green-300">
              live data
            </span>
          )}
        </div>
      )}

      <div
        ref={containerRef}
        className="w-full overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700"
        style={{ height: '65vh', minHeight: 380 }}
      >
        {!ready && !error && (
          <div className="flex h-full items-center justify-center text-sm text-gray-500">
            Loading map…
          </div>
        )}
        {error && (
          <div className="flex h-full items-center justify-center p-6 text-center text-sm text-red-500">
            {error}
          </div>
        )}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {visiblePoints.map((p) => {
          const category = categoryMap[p.category] || {}
          return (
            <button
              key={p.__key}
              onClick={() => focusPoint(p)}
              className="rounded-lg border border-gray-200 bg-white p-3 text-left transition hover:shadow-md dark:border-gray-700 dark:bg-gray-900"
            >
              <div
                className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide"
                style={{ color: category.color }}
              >
                <span aria-hidden>{category.glyph}</span>
                <span>{category.label}</span>
              </div>
              <div className="mt-1 font-bold text-gray-900 dark:text-gray-100">{p.title}</div>
              <div className="mt-0.5 text-sm text-gray-600 dark:text-gray-400">{p.blurb}</div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
