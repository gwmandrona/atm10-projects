import React, { useState } from 'react'
import { fetchUrl } from '../api/fetchUrl'
import { buildSearchUrl } from '../api/modpack'
import { useNavigate } from 'react-router-dom'

type ModResult = {
  id: string
  name: string
  description?: string
}

export default function Search() {
  const [q, setQ] = useState('')
  const [results, setResults] = useState<ModResult[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  async function search() {
    if (!q) return
    setLoading(true)
    setError(null)
    try {
      // Call the Modpack Index API via the Rust backend fetch_url command or browser fetch fallback
      const url = buildSearchUrl(q)
      const resp: string = await fetchUrl(url)
      const json = JSON.parse(resp)

      // The Modpack Index API may return different shapes; try common paths
      const list = json.data || json.mods || json.results || json || []
      const items: ModResult[] = (Array.isArray(list) ? list : []).map((m: any) => ({
        // prefer stable slug when available so detail lookups use human-friendly identifiers
        id: m.slug || m.id || m.name || String(m._id || ''),
        name: m.name || m.title || m.slug || String(m.id || ''),
        description: m.description || m.summary || m.short_description || ''
      }))
      setResults(items)
    } catch (e: any) {
      setError(e?.toString() || 'Failed to fetch')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <div className="search-row">
        <input
          className="search-input"
          placeholder="Search mods, items, docs..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && search()}
        />
        <button onClick={search}>Search</button>
      </div>

      {loading && <div className="card">Loading…</div>}
      {error && <div className="card">Error: {error}</div>}

      {results && (
        <div>
          {results.length === 0 && <div className="card">No results</div>}
          {results.map((r) => (
            <div key={r.id} className="result" onClick={() => navigate(`/mod/${encodeURIComponent(r.id)}`)} style={{cursor:'pointer'}}>
              <div style={{fontWeight:600}}>{r.name}</div>
              {r.description && <div className="meta">{r.description}</div>}
            </div>
          ))}
        </div>
      )}
 
    </div>
  )
}
