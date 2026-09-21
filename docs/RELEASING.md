# Releasing both browser extensions

`package.json` is the version source. Run `npm version 1.0.2 --no-git-tag-version` for the next release; its lifecycle script updates both store manifests, the development manifest, and the popup version. npm updates the lockfile. CI rejects mismatches. Never delete a Mozilla version to reuse its number: deletion does not free the number.

## One-time API setup

In [repository Actions settings](https://github.com/LukeOsland1/row-fixer-plus/settings/secrets/actions), add these repository secrets. Enter credentials in GitHub's secret fields, not in source files, issues, or chat.

| Secret | Source |
| --- | --- |
| `CWS_CLIENT_ID` | Google OAuth client with the Chrome Web Store API enabled |
| `CWS_CLIENT_SECRET` | The same Google OAuth client |
| `CWS_REFRESH_TOKEN` | Refresh token authorised by the publisher account for `https://www.googleapis.com/auth/chromewebstore` |
| `AMO_JWT_ISSUER` | Mozilla Add-ons API key / JWT issuer |
| `AMO_JWT_SECRET` | Matching Mozilla Add-ons API secret |

Follow [Google's OAuth setup](https://developer.chrome.com/docs/webstore/using-api) and [Mozilla's signing credentials instructions](https://extensionworkshop.com/documentation/develop/web-ext-command-reference/#web-ext-sign). A browser login does not provide these CI credentials. Configure a durable OAuth app/token rather than relying on an expiring test token.

The Google Cloud project is **Row Fixer Plus** (`radiant-shard-509314-u7`). Its OAuth app is **Row Fixer Plus Release Pipeline**, and its web client is **Row Fixer Plus GitHub Releases**, with `https://developers.google.com/oauthplayground` as its redirect URI. The Chrome Web Store API is enabled and the OAuth app is in production. Generate the refresh token using this client's credentials and only the `https://www.googleapis.com/auth/chromewebstore` scope, signed in as the store publisher. Google may show an unverified-app screen for a personal Chrome Web Store publishing client; the publisher must review and complete consent.

Repository Actions variables:

| Variable | Current value |
| --- | --- |
| `CWS_PUBLISHER_ID` | `338d1fac-1d42-4766-9f88-ad37fbfbb3ec` |
| `CWS_EXTENSION_ID` | `kdcmbgcilanlmlcilgenlioaicoonhmp` |

Confirm the publisher ID against the Chrome dashboard's Publisher Settings before the first API submission. Firefox uses `row-fixer-plus@lukeosland1` from its manifest. The workflow always submits Firefox to the **listed** channel and supplies the MIT licence, source archive, release notes, and reviewer instructions.

The initial Chrome listing, images, contact verification, and privacy declarations were completed before its first 1.0.0 submission. Firefox 1.0.1 was submitted to the listed channel with matching source and reviewer notes; its icon, two screenshots, and support link are saved. Check current review status in each dashboard. Do not cancel Chrome's pending 1.0.0 review simply to run the new pipeline.

## Release sequence

1. Bump the shared version and add `releases/<version>.md`. Commit, open a PR, and merge after CI passes.
2. Tag the merged commit, for example `git tag v1.0.1`, then `git push origin v1.0.1`.
3. **Build release** audits, builds, validates Firefox, and runs package/browser/publishing tests. It creates a GitHub release containing both ZIPs, the matching Firefox source, validation report, checksums, and commit provenance. Existing releases are not overwritten.
4. Run **Submit store release** in GitHub Actions with that tag and target **both**. This explicit dispatch is the store submission action; pushing a tag only creates downloadable artifacts.
5. Check each store's result. A successful submission is not approval. The stores review independently, so the workflow keeps package versions aligned but cannot guarantee simultaneous publication.

The publishing workflow downloads the exact GitHub release artifacts, verifies their hashes, manifests, and source commit, then submits each store in its own job. Chrome uses API v2. Firefox uses pinned `web-ext` and repackages the extracted Firefox ZIP contents for signing, with the exact matching source archive supplied separately.

After creating the public Firefox listing, run **Publish Firefox listing artwork** from main to upload the current icon and add the two store screenshots with captions. This uses Mozilla's API and the same two secrets, without submitting another extension version. It skips screenshots with matching captions and preserves existing images; to replace a screenshot later, review and remove the old image in the dashboard first. An interrupted upload without a caption stops a retry for manual inspection to prevent duplicates.

Mozilla shares upload rate limits across submission and artwork requests. The artwork workflow honours `Retry-After`, allowing up to 65 minutes for rate-limit waits. When resuming after a partial upload, disable **update_icon** to avoid spending another request on an already saved icon. Captions are read in the listing's British English locale.

## Failed or partial submissions

All selected credentials must be configured before either store job starts. Invalid credentials or store-specific review blockers can still make one job fail after the other succeeds. Retry only the failed store using the same tag and target **chrome** or **firefox**.

Chrome skips a version already published or pending review, and stops if another version is pending. It never automatically cancels reviews. An ambiguous network failure or duplicate Firefox version needs a dashboard status check before retrying; the workflow does not delete or replace submitted versions. If Firefox accepted the version, finish its listing/review in the dashboard rather than uploading that number again.

For local release preparation after committing changes:

```sh
npm ci
npm run build
npm run zip
npm run lint:firefox
npm test
npm run release:prepare
```

The final files are in `zip/release/`. `npm run release:verify` checks them again without publishing. `npm run release:submit -- both --preflight` checks only that required credential names are configured, without sending a request. It does not authenticate against either store.
