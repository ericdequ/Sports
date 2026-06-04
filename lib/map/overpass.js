// OSM Overpass helpers for the Sports field/court finder.
// Free + libre data (OpenStreetMap, ODbL — attribution required). All requests
// run server-side from the /api/map/* route, never the client.

export const OVERPASS_ENDPOINT =
  process.env.OSM_OVERPASS_ENDPOINT || 'https://overpass-api.de/api/interpreter'

// Map raw OSM `sport=*` values onto our display categories (id, label, color, glyph).
const SPORT_STYLE = {
  soccer: { id: 'soccer', label: 'Soccer', color: '#10b981', glyph: '⚽' },
  basketball: { id: 'basketball', label: 'Basketball', color: '#f97316', glyph: '🏀' },
  baseball: {
    id: 'baseball-softball',
    label: 'Baseball / Softball',
    color: '#f59e0b',
    glyph: '⚾',
  },
  softball: {
    id: 'baseball-softball',
    label: 'Baseball / Softball',
    color: '#f59e0b',
    glyph: '⚾',
  },
  tennis: { id: 'tennis', label: 'Tennis', color: '#84cc16', glyph: '🎾' },
  volleyball: { id: 'volleyball', label: 'Volleyball', color: '#06b6d4', glyph: '🏐' },
  american_football: { id: 'football', label: 'Football', color: '#8b5cf6', glyph: '🏈' },
}
const OTHER_STYLE = { id: 'other', label: 'Other', color: '#64748b', glyph: '📍' }

export function buildSportsQuery(bbox) {
  // bbox = "south,west,north,east"
  const safe = String(bbox || '29.58,-82.45,29.72,-82.28')
  return `[out:json][timeout:25];nwr["leisure"~"pitch|sports_centre|stadium"](${safe});out center tags;`
}

function styleForSport(sportTag) {
  if (!sportTag) return OTHER_STYLE
  const primary = String(sportTag).split(';')[0].trim().toLowerCase()
  return SPORT_STYLE[primary] || OTHER_STYLE
}

// Normalize an Overpass JSON response into the MapExplorer contract.
export function normalizeSportsFields(json) {
  const elements = (json && json.elements) || []
  const usedCategories = {}
  const points = []
  for (const el of elements) {
    const tags = el.tags || {}
    if (!tags.name) continue // only named, mappable places
    const lat = el.lat != null ? el.lat : el.center && el.center.lat
    const lng = el.lon != null ? el.lon : el.center && el.center.lon
    if (lat == null || lng == null) continue
    const style = styleForSport(tags.sport)
    usedCategories[style.id] = style
    points.push({
      id: `${el.type}/${el.id}`,
      title: tags.name,
      lat,
      lng,
      category: style.id,
      blurb: `${tags.sport ? tags.sport.replace(/_/g, ' ') : 'Sports'} at ${tags.name}.`,
      facts: {
        Sport: tags.sport ? tags.sport.replace(/;/g, ', ').replace(/_/g, ' ') : 'unspecified',
        Surface: tags.surface || '',
        Access: tags.access || '',
        Lit: tags.lit === 'yes' ? 'yes' : '',
      },
      url: `https://www.openstreetmap.org/${el.type}/${el.id}`,
    })
  }
  return {
    categories: Object.values(usedCategories),
    points,
    meta: {
      attribution: 'Live data © OpenStreetMap contributors (ODbL) via Overpass.',
    },
  }
}
