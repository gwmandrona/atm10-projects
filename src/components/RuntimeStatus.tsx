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

export default function RuntimeStatus() {
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
  )
}
