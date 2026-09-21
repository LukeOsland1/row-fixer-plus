import { execFileSync } from "node:child_process";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import AdmZip from "adm-zip";
import { publishChrome } from "./modules/chrome-publish.mjs";

const target = process.argv[2];
if (!["chrome", "firefox", "both"].includes(target))
  throw new Error("Select chrome, firefox, or both.");
const needed = {
  chrome: [
    "CWS_PUBLISHER_ID",
    "CWS_EXTENSION_ID",
    "CWS_CLIENT_ID",
    "CWS_CLIENT_SECRET",
    "CWS_REFRESH_TOKEN",
  ],
  firefox: ["AMO_JWT_ISSUER", "AMO_JWT_SECRET"],
};
const targets = target === "both" ? ["chrome", "firefox"] : [target];
const missing = targets
  .flatMap((store) => needed[store])
  .filter((key) => !process.env[key]);
if (missing.length)
  throw new Error(
    `Configure GitHub Actions secrets/variables: ${missing.join(", ")}`,
  );
if (process.argv.includes("--preflight")) {
  console.log(
    `Credentials configured for ${targets.join(" and ")}; values are not displayed.`,
  );
} else {
  if (target === "both")
    throw new Error("Submit each store as its own workflow job.");
  execFileSync(process.execPath, ["utils/release.mjs", "verify"], {
    stdio: "inherit",
  });
  const { version } = JSON.parse(await readFile("package.json", "utf8"));
  const dir = "zip/release";
  if (target === "chrome") {
    console.log(
      await publishChrome({
        version,
        archive: await readFile(`${dir}/Chrome.v${version}.zip`),
        publisherId: process.env.CWS_PUBLISHER_ID,
        itemId: process.env.CWS_EXTENSION_ID,
        clientId: process.env.CWS_CLIENT_ID,
        clientSecret: process.env.CWS_CLIENT_SECRET,
        refreshToken: process.env.CWS_REFRESH_TOKEN,
      }),
    );
  } else {
    const stage = await mkdtemp("zip/firefox-upload-");
    new AdmZip(`${dir}/Firefox.v${version}.zip`).extractAllTo(stage);
    const metadata = JSON.parse(
      await readFile("releases/amo-metadata.json", "utf8"),
    );
    metadata.version.release_notes = {
      "en-GB": await readFile(`${dir}/RELEASE_NOTES.md`, "utf8"),
    };
    await writeFile(`${stage}-metadata.json`, JSON.stringify(metadata));
    execFileSync(
      process.execPath,
      [
        "node_modules/web-ext/bin/web-ext.js",
        "sign",
        "--channel=listed",
        "--no-input",
        "--no-config-discovery",
        "--approval-timeout=0",
        `--source-dir=${resolve(stage)}`,
        `--artifacts-dir=${resolve("zip/signed")}`,
        `--amo-metadata=${resolve(`${stage}-metadata.json`)}`,
        `--upload-source-code=${resolve(`${dir}/Firefox-source-v${version}.zip`)}`,
      ],
      {
        stdio: "inherit",
        env: {
          ...process.env,
          WEB_EXT_API_KEY: process.env.AMO_JWT_ISSUER,
          WEB_EXT_API_SECRET: process.env.AMO_JWT_SECRET,
        },
      },
    );
    console.log(
      "Firefox submitted to the listed channel; approval is separate from submission.",
    );
  }
}
