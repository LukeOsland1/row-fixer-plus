# Chrome Web Store release preparation

## Draft listing

**Name:** Row Fixer Plus

**Naming note:** the product name must not contain "YouTube" or a variant of it; YouTube is referenced descriptively in the summary and description only. See https://developers.google.com/youtube/terms/branding-guidelines

**Summary:** Customise your YouTube grid, hide Shorts and Playables, and enjoy a cleaner feed with your own layout.

**Single purpose:** Let users customise the layout and visible content of YouTube pages.

**Description:**

Make your YouTube feed fit you. Choose how many videos appear in each row, give channel pages their own layout, and hide content you would rather skip.

- Adjust videos, Shorts, and community posts per row.
- Hide Shorts, Playables, and channel avatars.
- Show full video titles and use a wider channel layout.
- Choose a light or dark popup that matches YouTube's own interface.
- Keep your preferences on your device, with no account or analytics.

Row Fixer Plus is an independent fork of the MIT-licensed YouTube Row Fixer project. It includes fixes for startup reliability and channel settings, plus Playables filtering and a redesigned settings popup. Original contributors are credited in the extension.

Not affiliated with or endorsed by YouTube or Google.

## Permissions and privacy answers

- storage: save layout and visibility preferences locally.
- scripting: register bundled scripts that apply settings on YouTube.
- https://www.youtube.com/*: read and modify YouTube page elements to provide the extension's single purpose.
- Remote code: none. All executed extension code is bundled in the ZIP.
- Data collection: no developer collection or transmission. Settings remain local. Review dashboard definitions before making the final declarations.

Privacy policy URL: https://github.com/LukeOsland1/row-fixer-plus/blob/main/PRIVACY.md. The package also includes privacy.html.

## Still needed before submission

1. In your developer dashboard, confirm account verification and registration are complete.
2. The listing is published at https://chromewebstore.google.com/detail/row-fixer-plus/kdcmbgcilanlmlcilgenlioaicoonhmp (extension ID `kdcmbgcilanlmlcilgenlioaicoonhmp`). Use `zip/Chrome v1.2.0.zip` for the next update. It contains the manifest at the ZIP root. See [automated releases](RELEASING.md).
3. Use the draft listing and privacy answers above. Upload `public/images/row-fixer-plus-128.png`, the two 1280×800 images in `docs/store-assets`, and `promo-440x280.png`.
4. The user completed the initial store upload and submission. The connected browser tool cannot script the Chrome Web Store dashboard; future releases can use the API workflow once credentials are configured.
5. Done: `storeUrl` in `src/data/brand.json` points at the published listing, so the popup shows the rating link. Rebuild to pick it up.

## Prepared and verified

- Current black, white, and red artwork, captured from the packaged popup with `npm run screenshots`.
- Automated Chrome for Testing checks for saved home/channel settings, content visibility, and enabled/disabled state across browser restarts. The content test uses a controlled YouTube fixture; live YouTube can change independently.
- Live smoke check on 21 September 2026 in Chrome 153: changing the row setting to seven updated the live YouTube grid; Shorts and Playables styles were injected. This is a smoke check, not coverage of every YouTube page or experiment.
- Archive checks for matching versions, icons, bundled scripts, privacy pages, and licence notices.
- CI builds and checks the packages on pull requests and main.
- Support link: https://ko-fi.com/lukeosland. No account, analytics, or tracking is added by the extension.

## Official references

- MIT permissions and retained notices: https://opensource.org/license/mit
- Developer registration: https://developer.chrome.com/docs/webstore/register
- Privacy fields: https://developer.chrome.com/docs/webstore/cws-dashboard-privacy
- Store policy FAQ: https://developer.chrome.com/docs/webstore/program-policies/spam-faq

Store approval is separate from MIT licensing. Google's FAQ says competing extensions from unrelated publishers are not considered repetitive content; every extension still goes through review.

Prepared assets follow [Chrome’s image dimensions](https://developer.chrome.com/docs/webstore/images). Screenshots show the real built popup with representative local settings; they are not evidence of Chrome Web Store approval.
