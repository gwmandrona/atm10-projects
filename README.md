# ATM10 Explorer

ATM10 Explorer is a desktop companion for the All The Mods 10 (ATM10) Minecraft modpack. It provides a searchable desktop UI to explore mods, view metadata and versions, and surface curated documentation.

This repository contains a working Tauri desktop app integrated with the Modpack Index API.

## What changed

- The React frontend is powered by Vite + TypeScript and uses React Router for home and mod detail navigation.
- The Tauri Rust backend exposes a `fetch_url` command that performs HTTP GETs and caches responses in the app data directory.
- The Tauri desktop window now starts correctly thanks to an explicit `windows` configuration in `src-tauri/tauri.conf.json`.
- The frontend now imports `invoke` from `@tauri-apps/api/core`, which matches the current package export shape.
- The Vite dev server is locked to port `5173` with `--strictPort`, so Tauri's `devPath` stays in sync.

## Files of note

- `src/main.tsx` — React app entrypoint wrapped in `BrowserRouter`.
- `src/App.tsx` — route definitions for `/` and `/mod/:id`.
- `src/pages/Home.tsx` — search page UI.
- `src/pages/ModPage.tsx` — mod detail route page.
- `src/components/Search.tsx` — search input, API call, and result navigation.
- `src/components/ModDetail.tsx` — loads mod metadata and version list.
- `src/api/modpack.ts` — API base URL and endpoint builders.
- `src-tauri/src/main.rs` — Tauri command implementation and app startup.
- `src-tauri/tauri.conf.json` — Tauri config including `devPath`, build commands, and explicit window settings.
- `package.json` — JS scripts and dependencies.

## How to run

1. Install prerequisites: Node.js, Rust, and Tauri native requirements (see https://tauri.app/v1/guides/getting-started/prerequisites).

2. Install dependencies:

```bash
cd atm10-projects
npm install
rustup install stable
```

3. Start the Tauri app:

```bash
npm run tauri:dev
```

> Note: `npm run tauri:dev` starts the Vite dev server automatically before launching Tauri.

## What to expect

- The desktop app opens with a search bar.
- Enter a query and press Enter or click Search to fetch results from the Modpack Index API.
- Click a result to open its mod detail page.
- The detail page shows mod metadata, dependencies, and available versions.

## Notes

- The app is wired to the live Modpack Index API base: `https://www.modpackindex.com/api/v1`.
- The current cache is file-based and simple; future improvements can include TTL, pruning, or a SQLite-backed local cache.
- If you want, I can next add richer mod rendering, offline indexing, or more robust error handling.
