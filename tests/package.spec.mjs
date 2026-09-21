import { test, expect } from "@playwright/test";
import fs from "node:fs";
import AdmZip from "adm-zip";

const json = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
test("browser archives contain matching versions, icons, scripts, and licence notices", () => {
  const { version, name } = json("package.json");
  const lock = json("package-lock.json");
  expect(lock.version).toBe(version);
  expect(lock.packages[""].name).toBe(name);
  expect(json("src/data/brand.json").version).toBe(version);
  expect(json("extension/manifest-dev.json").version).toBe(version);
  for (const browser of ["Chrome", "Firefox"]) {
    const zip = new AdmZip(`zip/${browser} v${version}.zip`);
    const manifest = JSON.parse(zip.readAsText("manifest.json"));
    expect(manifest).toEqual(
      json(`extension/manifest-${browser.toLowerCase()}.json`),
    );
    expect(manifest.version).toBe(version);
    for (const [size, file] of Object.entries(manifest.icons)) {
      const png = zip.readFile(file);
      expect(png).toEqual(fs.readFileSync(`public/${file}`));
      expect(png.readUInt32BE(16)).toBe(Number(size));
      expect(png.readUInt32BE(20)).toBe(Number(size));
    }
    for (const file of [
      manifest.action.default_popup,
      manifest.action.default_icon,
      "background.js",
      "content_script.js",
      "inject/bridge.js",
      "inject/inject_script.js",
      "inject/lib/ytZara.js",
      "privacy.html",
      "credits.html",
      "LICENSE.txt",
      "THIRD_PARTY_NOTICES.txt",
    ])
      expect(zip.getEntry(file)).toBeTruthy();
    const notices = zip.readAsText("THIRD_PARTY_NOTICES.txt");
    expect(notices).toContain("react-dom");
    expect(notices).toContain("cyfung1031");
    expect(notices).not.toContain("next 12.");
    const html = zip.readAsText("index.html");
    expect(html).not.toMatch(/<script(?![^>]*\bsrc=)[^>]*>/i);
    for (const match of html.matchAll(/(?:src|href)="([^"#]+)"/g)) {
      expect(match[1]).not.toMatch(/^https?:/);
      expect(zip.getEntry(match[1].replace(/^\.\//, ""))).toBeTruthy();
    }
  }
});
