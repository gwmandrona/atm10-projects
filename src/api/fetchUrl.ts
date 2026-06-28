import { invoke } from '@tauri-apps/api/tauri'

function isTauriAvailable(): boolean {
  if (typeof window === 'undefined') {
    return false
  }

  const anyWindow = window as any
  const hasTauriIpc = typeof anyWindow.__TAURI_IPC__ === 'function'
  const hasInvokeInternal = typeof anyWindow.__TAURI_INTERNALS__?.invoke === 'function'
  const hasInvokeGlobalCore = typeof anyWindow.__TAURI__?.core?.invoke === 'function'

  return hasTauriIpc || hasInvokeInternal || hasInvokeGlobalCore
}

export async function fetchUrl(url: string): Promise<string> {
  if (typeof window !== 'undefined') {
    const anyWindow = window as any

    if (typeof anyWindow.__TAURI_IPC__ === 'function') {
      return await invoke('fetch_url', { url })
    }

    if (typeof anyWindow.__TAURI_INTERNALS__?.invoke === 'function') {
      return await invoke('fetch_url', { url })
    }

    if (typeof anyWindow.__TAURI__?.core?.invoke === 'function') {
      try {
        return await anyWindow.__TAURI__.core.invoke('fetch_url', { url })
      } catch (err: any) {
        console.error('Tauri global core invoke failed', err)
        throw new Error(`Tauri global core invoke failed: ${err?.toString?.() || String(err)}`)
      }
    }
  }

  throw new Error(
    'Tauri runtime unavailable. Please run the app inside the Tauri desktop window using `npm run tauri:dev`, and ensure the app is actually loaded in the native window rather than a browser tab.'
  )
}
