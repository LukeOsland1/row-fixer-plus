# Privacy — Row Fixer Plus for YouTube

Last updated: 21 September 2026.

Row Fixer Plus for YouTube is maintained by Luke Osland. It customises YouTube's layout and hides selected content. It does not collect, sell, or transmit personal data to its developer, and includes no analytics or advertising.

Layout, visibility, and popup appearance preferences are saved using Chrome's local extension storage. The extension does not sync these settings. Removing the extension clears its stored preferences.

The extension reads and modifies YouTube page elements to adjust the grid and hide selected content. It does not record browsing history, searches, account details, or watch history.

Storage permission saves preferences. Scripting permission registers the local scripts that apply them. Access to www.youtube.com allows those scripts to work on YouTube.

Project, support, and optional donation or store links open only when clicked. Their destinations have their own privacy policies. Payment information is handled by a donation provider, never by this extension.

Project and maintainer details: https://github.com/LukeOsland1/row-fixer-plus

This policy will be updated if the extension's data practices change.

## Maintainer release automation

The separate Row Fixer Plus Release Pipeline OAuth app is used by the maintainer to upload and publish extension releases in the Chrome Web Store. Extension users do not sign in to this app or provide it with Google account access.

The pipeline uses the Chrome Web Store OAuth permission to upload packages, read publication status, and submit releases. Its client secret and refresh token are stored as encrypted GitHub Actions secrets and used during authorised release jobs. Google processes the authorisation and store requests; GitHub runs the release jobs. These credentials are not included in the extension or published in the repository.

Google account access is used only for release administration, not advertising or sale of data. The maintainer can revoke access through Google Account permissions and remove the corresponding GitHub secrets. Use of information received from Google APIs adheres to the Google API Services User Data Policy, including its Limited Use requirements.
