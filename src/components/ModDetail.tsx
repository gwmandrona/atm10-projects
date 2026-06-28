import React, { useEffect, useState } from 'react'
import { invoke } from '@tauri-apps/api/tauri'
import { buildModUrl, buildModVersionsUrl } from '../api/modpack'

type ModInfo = {
  id: string
  name?: string
  description?: string
  homepage?: string
  authors?: string[]
  dependencies?: any[]
}

type VersionInfo = {
  id?: string
  name?: string
  released_at?: string
}

export default function ModDetail({ id }: { id: string }) {
  const [info, setInfo] = useState<ModInfo | null>(null)
  const [versions, setVersions] = useState<VersionInfo[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const url = buildModUrl(id)
        const resp: string = await invoke('fetch_url', { url })
        const json = JSON.parse(resp)
        const data = json.data || json || {}
        const infoObj: ModInfo = {
          id: data.id || id,
          name: data.name || data.title || data.slug || String(data.id || id),
          description: data.description || data.summary || data.short_description || '',
          homepage: data.homepage || data.website || data.url || '',
          authors: (data.authors && Array.isArray(data.authors)) ? data.authors.map((a: any) => a.name || a) : (data.author ? [data.author] : []) ,
          dependencies: data.dependencies || data.deps || []
        }

        // fetch versions
        const vurl = buildModVersionsUrl(id)
        const vresp: string = await invoke('fetch_url', { url: vurl })
        const vjson = JSON.parse(vresp)
        const vlist = vjson.data || vjson.versions || vjson || []
        const vers: VersionInfo[] = Array.isArray(vlist) ? vlist.map((v: any) => ({ id: v.id, name: v.name || v.version || v.slug, released_at: v.released_at || v.date })) : []

        if (!mounted) return
        setInfo(infoObj)
        setVersions(vers)
      } catch (e: any) {
        if (!mounted) return
        setError(e?.toString() || 'Failed to load mod')
      } finally {
        if (!mounted) return
        setLoading(false)
      }
    }

    load()
    return () => { mounted = false }
  }, [id])

  if (loading) return <div>Loading mod details…</div>
  if (error) return <div style={{color:'var(--muted)'}}>Error: {error}</div>
  if (!info) return <div>No mod info available</div>

  return (
    <div>
      <h2 style={{marginTop:0}}>{info.name}</h2>
      {info.homepage && (
        <div style={{marginBottom:8}}><a href={info.homepage} target="_blank" rel="noreferrer">Homepage</a></div>
      )}
      {info.description && <div style={{marginBottom:12}} className="meta">{info.description}</div>}

      {info.authors && info.authors.length > 0 && (
        <div style={{marginBottom:8}}>
          <strong>Authors:</strong> {info.authors.join(', ')}
        </div>
      )}

      {info.dependencies && info.dependencies.length > 0 && (
        <div style={{marginBottom:8}}>
          <strong>Dependencies:</strong>
+          <ul>
+            {info.dependencies.map((d, i) => <li key={i}>{typeof d === 'string' ? d : (d.name || JSON.stringify(d))}</li>)}
+          </ul>
        </div>
      )}

      <div style={{marginTop:12}}>
        <strong>Versions</strong>
        {(!versions || versions.length === 0) && <div className="meta">No versions found</div>}
        {versions && versions.length > 0 && (
          <ul>
            {versions.map((v) => (
              <li key={v.id || v.name}>{v.name} {v.released_at ? <span className="meta">— {new Date(v.released_at).toLocaleDateString()}</span> : null}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
