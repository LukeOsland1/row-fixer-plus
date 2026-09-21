# Chrome Web Store release preparation

## Draft listing

**Name:** YouTube Row Fixer Plus

**Summary:** Customise your YouTube grid, hide Shorts and Playables, and enjoy a cleaner feed with your own layout.

**Single purpose:** Let users customise the layout and visible content of YouTube pages.

**Description:**

Make your YouTube feed fit you. Choose how many videos appear in each row, give channel pages their own layout, and hide content you would rather skip.

- Adjust videos, Shorts, and community posts per row.
- Hide Shorts, Playables, and channel avatars.
- Show full video titles and use a wider channel layout.
- Choose a light or dark popup with a clear, colourful design.
- Keep your preferences on your device, with no account or analytics.

Plus is an independent fork of the MIT-licensed YouTube Row Fixer project. It includes fixes for startup reliability and channel settings, plus Playables filtering and a redesigned settings popup. Original contributors are credited in the extension.

Not affiliated with or endorsed by YouTube or Google.

## Permissions and privacy answers

- storage: save layout and visibility preferences locally.
- scripting: register bundled scripts that apply settings on YouTube.
- https://www.youtube.com/*: read and modify YouTube page elements to provide the extension's single purpose.
- Remote code: none. All executed extension code is bundled in the ZIP.
- Data collection: no developer collection or transmission. Settings remain local. Review dashboard definitions before making the final declarations.

Use a publicly accessible URL to PRIVACY.md after the release branch is merged, or host the equivalent policy on your own site. The package also includes privacy.html.

## Still needed before submission

1. Register or use your Chrome Web Store developer account, complete its verification requirements, and pay its one-time fee if necessary.
2. Supply your donation URL if you want the optional support link enabled. Set donationUrl in src/data/brand.json and rebuild. Update .github/FUNDING.yml only with your own account.
3. Confirm the final name, design, and listing text. Verify the final Chrome package in an actual browser, including enabled/disabled state after restart.
4. Review the prepared images in docs/store-assets: two 1280×800 screenshots and a 440×280 promotional tile. The 128-pixel package icon includes transparent padding. Avoid claims that the original project is abandoned.
5. Upload zip/Chrome v1.2.0.zip, complete the privacy fields and permission justifications, and submit for review. This project has not been submitted or published by Codex.
6. Once Chrome assigns your listing URL, set storeUrl in src/data/brand.json to enable your own rating link and rebuild for the next update.

## Official references

- MIT permissions and retained notices: https://opensource.org/license/mit
- Developer registration: https://developer.chrome.com/docs/webstore/register
- Privacy fields: https://developer.chrome.com/docs/webstore/cws-dashboard-privacy
- Store policy FAQ: https://developer.chrome.com/docs/webstore/program-policies/spam-faq

Store approval is separate from MIT licensing. Google's FAQ says competing extensions from unrelated publishers are not considered repetitive content; every extension still goes through review.

Prepared assets follow [Chrome’s image dimensions](https://developer.chrome.com/docs/webstore/images). Screenshots show the real built popup with representative local settings; they are not evidence of Chrome Web Store approval.
