<div align="center">

<img src="public/images/row-fixer-plus.svg" width="88" alt="Row Fixer Plus">

# Row Fixer Plus

**Your feed. Your rules.**

Choose how many videos fit in a row on YouTube, and hide the things you never watch.

[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/kdcmbgcilanlmlcilgenlioaicoonhmp?style=flat-square&label=Chrome%20Web%20Store)](https://chromewebstore.google.com/detail/row-fixer-plus/kdcmbgcilanlmlcilgenlioaicoonhmp)
[![License](https://img.shields.io/github/license/LukeOsland1/row-fixer-plus?style=flat-square)](LICENSE)
[![Stars](https://img.shields.io/github/stars/LukeOsland1/row-fixer-plus?style=flat-square)](https://github.com/LukeOsland1/row-fixer-plus/stargazers)
[![Issues](https://img.shields.io/github/issues/LukeOsland1/row-fixer-plus?style=flat-square)](https://github.com/LukeOsland1/row-fixer-plus/issues)
[![Ko-fi](https://img.shields.io/badge/Ko--fi-support-ff5e5b?style=flat-square)](https://ko-fi.com/lukeosland)

<img src="docs/screenshots/layout-light.png" width="340" alt="Layout settings">
<img src="docs/screenshots/hide-dark.png" width="340" alt="Hide settings">

</div>

## 📑 Table of Contents

- [📷 Screenshots](#-screenshots)
- [🎛️ What you can change](#️-what-you-can-change)
- [✨ Installation](#-installation)
- [🧑‍💻 Contributing](#-contributing)
- [💰 Support](#-support)
- [🔒 Privacy](#-privacy)
- [©️ Credit](#️-credit)
- [©️ License](#️-license)

## 📷 Screenshots

| Layout | Hide |
| --- | --- |
| <img src="docs/screenshots/layout-light.png" width="300" alt="Layout settings in light appearance"> | <img src="docs/screenshots/hide-dark.png" width="300" alt="Hide settings in dark appearance"> |

## 🎛️ What you can change

- Videos, Shorts, and community posts per row — drag the slider or type an exact number.
- Separate row settings for channel pages.
- Hide Shorts shelves, Playables, and channel avatars.
- Show full video titles instead of truncated ones.
- Fit the grid to smaller windows, and give channel pages a wider layout.
- Light and dark, matching YouTube's own interface.

Everything sits on one screen, and a live preview at the top shows the change before you go looking for it.

## ✨ Installation

### Chrome, Edge, and other Chromium browsers

[**Install from the Chrome Web Store**](https://chromewebstore.google.com/detail/row-fixer-plus/kdcmbgcilanlmlcilgenlioaicoonhmp) — then refresh YouTube.

Edge, Brave, Opera, and Vivaldi install it from the same listing. Edge asks you to allow extensions from other stores first.

### Firefox

The [Firefox Add-ons listing](https://addons.mozilla.org/en-US/firefox/addon/5f5dbdfc875b48f9be5a/) is submitted and **waiting on Mozilla review** — the link stays a "page not found" until it is approved. Until then, install it manually:

1. Download `Firefox v*.zip` from the [latest release](https://github.com/LukeOsland1/row-fixer-plus/releases/latest).
2. Open `about:debugging#/runtime/this-firefox`.
3. Click **Load Temporary Add-on** and pick the ZIP.
4. Refresh YouTube.

This needs Firefox 142 or newer, and a temporary add-on is removed when you close Firefox. Android is not supported.

### Build and install it yourself

Node 22.13 or newer (Node 24 recommended):

```bash
git clone https://github.com/LukeOsland1/row-fixer-plus.git
cd row-fixer-plus
npm ci
npm run build
```

`build/` now holds the unpacked extension. To load it:

- **Chrome or Edge** — open `chrome://extensions` (or `edge://extensions`), turn on **Developer mode**, click **Load unpacked**, and pick `build`.
- **Firefox** — run `npm run zip` and load `zip/Firefox v*.zip` through `about:debugging` as above.

Refresh YouTube afterwards. Rebuilt it? Reload the extension on the extensions page, then refresh YouTube again.

`npm run zip` also produces the packaged store archives in `zip/`. Build and validation details are in [CONTRIBUTING.md](CONTRIBUTING.md), [Firefox submission and reviewer notes](docs/FIREFOX_STORE.md), and [the shared release workflow](docs/RELEASING.md).

> If you have the original YouTube Row Fixer installed, disable it — the two will fight over the same layout.

## 🧑‍💻 Contributing

Issues and pull requests are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for the dev setup.

## 💰 Support

If this saved you some scrolling, you can [buy me a coffee](https://ko-fi.com/lukeosland). Entirely optional.

## 🔒 Privacy

Your settings stay in your browser. No account, no analytics, no tracking, nothing sent anywhere. See [PRIVACY.md](PRIVACY.md).

## ©️ Credit

- [Sapondanai Sriwan](https://github.com/sapondanaisriwan) — [YouTube Row Fixer](https://github.com/sapondanaisriwan/youtube-row-fixer), the original this is built on
- [cyfung1031](https://github.com/cyfung1031) — [ytZara](https://github.com/cyfung1031/ytZara)
- [mospira](https://github.com/sapondanaisriwan/youtube-row-fixer/pull/97) — upstream startup fix

## ©️ License

[MIT](LICENSE)

<div align="center">
<sub>Not affiliated with, endorsed by, or sponsored by YouTube or Google. YouTube is a trademark of Google LLC.</sub>
</div>
