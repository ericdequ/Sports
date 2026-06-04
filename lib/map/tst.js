// TST (Time–Space–Type) keys — the unified place identity across every BEV / ric
// map: `name@geohash@time#type`. The same real place produces the same key on any
// map, so points dedupe within a map and can be joined/cached across maps and
// across the ric domain fleet. Pure, dependency-free (mirrors @ric/maps geohash).

const BASE32 = '0123456789bcdefghjkmnpqrstuvwxyz'

// Standard geohash encode (no deps). precision 9 ≈ ~4.8m cell.
export function geohashEncode(lat, lng, precision = 9) {
  if (
    typeof lat !== 'number' ||
    typeof lng !== 'number' ||
    Number.isNaN(lat) ||
    Number.isNaN(lng)
  ) {
    return 'unmapped'
  }
  let idx = 0
  let bit = 0
  let evenBit = true
  let hash = ''
  let latMin = -90
  let latMax = 90
  let lngMin = -180
  let lngMax = 180
  while (hash.length < precision) {
    if (evenBit) {
      const mid = (lngMin + lngMax) / 2
      if (lng >= mid) {
        idx = idx * 2 + 1
        lngMin = mid
      } else {
        idx = idx * 2
        lngMax = mid
      }
    } else {
      const mid = (latMin + latMax) / 2
      if (lat >= mid) {
        idx = idx * 2 + 1
        latMin = mid
      } else {
        idx = idx * 2
        latMax = mid
      }
    }
    evenBit = !evenBit
    if (++bit === 5) {
      hash += BASE32[idx]
      bit = 0
      idx = 0
    }
  }
  return hash
}

export function slugify(name) {
  return (
    String(name || '')
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60) || 'place'
  )
}

// Build `name@geohash[@time]#type`. time/type optional.
export function tstKey({ name, lat, lng, time, type, precision = 9 }) {
  const gh = geohashEncode(lat, lng, precision)
  const t = time ? '@' + String(time) : ''
  const ty = type ? '#' + slugify(type) : ''
  return `${slugify(name)}@${gh}${t}${ty}`
}

// Resolve a point's TST key, preferring an explicit one set by a normalizer.
export function keyForPoint(p) {
  if (p && p.tstKey) return p.tstKey
  return tstKey({ name: p.title, lat: p.lat, lng: p.lng, time: p.time, type: p.category })
}
