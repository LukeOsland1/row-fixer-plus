import { readFile, writeFile } from "node:fs/promises";

const read = async (file) => JSON.parse(await readFile(file, "utf8"));
const { version } = await read("package.json");
if (
  !/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(version) ||
  version.split(".").some((part) => Number(part) > 65535)
) {
  throw new Error(
    "Use a numeric major.minor.patch version supported by both stores.",
  );
}
for (const file of [
  "extension/manifest-chrome.json",
  "extension/manifest-firefox.json",
  "extension/manifest-dev.json",
  "src/data/brand.json",
]) {
  const data = await read(file);
  if (process.argv.includes("--check")) {
    if (data.version !== version)
      throw new Error(`${file} must use ${version}`);
  } else {
    data.version = version;
    await writeFile(file, JSON.stringify(data, null, 2) + "\n");
  }
}
const lock = await read("package-lock.json");
if (lock.version !== version || lock.packages[""].version !== version) {
  throw new Error(
    "Run npm version <version> --no-git-tag-version to update the lockfile too.",
  );
}
if (process.env.RELEASE_TAG && process.env.RELEASE_TAG !== `v${version}`) {
  throw new Error(`Release tag must be v${version}`);
}
console.log(`All extension versions: ${version}`);
