# YouTube Row Fixer Plus

An independent YouTube layout and content-control extension maintained by Luke Osland.

## Features

- Set videos, Shorts, and community posts per row.
- Use separate row settings for channel pages.
- Hide Shorts, Playables, and channel avatars.
- Show full video titles and use a wider channel layout.
- Use a colourful popup with light and dark appearances.
- Save preferences locally, with no analytics or account required.

## Install locally

1. Build the extension using the instructions below.
2. Open chrome://extensions (or edge://extensions).
3. Enable Developer mode and choose Load unpacked.
4. Select the build folder. Disable other copies of YouTube Row Fixer to avoid conflicting changes.
5. Refresh YouTube. After rebuilding, reload the extension and refresh YouTube again.

## Build

Use Node 22 with the existing dependency lockfile. Node 26 is incompatible with this project's older Next.js build dependencies.

    npm ci
    npm run build
    npm run zip

The loadable extension is in build/. The Chrome upload archive is zip/Chrome v1.2.0.zip.
The ZIP command also creates a Firefox archive; Firefox compatibility has not been verified for this release.

## Branding and support

The name, version, project URL, and optional donation/store links are configured in src/data/brand.json. Donation and rating links are hidden until configured. Manifest metadata must match this configuration when making a release.

This extension has not yet been published as a new Chrome Web Store listing. See [release preparation](docs/CHROME_STORE.md).

## Credits

Forked from [YouTube Row Fixer](https://github.com/sapondanaisriwan/youtube-row-fixer) by Sapondanai Sriwan, under the MIT licence. Includes [ytZara](https://github.com/cyfung1031) by cyfung1031 and the startup fix from [mospira's upstream PR #97](https://github.com/sapondanaisriwan/youtube-row-fixer/pull/97).

Original copyright notices are retained. Built packages contain LICENSE.txt, THIRD_PARTY_NOTICES.txt, and an accessible credits page.

Not affiliated with or endorsed by YouTube or Google. YouTube is a trademark of Google LLC.

[MIT licence](LICENSE) · [Privacy](PRIVACY.md)
