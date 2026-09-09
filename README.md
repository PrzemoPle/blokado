# Blokado

Casual block-puzzle browser game. Drop pieces on a 9x9 board, clear full rows and columns, and outsmart the board with three twists:

- **Rotation tokens** - 3 per game; spend one to unlock free rotation of a piece. Clear 4 lines at once to earn one back.
- **Color bar** - single-color lines charge a bar; a full bar gives you a 3x3 bomb.
- **Boards & special cells** - stones that never clear, bonus stars, gold cells, ice that needs two clears.

Modes: Classic, Challenge, Daily challenge (same deal for everyone, shareable score). Languages: PL / EN / DE / FR.

Installable as a PWA and playable offline. High scores are kept locally in `localStorage`. Sounds are synthesized with Web Audio.

Play: https://blokado.fun

## Project layout

```
index.html            markup, language boot, APP_VERSION
game.js               game logic, rendering, input, audio
i18n.js               PL / EN / DE / FR strings
style.css             styles
sw.js                 service worker (versioned cache)
manifest.webmanifest  PWA manifest
icons/                app icons
CNAME                 blokado.fun
```

No build step and no dependencies beyond a Google Font. To run it locally, serve the directory over HTTP (the service worker needs an origin), for example:

```
python3 -m http.server 8000
```

then open http://localhost:8000.

Assets are cache-busted with `?v=<version>`. When shipping, bump the version in `index.html` in all five places - the three `?v=` query strings and `APP_VERSION`, which the service worker registration reuses - so clients pick up a fresh cache.

Deployed from `main` via GitHub Pages.

Created by przemyslaw@plewinski.pl with Claude Code.
