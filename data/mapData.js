// Map dataset for Sports — a pickup-game field & court finder.
// Sourced from the BEV map lab `sports` fixtures (Gainesville + Orlando area).
const mapData = {
  meta: {
    title: 'Pickup Field Finder',
    subtitle:
      'Find a field or court near you. Filter by sport, then open a spot to check the surface, lighting, and access before you grab a game.',
    accent: '#10b981',
    center: [-82.34, 29.65],
    zoom: 12,
    // Live open data: the map fetches real OSM fields/courts for the current
    // viewport from this same-origin route, falling back to the fixtures below.
    endpoint: '/api/map/fields',
    attribution: 'Live fields © OpenStreetMap (ODbL); seed fixtures from the BEV map lab.',
  },
  categories: [
    { id: 'soccer', label: 'Soccer', color: '#10b981', glyph: '⚽' },
    { id: 'basketball', label: 'Basketball', color: '#f97316', glyph: '🏀' },
    { id: 'baseball-softball', label: 'Baseball / Softball', color: '#f59e0b', glyph: '⚾' },
    { id: 'volleyball', label: 'Volleyball', color: '#06b6d4', glyph: '🏐' },
    { id: 'tennis', label: 'Tennis', color: '#84cc16', glyph: '🎾' },
  ],
  points: [
    {
      id: 'depot-park-soccer',
      title: 'Depot Park Soccer Lawn',
      lat: 29.6447,
      lng: -82.3241,
      category: 'soccer',
      blurb: 'A public grass soccer/football lawn in downtown Gainesville, open for drop-in pickup.',
      facts: { City: 'Gainesville', Sports: 'soccer, football', Surface: 'grass', Access: 'public', Lighting: 'daylight' },
    },
    {
      id: 'lincoln-middle-courts',
      title: 'Lincoln Middle Basketball Courts',
      lat: 29.6404,
      lng: -82.3018,
      category: 'basketball',
      blurb: 'Public after-hours asphalt basketball courts in Gainesville with community rules.',
      facts: { City: 'Gainesville', Sports: 'basketball', Surface: 'asphalt', Access: 'public (school after-hours)', Lighting: 'partial' },
    },
    {
      id: 'mlk-center-courts',
      title: 'MLK Multipurpose Center Courts',
      lat: 29.6692,
      lng: -82.3064,
      category: 'basketball',
      blurb: 'Lit northside hard courts in Gainesville for basketball and pickleball, drop-in or permit.',
      facts: { City: 'Gainesville', Sports: 'basketball, pickleball', Surface: 'hard-court', Access: 'public', Lighting: 'lit' },
    },
    {
      id: 'trotters-park-diamond',
      title: 'Trotters Park Diamond',
      lat: 29.6813,
      lng: -82.3439,
      category: 'baseball-softball',
      blurb: 'A lit public baseball/softball diamond in Gainesville used for league play.',
      facts: { City: 'Gainesville', Sports: 'baseball-softball', Surface: 'dirt-grass', Access: 'public', Lighting: 'lit' },
    },
    {
      id: 'barnett-park-volleyball',
      title: 'Barnett Park Volleyball',
      lat: 28.5439,
      lng: -81.4631,
      category: 'volleyball',
      blurb: 'Public sand volleyball courts in Orlando, open for daytime drop-in.',
      facts: { City: 'Orlando', Sports: 'volleyball', Surface: 'sand', Access: 'public', Lighting: 'daylight' },
    },
    {
      id: 'lake-fairview-tennis',
      title: 'Lake Fairview Tennis Center',
      lat: 28.5968,
      lng: -81.4032,
      category: 'tennis',
      blurb: 'A lit reservation-based Orlando hard-court center for tennis and pickleball.',
      facts: { City: 'Orlando', Sports: 'tennis, pickleball', Surface: 'hard-court', Access: 'public (reservation)', Lighting: 'lit' },
    },
    {
      id: 'cady-way-complex',
      title: 'Cady Way Sports Complex',
      lat: 28.5905,
      lng: -81.3212,
      category: 'soccer',
      blurb: 'A lit Winter Park complex with soccer fields and a diamond, permit preferred.',
      facts: { City: 'Winter Park', Sports: 'soccer, baseball-softball', Surface: 'grass + diamond', Access: 'public (permit)', Lighting: 'lit' },
    },
    {
      id: 'lake-eola-court',
      title: 'Lake Eola Pickup Court',
      lat: 28.5437,
      lng: -81.3741,
      category: 'basketball',
      blurb: 'A downtown Orlando public asphalt basketball court for daytime pickup.',
      facts: { City: 'Orlando', Sports: 'basketball', Surface: 'asphalt', Access: 'public', Lighting: 'daylight' },
    },
  ],
}

export default mapData
