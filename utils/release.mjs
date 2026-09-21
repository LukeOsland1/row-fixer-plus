import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import AdmZip from "adm-zip";

const json = async (file) => JSON.parse(await readFile(file, "utf8"));
const { version } = await json("package.json");
const dir = "zip/release";
const names = [
  `Chrome.v${version}.zip`,
  `Firefox.v${version}.zip`,
  `Firefox-source-v${version}.zip`,
  "firefox-validation.json",
  "release.json",
];
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const git = (...args) => execFileSync("git", args, { encoding: "utf8" }).trim();

execFileSync(process.execPath, ["utils/sync-version.mjs", "--check"], {
  stdio: "inherit",
});
if (process.argv[2] === "prepare") {
  if (git("status", "--porcelain", "--untracked-files=no")) {
    throw new Error(
      "Commit tracked changes before archiving matching release source.",
    );
  }
  await mkdir(dir, { recursive: true });
  for (const browser of ["Chrome", "Firefox"]) {
    await copyFile(
      `zip/${browser} v${version}.zip`,
      `${dir}/${browser}.v${version}.zip`,
    );
  }
  git(
    "archive",
    "--format=zip",
    `--output=${dir}/Firefox-source-v${version}.zip`,
    "HEAD",
  );
  await copyFile(
    "zip/firefox-validation.json",
    `${dir}/firefox-validation.json`,
  );
  await copyFile(`releases/${version}.md`, `${dir}/RELEASE_NOTES.md`);
  await writeFile(
    `${dir}/release.json`,
    JSON.stringify({ version, commit: git("rev-parse", "HEAD") }, null, 2) +
      "\n",
  );
  const checksums = [];
  for (const name of [...names, "RELEASE_NOTES.md"]) {
    checksums.push(`${hash(await readFile(`${dir}/${name}`))}  ${name}`);
  }
  await writeFile(`${dir}/SHA256SUMS.txt`, checksums.join("\n") + "\n");
} else if (process.argv[2] !== "verify") {
  throw new Error("Use prepare or verify.");
}

const checksums = await readFile(`${dir}/SHA256SUMS.txt`, "utf8");
for (const name of [...names, "RELEASE_NOTES.md"]) {
  const expected = `${hash(await readFile(`${dir}/${name}`))}  ${name}`;
  if (!checksums.split(/\r?\n/).includes(expected))
    throw new Error(`Checksum mismatch: ${name}`);
}
const provenance = await json(`${dir}/release.json`);
if (
  provenance.version !== version ||
  provenance.commit !== git("rev-parse", "HEAD")
) {
  throw new Error(
    "Release artifacts do not match this checked-out commit/version.",
  );
}
for (const browser of ["Chrome", "Firefox"]) {
  const zip = new AdmZip(`${dir}/${browser}.v${version}.zip`);
  const manifest = JSON.parse(zip.readAsText("manifest.json"));
  const expected = await json(
    `extension/manifest-${browser.toLowerCase()}.json`,
  );
  if (JSON.stringify(manifest) !== JSON.stringify(expected))
    throw new Error(`${browser} manifest mismatch`);
}
const source = new AdmZip(`${dir}/Firefox-source-v${version}.zip`);
for (const file of [
  "package.json",
  "package-lock.json",
  "extension/manifest-firefox.json",
]) {
  if (
    source.readAsText(file).replace(/\r\n/g, "\n") !==
    (await readFile(file, "utf8")).replace(/\r\n/g, "\n")
  ) {
    throw new Error(`Source archive mismatch: ${file}`);
  }
}
const report = await json(`${dir}/firefox-validation.json`);
if (report.summary.errors !== 0)
  throw new Error("Firefox package has validation errors.");
console.log(
  `Verified ${version}: both packages, source, checksums, and commit ${provenance.commit}`,
);
