// Live sports field/court data for the Sports map.
// Proxies OpenStreetMap Overpass (free, libre, ODbL) server-side and returns the
// MapExplorer contract: { meta, categories, points }. Edge-cached so we respect
// Overpass rate limits. The client falls back to the bundled fixture on failure.
import { OVERPASS_ENDPOINT, buildSportsQuery, normalizeSportsFields } from '@/lib/map/overpass'

export default async function handler(req, res) {
  const bbox = req.query.bbox // "south,west,north,east"
  try {
    const upstream = await fetch(OVERPASS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        // Overpass requires a descriptive User-Agent or returns 406.
        'User-Agent': 'sportstips-map/1.0 (https://www.sportstips.org)',
        Accept: 'application/json',
      },
      body: 'data=' + encodeURIComponent(buildSportsQuery(bbox)),
    })
    if (!upstream.ok) throw new Error('overpass ' + upstream.status)
    const json = await upstream.json()
    const normalized = normalizeSportsFields(json)
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=604800')
    res.status(200).json(normalized)
  } catch (e) {
    // Signal failure with empty points so the client keeps the fixture.
    res.status(200).json({ error: String(e.message || e), points: [] })
  }
}
