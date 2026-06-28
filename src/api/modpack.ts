export const API_BASE = 'https://www.modpackindex.com/api/v1'

export function buildSearchUrl(q: string) {
  return `${API_BASE}/mods/search?q=${encodeURIComponent(q)}`
}

export function buildModUrl(id: string) {
  return `${API_BASE}/mods/${encodeURIComponent(id)}`
}

export function buildModVersionsUrl(id: string) {
  return `${API_BASE}/mods/${encodeURIComponent(id)}/versions`
}
