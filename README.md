# AIR-1 Performance OS — PWA

AIR-1 Performance OS is a Samurai/Zoro themed, offline-first CA Final productivity and study application. The app is intentionally packaged as a static PWA so it can run from any HTTPS static host, install on Android tablets/phones and desktop browsers, and preserve existing browser data in `localStorage` and IndexedDB.

## Current architecture

- `index.html` is the main single-file application shell. It contains the AIR-1 OS dashboard plus embedded module iframes for Revision Matrix, Syllabus Tracker, Time Management, Test Analysis, Daily Planner, and Discipline.
- `AIR1_WorldClass_V41_STABILITY_EDITION_PWA.html` is a preserved descriptive copy of the main application file.
- `manifest.json` provides install metadata, standalone display mode, start URL, scope, theme colors, and Zoro icon declarations.
- `sw.js` is the offline-first service worker. It pre-caches the local app shell and icons, uses navigation fallback to `index.html`, and runtime-caches safe external font/script/image assets only after successful responses.
- Icon files (`favicon-32.png`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`, `zoro-icon-source.png`) are stored at the repository root and must stay beside `index.html`, `manifest.json`, and `sw.js` when deployed.

## Data safety

The application stores user data in the same browser profile using existing keys, including keys such as `air1MatrixDbV3`, `caAir1Db_v3`, `caAir1Db`, `msv_history_v1`, `air1_logs_*`, `air1_habits_*`, and related AIR-1 keys. The service worker does **not** delete or migrate saved user data. The Gemini API key (`air1_gemini_api_key`) is excluded from AIR-1 backup snapshots and is not cached by the service worker.

Before updating a live deployment, ask users to create a backup from the in-app **Download Backup** control.

## Run locally

Service workers do not work from `file://`. Always use `localhost` or HTTPS.

```bash
python3 -m http.server 4173
```

Then open:

```text
http://127.0.0.1:4173/index.html
```

Alternative static servers are fine, for example:

```bash
npx serve .
```

## Test the PWA locally

1. Start a local HTTP server.
2. Open `http://127.0.0.1:4173/index.html` in Chrome/Edge.
3. Open DevTools → **Application**.
4. Confirm:
   - Manifest loads from `/manifest.json`.
   - Service worker `sw.js` is installed and activated.
   - Cache Storage contains the AIR-1 app shell cache.
   - Icons resolve: `/icon-192.png`, `/icon-512.png`, and `/icon-maskable-512.png`.
5. While online, visit every tab once: AIR-1 OS, Revision Matrix, Syllabus Tracker, Time Management, Test Analysis, Daily Planner, and Discipline. This gives safe external fonts/scripts a chance to runtime-cache.
6. In DevTools → Network, enable **Offline**.
7. Reload the page. The app should open from cache and remain usable for local workflows. Gemini AI requests still require internet access.
8. Check the browser console for critical errors. Non-critical warnings about unavailable network-only AI requests while offline are expected.

## Deploy to HTTPS hosting

Keep these files together at the deployed site root:

```text
index.html
AIR1_WorldClass_V41_STABILITY_EDITION_PWA.html
manifest.json
sw.js
favicon-32.png
apple-touch-icon.png
icon-192.png
icon-512.png
icon-maskable-512.png
zoro-icon-source.png
README.md
README.txt
SHA256SUMS.txt
```

### GitHub Pages

1. Push the repository to GitHub.
2. In GitHub, open **Settings → Pages**.
3. Select the branch and root folder that contain `index.html`.
4. Save and wait for the Pages URL.
5. Open the HTTPS Pages URL once online and verify the service worker and manifest in DevTools.

### Netlify

1. Create a new Netlify site from the repository or drag-and-drop the folder.
2. Use an empty build command.
3. Use the repository root as the publish directory.
4. Deploy and open the generated HTTPS URL.

### Cloudflare Pages

1. Create a Pages project from the repository.
2. Use no build command.
3. Set output directory to `/` or the repository root.
4. Deploy and open the generated HTTPS URL.

Any equivalent HTTPS static host works. Avoid hosts that rewrite or block `manifest.json`, `sw.js`, or PNG icon files.

## Install on an Android tablet or phone

1. Open the HTTPS deployment URL in Chrome.
2. Wait for the first successful online load.
3. Tap the three-dot menu.
4. Tap **Install app** or **Add to Home screen**.
5. Confirm the install prompt.
6. Launch **AIR-1 OS** from the home screen. The Zoro icon should appear from the manifest icon set.
7. Open each tab once while online before relying on offline mode.

## Updating safely without losing saved data

1. In the current app, click **Download Backup** and store the JSON backup somewhere safe.
2. Deploy the updated files over the old files without changing the app origin/domain/path if possible.
3. Keep `start_url` and `scope` stable unless you intentionally move the app. Changing the origin or path creates a separate browser storage area.
4. Open the app online once after deployment so the updated service worker can install.
5. Close all old app tabs and reopen the app. The service worker activates after old tabs are closed.
6. Confirm existing history, planners, logs, notes, analytics, and timers are still present.
7. If data is missing due to moving domains/devices, use the in-app restore flow with the downloaded backup.

## Limitations

- Browser data is device/browser-profile specific. Moving to a different domain, browser, or device requires export/import.
- Gemini AI features require internet access and a valid user-provided Gemini API key.
- Third-party fonts and Chart.js can only be used offline after they have loaded successfully online at least once.
- iOS/iPadOS PWA behavior depends on Safari's service-worker and storage limits; Android Chrome and desktop Chromium browsers provide the most complete install experience.
