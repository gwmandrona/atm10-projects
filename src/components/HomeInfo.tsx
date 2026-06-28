import React, { useEffect, useState } from 'react'

function detectTauri(): boolean {
  if (typeof window === 'undefined') {
    return false
  }

  const anyWindow = window as any
  const hasTauriIpc = typeof anyWindow.__TAURI_IPC__ === 'function'
  const hasInvokeInternal = typeof anyWindow.__TAURI_INTERNALS__?.invoke === 'function'
  const hasInvokeGlobalCore = typeof anyWindow.__TAURI__?.core?.invoke === 'function'
  const isTauriFlag = anyWindow.isTauri === true
  const looksLikeTauriAgent = typeof navigator !== 'undefined' && navigator.userAgent.includes('Tauri')

  return hasTauriIpc || hasInvokeInternal || hasInvokeGlobalCore || isTauriFlag || looksLikeTauriAgent
}

export default function HomeInfo() {
  const [tauriAvailable, setTauriAvailable] = useState(false)

  useEffect(() => {
    const available = detectTauri()
    setTauriAvailable(available)

    if (!available && typeof window !== 'undefined') {
      const anyWindow = window as any
      console.debug('Tauri runtime debug:', {
        hasTauriIpc: typeof anyWindow.__TAURI_IPC__ === 'function',
        hasTauriInternalsInvoke: typeof anyWindow.__TAURI_INTERNALS__?.invoke === 'function',
        hasTauriGlobalCoreInvoke: typeof anyWindow.__TAURI__?.core?.invoke === 'function',
        isTauriFlag: anyWindow.isTauri,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : null
      })
    }
  }, [])

  return (
    <>
      <div className="card" style={{ marginTop: '16px', padding: '12px' }}>
        <strong>Runtime:</strong>{' '}
        <span style={{ color: tauriAvailable ? 'var(--primary)' : 'var(--muted)' }}>
          {tauriAvailable ? 'Tauri desktop runtime detected' : 'Native Tauri runtime not detected'}
        </span>
        {!tauriAvailable && (
          <div className="meta" style={{ marginTop: '4px' }}>
            If this is the Tauri window, try restarting with <code>npm run tauri:dev</code>.
          </div>
        )}
      </div>

      <div className="card" style={{ marginTop: '20px' }}>
        <h2>How it works</h2>
        <p>This app combines a React frontend with a Tauri Rust backend to provide a desktop search experience.</p>
        <ul>
          <li><strong>Search UI:</strong> The home page sends queries to the backend when you search.</li>
          <li><strong>Tauri command:</strong> The Rust backend exposes a `fetch_url` command that performs HTTP requests and returns raw JSON.</li>
          <li><strong>API integration:</strong> The backend queries the Modpack Index API at <code>https://www.modpackindex.com/api/v1</code>.</li>
          <li><strong>Local cache:</strong> Responses are cached on disk using the app data directory to avoid repeated downloads.</li>
          <li><strong>Routing:</strong> React Router handles navigation from search results to `/mod/:id` detail pages.</li>
        </ul>
        <p>These pieces work together so the desktop app can safely access the network through Rust while keeping the UI responsive and portable.</p>
      </div>
    </>
  )
}
