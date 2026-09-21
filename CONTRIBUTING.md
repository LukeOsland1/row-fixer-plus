# Contributing

Row Fixer Plus, independently maintained. Node 20 or newer.

    git clone https://github.com/LukeOsland1/row-fixer-plus.git
    cd row-fixer-plus
    npm ci
    npm run build

Load build/ as an unpacked extension in Chrome or Edge. Reload the extension and refresh YouTube after rebuilding.

Run npm run build before submitting changes; it lints, then builds the popup with Vite, the content scripts with webpack, and assembles build/. npm run dev starts a live-reloading extension build. npm test is the inherited script compilation command, not a behaviour test suite.

Keep original copyright and licence notices. Branding and optional donation/store links are in src/data/brand.json. Distribution guidance is in docs/CHROME_STORE.md.
