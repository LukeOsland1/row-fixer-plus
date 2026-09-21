# Contributing

This is the independently maintained YouTube Row Fixer Plus fork. Use Node 22.

    git clone https://github.com/LukeOsland1/youtube-row-fixer.git
    cd youtube-row-fixer
    npm ci
    npm run build

Load build/ as an unpacked extension in Chrome or Edge. Reload the extension and refresh YouTube after rebuilding.

Run npm run build before submitting changes; it runs lint checks and creates the production extension. npm test is the inherited script compilation command, not a behaviour test suite.

Keep original copyright and licence notices. Branding and optional donation/store links are in src/data/brand.json. Distribution guidance is in docs/CHROME_STORE.md.
