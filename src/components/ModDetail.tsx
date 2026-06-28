import React, { useEffect, useState } from 'react'
import { fetchUrl } from '../api/fetchUrl'
import { buildModUrl } from '../api/modpack'

type ModInfo = {
  id: string
  name: string
  summary?: string
  description?: string
  homepage?: string
  pageUrl?: string
  links?: Record<string, string>
  authors?: string[]
  categories?: string[]
  launchers?: string[]
  supportedVersions?: string[]
  downloadCount?: number
  latestReleaseDate?: string
  lastUpdated?: string
}

function formatNumber(value?: number) {
  return value == null ? '—' : Intl.NumberFormat().format(value)
}

function formatDate(value?: string) {
  if (!value) return '—'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

function renderLabelList(label: string, values?: string[]) {
  if (!values || values.length === 0) return null
  return (
    <div className="detail-row">
      <div className="detail-label">{label}</div>
      <div className="detail-badges">
        {values.map((item) => (
          <span key={item} className="detail-badge">{item}</span>
        ))}
      </div>
    </div>
  )
}

export default function ModDetail({ id }: { id: string }) {
  const [info, setInfo] = useState<ModInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    async function load() {
      setLoading(true)
      setError(null)

      try {
        const url = buildModUrl(id)
        const resp: string = await fetchUrl(url)
        const json = JSON.parse(resp)
        const data = json.data || json || {}

        const homepage = data.url || data.page_url || data.homepage || ''
        const pageUrl = data.page_url || data.url || ''
        const links: Record<string, string> = data.links || {}
        const categories = Array.isArray(data.categories) ? data.categories.map((c: any) => c.name || c.slug || String(c.id || '')) : []
        const authors = Array.isArray(data.authors) ? data.authors.map((a: any) => a.name || String(a)) : []
        const launchers = Array.isArray(data.launchers) ? data.launchers.map((l: any) => l.name || l.slug || String(l.id || '')) : []
        const supportedVersions = Array.isArray(data.minecraft_versions) ? data.minecraft_versions.map((v: any) => v.name || v.slug || String(v.id || '')) : []

        const infoObj: ModInfo = {
          id: String(data.id || id),
          name: data.name || data.title || data.slug || String(data.id || id),
          summary: data.summary || data.description || data.short_description || '',
          description: data.description || data.summary || data.summary || '',
          homepage,
          pageUrl,
          links,
          authors,
          categories,
          launchers,
          supportedVersions,
          downloadCount: data.download_count,
          latestReleaseDate: data.latest_release_date,
          lastUpdated: data.last_updated || data.last_modified,
        }

        if (!mounted) return
        setInfo(infoObj)
      } catch (e: any) {
        if (!mounted) return
        setError(e?.toString() || 'Failed to load mod details')
      } finally {
        if (!mounted) return
        setLoading(false)
      }
    }

    load()
    return () => { mounted = false }
  }, [id])

  if (loading) return <div>Loading mod details…</div>
  if (error) return <div className="detail-error">Error: {error}</div>
  if (!info) return <div className="detail-empty">No mod info available</div>

  return (
    <div className="detail-container">
      <div className="detail-header">
        <div>
          <h2>{info.name}</h2>
          {info.summary && <p className="detail-summary">{info.summary}</p>}
        </div>
        <div className="detail-stats">
          <div>
            <span className="detail-stat-label">Downloads</span>
            <div className="detail-stat-value">{formatNumber(info.downloadCount)}</div>
          </div>
          <div>
            <span className="detail-stat-label">Latest release</span>
            <div className="detail-stat-value">{formatDate(info.latestReleaseDate)}</div>
          </div>
        </div>
      </div>

      <div className="detail-section">
        <div className="detail-row">
          <div className="detail-label">Homepage</div>
          <div>
            {(() => {
              const links = info.links || {}
              const firstLink = Object.values(links)[0]
              const homepageCandidate = info.homepage || info.pageUrl || firstLink || ''
              return homepageCandidate ? (
                <a href={homepageCandidate} target="_blank" rel="noreferrer" className="detail-link">Open homepage</a>
              ) : (
                <span className="detail-meta">No homepage available</span>
              )
            })()}
          </div>
        </div>

        {info.links && Object.keys(info.links).length > 0 && (
          <div className="detail-row">
            <div className="detail-label">External Links</div>
            <div className="detail-badges">
              {Object.entries(info.links).map(([platform, url]) => (
                <a key={platform} href={url} target="_blank" rel="noreferrer" className="detail-pill">{platform}</a>
              ))}
            </div>
          </div>
        )}

        {renderLabelList('Authors', info.authors)}
        {renderLabelList('Categories', info.categories)}
        {renderLabelList('Launchers', info.launchers)}
        {renderLabelList('Minecraft versions', info.supportedVersions?.slice(0, 10))}

        <div className="detail-row">
          <div className="detail-label">Last updated</div>
          <div className="detail-meta">{formatDate(info.lastUpdated)}</div>
        </div>
      </div>

      {info.description && (
        <div className="detail-section">
          <h3>Description</h3>
          <p className="detail-description">{info.description}</p>
        </div>
      )}
    </div>
  )
}
