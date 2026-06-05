AIR-1 PERFORMANCE OS — INSTALLABLE PWA PACKAGE
================================================

FILES
-----
index.html                                    Main PWA entry file
AIR1_WorldClass_V41_STABILITY_EDITION_PWA.html  Descriptive copy of the entry file
manifest.json                                 Install metadata
sw.js                                         Offline-first service worker
icons/                                        App icons

HOW TO USE
----------
1. Upload every file and the icons folder together to any HTTPS static host
   (for example GitHub Pages, Netlify, Cloudflare Pages, or Replit static hosting).
2. Open the hosted index.html once while online.
3. In Chrome/Edge on tablet or desktop, choose "Install app" or "Add to Home screen".
4. Open each module once while online so its optional external fonts/scripts can
   be cached. Afterwards the core app and previously loaded module resources work offline.

IMPORTANT
---------
- Service workers do not run when index.html is opened directly with file://.
- Use HTTPS hosting or localhost.
- User data remains in that browser/device's localStorage/IndexedDB. Use the
  application's Download Backup feature regularly.
- Gemini AI requests still require internet access and an API key.

APP ICON
--------
This package uses the selected Zoro swordsman artwork as its app icon,
including standard, Apple touch, favicon, and Android maskable variants.
