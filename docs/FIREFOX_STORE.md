# Firefox submission

Upload `zip/Firefox v1.0.0.zip` for the first submission. The failed validation did not establish a signed version, so this correction keeps version 1.0.0. The package requires Firefox 142 or newer. Android support is not declared or tested.

The manifest declares `browser_specific_settings.gecko.data_collection_permissions.required` as `["none"]`: the extension does not collect or transmit personal data. Layout settings are stored locally. See the [privacy policy](../PRIVACY.md) and [Mozilla's data-consent documentation](https://extensionworkshop.com/documentation/develop/firefox-builtin-data-consent/). The minimum version includes support for the consent declaration and Manifest V3 APIs used by this extension.

## Build and validate

Use Node.js 24 and the source archive attached to the corrected Firefox release package. From the extracted repository root:

```sh
npm ci
npm run build
npm run zip
npm run lint:firefox
```

The Firefox ZIP is written to `zip/Firefox v1.0.0.zip`. Validation uses Mozilla's pinned `addons-linter`; all files are scanned, errors fail the command, and warnings remain visible. The full report is `zip/firefox-validation.json`. ZIP timestamps can differ between builds.

## Reviewer notes

The corrected 1.0.0 package produces zero errors, two warnings, and zero notices with `addons-linter` 10.13.0. Both `UNSAFE_VAR_ASSIGNMENT` warnings in the generated popup JavaScript come from the unmodified React DOM 18.3.1 renderer, installed from the locked npm dependency. The relevant code is in `node_modules/react-dom/cjs/react-dom.production.min.js`: its HTML assignment helper and SVG fallback assign `innerHTML`.

The extension's own source does not use `innerHTML` or `dangerouslySetInnerHTML`. Popup values are rendered through React text and attribute APIs. No HTML strings from users or YouTube are passed to React's raw-HTML rendering API. React has not been patched to hide these warnings. The source archive, lockfile, and build commands above allow review of the original modules and bundled output.

Validation is not signing or store approval. A final Firefox smoke test should load the package temporarily from `about:debugging`, exercise the layout and hide controls on YouTube, and confirm settings persist after closing and reopening the popup. Normal distribution requires Mozilla signing.
