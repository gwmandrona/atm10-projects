# Code Changes Explanation

This file explains the recent code changes that fixed the Tauri desktop window and made the frontend/backend integration work correctly.

## 1. Tauri window configuration

File changed:
- `src-tauri/tauri.conf.json`

What changed:
- Added a `windows` array with a `main` window definition.
- Set `title`, `width`, `height`, `resizable`, and `visible: true`.

Why it worked:
- Tauri needs an explicit window definition to create and show the desktop window in this project configuration.
- Without it, the app could start without a visible window or appear blank even though the backend and dev server were running.

## 2. Locked Vite dev server port

File changed:
- `package.json`

What changed:
- Updated the `dev` script to `vite --port 5173 --strictPort`.

Why it worked:
- The Tauri config uses `devPath: "http://localhost:5173"`.
- If Vite selected a different port, Tauri would still try to load `5173`, causing the desktop window to show nothing.
- `--strictPort` forces Vite to fail instead of switching to another port, making the port mismatch obvious and avoid silent breakage.

## 3. Correct `invoke` import path for the frontend

Files changed:
- `src/components/Search.tsx`
- `src/components/ModDetail.tsx`

What changed:
- Replaced `import { invoke } from '@tauri-apps/api/tauri'` with `import { invoke } from '@tauri-apps/api/core'`.

Why it worked:
- The installed `@tauri-apps/api` package exports the `invoke` function from its `core` module.
- Importing from `@tauri-apps/api/tauri` caused Vite to fail with a module resolution error and prevented the app from loading.

## 4. Updated README to match the current workflow

File changed:
- `README.md`

What changed:
- Clarified that `npm run tauri:dev` is the correct startup command.
- Documented the Tauri window fix and the locked Vite port.
- Removed duplicate instructions and made the run instructions direct.

Why it worked:
- The updated documentation reflects the actual working setup and avoids confusion about manual dev server startup.

## Summary

The working fix was a combination of these three changes:
- make sure Tauri actually creates a visible desktop window,
- make sure Vite runs on the exact port Tauri expects,
- and make sure the frontend imports the correct Tauri API module.

These changes addressed both the blank-window symptom and the underlying runtime integration mismatch.
