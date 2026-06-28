# ATM10 Explorer

ATM10 Explorer is a desktop companion for the All The Mods 10 (ATM10) Minecraft modpack. It provides a searchable desktop UI to explore mods, view metadata and versions, and surface curated documentation.

This repository contains a working scaffold and the first integration with the Modpack Index API. Highlights of what's been added:

- Frontend: Vite + React + TypeScript app with a basic search UI, React Router navigation, and a dedicated mod detail page.
- Backend: Tauri Rust backend exposing a `fetch_url` command that performs HTTP GETs and caches responses on disk.
- Modpack Index integration: wired to `https://www.modpackindex.com/api/v1` with helpers and detail/version fetches.
- Fixed Tauri invocation import path to `@tauri-apps/api` so the frontend can call backend commands correctly.

Key files
- [src/main.tsx](src/main.tsx) — app entrypoint wrapped in `BrowserRouter`.
- [src/App.tsx](src/App.tsx) — route definitions for home and mod detail pages.
- [src/pages/Home.tsx](src/pages/Home.tsx) — home page containing the search experience.
- [src/pages/ModPage.tsx](src/pages/ModPage.tsx) — page for `/mod/:id` routes.
- [src/components/Search.tsx](src/components/Search.tsx) — search UI and results list (click to navigate to mod pages).
- [src/components/ModDetail.tsx](src/components/ModDetail.tsx) — fetches and renders mod metadata and versions.
- [src/api/modpack.ts](src/api/modpack.ts) — API base and URL builders (`buildSearchUrl`, `buildModUrl`, `buildModVersionsUrl`).
- [src-tauri/src/main.rs](src-tauri/src/main.rs) — Tauri commands: `fetch_url` with simple on-disk caching.
- [src-tauri/Cargo.toml](src-tauri/Cargo.toml) — Rust dependencies (includes `reqwest`, `serde`, `md5`).
- [src/vite-env.d.ts](src/vite-env.d.ts) — TypeScript declarations for Vite and CSS imports.

What the `fetch_url` command does
- Performs a blocking GET using `reqwest` and returns the response body as text to the frontend.
- Caches responses under the application data directory (`app_dir()/atm10_explorer/cache`) using an md5 hash of the URL as the filename.
- Cache policy: currently naive (no TTL). We can add TTLs, size limits, or a SQLite-backed cache if desired.

Quick start (macOS)

1. Install prerequisites: Node.js (>=18), Rust (stable), and Tauri native requirements (see https://tauri.app/v1/guides/getting-started/prerequisites).

2. Install JS deps and ensure Rust toolchain is available:

```bash
cd atm10-projects
npm install
rustup install stable
```

> Note: `npm` must be installed before running `npm install`. If macOS reports `command not found: npm`, install Node.js with Homebrew, nvm, or the official Node installer.

3. Start the frontend dev server:

```bash
npm run dev
```

4. In another terminal, start Tauri dev (opens the desktop window):

```bash
npm run tauri:dev
```

What to expect

- The home page shows a search bar for ATM10 mods, items, and documentation.
- Enter a query and press Enter or click Search to retrieve results from the Modpack Index API.
- Click any result to navigate to a dedicated mod detail page at `/mod/:id`.
- The detail page loads mod metadata, dependencies, and available versions.
- Navigation is handled with React Router, so the UI supports browser-style back/forward behavior.

Notes and next steps

```bash
npm run dev
```

4. In another terminal, start Tauri dev (opens the desktop window):

```bash
npm run tauri:dev
```

Notes and next steps
- The app is already wired to the live Modpack Index API base: `https://www.modpackindex.com/api/v1`.
- Next options I can implement for you:
	- Render richer mod details (links, screenshots, dependency graphs) and navigate between mods.
	- Add rate-limit/backoff handling, API error UX and retry policies.
	- Implement offline indexing and fast local search using SQLite + FTS.
	- Improve caching with TTLs and pruning, or switch to a structured local DB for cached JSON.

If you want one of the next steps implemented now, tell me which and I will proceed.
