AIR-1 PERFORMANCE OS — INSTALLABLE PWA PACKAGE
================================================

FILES
-----
index.html                                      Main PWA entry file
AIR1_WorldClass_V41_STABILITY_EDITION_PWA.html Preserved descriptive copy of the entry file
manifest.json                                   Install metadata
sw.js                                           Offline-first service worker
favicon-32.png                                  Browser favicon
apple-touch-icon.png                            Apple/mobile icon
icon-192.png                                    Android/desktop icon
icon-512.png                                    Large install icon
icon-maskable-512.png                           Android maskable Zoro icon
zoro-icon-source.png                            Source Zoro artwork
README.md                                       Full run/test/deploy/install guide
SHA256SUMS.txt                                  Package checksums

HOW TO USE
----------
1. Keep every file together in the same folder on an HTTPS static host.
2. Open the hosted index.html once while online.
3. In Chrome/Edge on tablet or desktop, choose "Install app" or "Add to Home screen".
4. Open each module once while online so optional external fonts/scripts can be cached.
5. Afterwards, the core local app shell and previously loaded safe assets work offline.

IMPORTANT
---------
- Service workers do not run from file://. Use HTTPS hosting or localhost.
- User data remains in that browser/device localStorage and IndexedDB.
- Use the application's Download Backup feature before updates or device changes.
- Gemini AI requests require internet access and a user-provided API key.
- Sensitive Gemini API requests and failed external responses are not cached.

APP ICON
--------
This package uses the selected Zoro swordsman artwork as the app icon, including standard, Apple touch, favicon, and Android maskable variants.
