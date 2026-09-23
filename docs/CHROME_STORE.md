# Chrome Web Store release preparation

## Draft listing

**Name:** Row Fixer Plus for YouTube

**Naming review:** This requested listing name combines the product name with "YouTube". Google's [Chrome Web Store branding guidelines](https://developer.chrome.com/docs/webstore/branding) recommend "for" to describe compatibility, but the [YouTube API branding guidelines](https://developers.google.com/youtube/terms/branding-guidelines) say not to use "YouTube" in conjunction with an application's overall name. Store acceptance is uncertain. Review the title in the dashboard before submission; a safer fallback is **Row Fixer Plus** with YouTube mentioned in the summary and description.

**Summary:** Customise your YouTube grid, hide Shorts and Playables, and enjoy a cleaner feed with your own layout.

**Single purpose:** Let users customise the layout and visible content of YouTube pages.

**Description:**

Make your YouTube feed fit you. Choose how many videos appear in each row, give channel pages their own layout, and hide content you would rather skip.

- Adjust videos, Shorts, and community posts per row.
- Hide Shorts, Playables, and channel avatars.
- Show full video titles and use a wider channel layout.
- Choose a light or dark popup that matches YouTube's own interface.
- Keep your preferences on your device, with no account or analytics.

Row Fixer Plus for YouTube is an independent fork of the MIT-licensed YouTube Row Fixer project. It includes fixes for startup reliability and channel settings, plus Playables filtering and a redesigned settings popup. Original contributors are credited in the extension.

Not affiliated with or endorsed by YouTube or Google.

YouTube is a trademark of Google LLC. Use of this trademark is subject to Google Permissions.

## Permissions and privacy answers

- storage: save layout and visibility preferences locally.
- scripting: register bundled scripts that apply settings on YouTube.
- https://www.youtube.com/*: read and modify YouTube page elements to provide the extension's single purpose.
- Remote code: none. All executed extension code is bundled in the ZIP.
- Data collection: no developer collection or transmission. Settings remain local. Review dashboard definitions before making the final declarations.

Privacy policy URL: https://github.com/LukeOsland1/row-fixer-plus/blob/main/PRIVACY.md. The package also includes privacy.html.

## Steps for the 1.2.1 name update

1. In the existing [listing's developer dashboard](https://chrome.google.com/webstore/devconsole/), check the **Store listing** tab against the draft above and add the YouTube trademark attribution to its description. Review the title against the naming guidance linked above.
2. Merge the change, then push the new `v1.2.1` tag as described in [the release workflow](RELEASING.md). The workflow uploads the versioned package to the existing listing (extension ID `kdcmbgcilanlmlcilgenlioaicoonhmp`) and submits it for review if the configured credentials work. If submitting manually, upload `zip/Chrome v1.2.1.zip` to that same listing; it contains the manifest at the ZIP root.
3. Check the dashboard for the review outcome and confirm that the visible title has changed. Store review can reject the requested title under YouTube's naming guidance.

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
