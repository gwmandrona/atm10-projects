import { invoke, isTauri } from '@tauri-apps/api/core'

export async function fetchUrl(url: string): Promise<string> {
  if (isTauri()) {
    return await invoke('fetch_url', { url })
  }

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }

  return await response.text()
}
