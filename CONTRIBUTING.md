# Contributing

Row Fixer Plus, independently maintained. Node 22.13 or newer; Node 24 is recommended and used by CI.

    git clone https://github.com/LukeOsland1/row-fixer-plus.git
    cd row-fixer-plus
    npm ci
    npm run build

Load build/ as an unpacked extension in Chrome or Edge. Reload the extension and refresh YouTube after rebuilding.

Run `npm run build` before submitting changes; it lints, then builds the popup with Vite, the content scripts with webpack, and assembles `build/`. `npm run dev` starts a live-reloading extension build.

Run the same checks as CI:

```bash
npm audit --audit-level=moderate
npm run check:version
npm run build
npm run zip
npm run lint:firefox
npx playwright install chromium
npm test
```

The tests load the real packaged extension in an isolated Chrome for Testing profile. They check persisted settings and enabled/disabled state across browser restarts, content-script injection on a controlled YouTube-page fixture, and archive contents. The fixture makes the tests repeatable; it does not replace a live YouTube check when selectors change.

If the downloaded test browser cannot start on Windows, set `$env:RFP_BROWSER_CHANNEL = "chrome"` in PowerShell to use installed Chrome. The harness loads the extension through Chrome's DevTools API in its own test profile; it never uses your normal browser profile. Clear this variable to return to bundled Chromium.

`npm run screenshots` captures the built extension and regenerates the README screenshots, store images, and Ko-fi cover. Run it after `npm run build`; Chromium must already be installed. Review the generated images before committing.

GitHub Actions runs the audit, build, Firefox package validation, and tests on pull requests and main, and uploads both browser ZIPs and the validation report. Firefox validation errors fail CI; warnings remain visible for review. Publish versioned releases only from a commit with passing CI; attach the matching Chrome and Firefox ZIPs. Firefox packages need signing before normal distribution through Firefox Add-ons. See [Firefox submission and reviewer notes](docs/FIREFOX_STORE.md).

Keep original copyright and licence notices. Branding and optional donation/store links are in src/data/brand.json. Distribution guidance is in docs/CHROME_STORE.md.

Use `npm version <major.minor.patch> --no-git-tag-version` to update both browsers and the popup together. See [release and store publishing instructions](docs/RELEASING.md) for tagged builds, API credentials, and retrying individual stores.
