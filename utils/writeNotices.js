const fs = require("fs/promises");
const path = require("path");
const brand = require("../src/data/brand.json");

const escapeHtml = (value) =>
  value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }[character])
  );

const document = (title, body) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title} — ${brand.name}</title><style>
body{max-width:780px;margin:60px auto;padding:0 24px;background:#171225;color:#f9f4ff;font:16px/1.7 Arial,sans-serif}
h1{font-size:36px;line-height:1.2;letter-spacing:-1px}h2{font-size:22px;margin-top:36px}a{color:#c2a9ff}
pre{white-space:pre-wrap;overflow-wrap:anywhere;background:#221b34;border:1px solid #3b2e4f;padding:20px;border-radius:12px;font:13px/1.6 monospace}
.brand{color:#ff9fb7;font-weight:bold}small{color:#b5a5ce}
</style></head><body><p class="brand">${brand.name}</p><h1>${title}</h1>${body}</body></html>`;

module.exports = async (directory) => {
  const rootLicense = await fs.readFile("LICENSE", "utf8");
  const library = await fs.readFile(
    "src/content-scripts/inject/lib/ytZara.js",
    "utf8"
  );
  const ytZaraLicense = library
    .slice(library.indexOf("MIT License"), library.indexOf("*/"))
    .trim();
  const notices = [
    `${brand.name}\n\n${rootLicense}`,
    `ytZara — cyfung1031\nhttps://github.com/cyfung1031\n\n${ytZaraLicense}`,
  ];
  const visited = new Set();
  const visit = async (name, from) => {
    let cursor = from;
    let packageFile;
    while (cursor !== path.dirname(cursor)) {
      const candidate = path.join(cursor, "node_modules", name, "package.json");
      try {
        await fs.access(candidate);
        packageFile = candidate;
        break;
      } catch {
        cursor = path.dirname(cursor);
      }
    }
    if (!packageFile || visited.has(packageFile)) return;
    visited.add(packageFile);
    const metadata = JSON.parse(await fs.readFile(packageFile, "utf8"));
    const packageDir = path.dirname(packageFile);
    const entries = await fs.readdir(packageDir, { withFileTypes: true });
    const licenseFiles = entries.filter(
      (entry) =>
        entry.isFile() &&
        /^(licen[cs]e|copying|notice)([.-]|$)/i.test(entry.name)
    );
    const texts = await Promise.all(
      licenseFiles.map((entry) =>
        fs.readFile(path.join(packageDir, entry.name), "utf8")
      )
    );
    if (!texts.length) throw new Error(`Missing licence notice for ${name}`);
    notices.push(
      `${metadata.name} ${metadata.version}\n\n${texts.join("\n\n")}`
    );
    for (const dependency of Object.keys(metadata.dependencies || {}))
      await visit(dependency, packageDir);
  };
  for (const name of ["next", "react", "react-dom"])
    await visit(name, process.cwd());
  const allNotices = notices.join(
    "\n\n----------------------------------------\n\n"
  );
  await fs.writeFile(path.join(directory, "LICENSE.txt"), rootLicense);
  await fs.writeFile(
    path.join(directory, "THIRD_PARTY_NOTICES.txt"),
    allNotices
  );
  await fs.writeFile(
    path.join(directory, "credits.html"),
    document(
      "Credits & licences",
      `
<p>This independent fork is maintained by ${
        brand.author
      }. It builds on <a href="https://github.com/sapondanaisriwan/youtube-row-fixer">YouTube Row Fixer</a> by Sapondanai Sriwan and uses ytZara by cyfung1031.</p>
<p>The upstream startup fix was contributed by <a href="https://github.com/sapondanaisriwan/youtube-row-fixer/pull/97">mospira</a>. The original contributors retain copyright in their work.</p>
<p>Not affiliated with or endorsed by YouTube or Google. YouTube is a trademark of Google LLC.</p>
<p><a href="${
        brand.repositoryUrl
      }">Source code</a> · <a href="THIRD_PARTY_NOTICES.txt">Download notices</a></p>
<pre>${escapeHtml(allNotices)}</pre>`
    )
  );
  await fs.writeFile(
    path.join(directory, "privacy.html"),
    document(
      "Privacy",
      `
<p><small>Last updated: 21 September 2026</small></p>
<p>${brand.name} customises YouTube's layout and hides selected content. It does not collect, sell, or transmit personal data to its developer, and does not include analytics or advertising.</p>
<h2>What stays on your device</h2><p>Layout, visibility, and popup appearance preferences are saved using Chrome's local extension storage. Preferences are not synced by this extension. Removing the extension clears its stored preferences.</p>
<h2>Access to YouTube</h2><p>The extension reads and modifies YouTube page elements to adjust the grid and hide selected content. It does not record your browsing history, searches, account details, or watch history.</p>
<h2>Permissions</h2><p><strong>Storage</strong> saves your preferences. <strong>Scripting</strong> registers the local scripts that apply them. <strong>Access to www.youtube.com</strong> allows those scripts to work on YouTube.</p>
<h2>External links</h2><p>Project, support, and any optional donation or store links open only when you click them. Those sites apply their own privacy policies. Payment information is handled by the donation provider, never by this extension.</p>
<h2>Contact and changes</h2><p>Project and maintainer details are available in the <a href="${brand.repositoryUrl}">source repository</a>. This policy will be updated if the extension's data practices change.</p>`
    )
  );
};
