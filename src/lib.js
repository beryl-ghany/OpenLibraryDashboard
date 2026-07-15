export function decadeOf(year) {
  if (!year) return null
  return Math.floor(year / 10) * 10
}

// "/works/OL12345W" -> "OL12345W"
export function olidFromKey(key) {
  return key.replace('/works/', '')
}

// "OL12345W" -> "/works/OL12345W"
export function keyFromOlid(olid) {
  return `/works/${olid}`
}
