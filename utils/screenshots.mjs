import { chromium, expect } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";
import { openExtension } from "../tests/extension.mjs";
import brand from "../src/data/brand.json" with { type: "json" };

// Capture the packaged extension with real Chrome storage, in a disposable profile.
const { context, worker, popup } = await openExtension("", {
  viewport: { width: 380, height: 600 },
  deviceScaleFactor: 2,
  reducedMotion: "reduce",
});
try {
  await worker.evaluate(() =>
    chrome.storage.local.set({ extensionTheme: false }),
  );
  await expect(popup.locator("html")).not.toHaveClass("dark");
  const capture = async (name) => {
    await popup.mouse.move(0, 0);
    await popup.evaluate(() => document.activeElement?.blur());
    await popup.evaluate(() => document.fonts.ready);
    await popup
      .locator(".extension-shell")
      .screenshot({
        path: `docs/screenshots/${name}.png`,
        animations: "disabled",
      });
  };
  await capture("layout-light");
  await popup
    .getByRole("button", { name: "Switch to dark appearance" })
    .click();
  await expect(popup.locator("html")).toHaveClass("dark");
  await capture("layout-dark");
  for (const name of ["Shorts shelves", "Playables"])
    await popup.getByRole("switch", { name, exact: true }).click();
  await capture("hide-dark");
  await popup
    .getByRole("button", { name: "Switch to light appearance" })
    .click();
  await popup.getByRole("button", { name: "About this extension" }).click();
  await capture("about-light");
} finally {
  await context.close();
}

const dataUrl = async (file, type = "image/png") =>
  `data:${type};base64,${(await fs.readFile(file)).toString("base64")}`;
const logo = await dataUrl("public/images/row-fixer-plus.svg", "image/svg+xml");
const browser = await chromium.launch({
  channel: process.env.RFP_BROWSER_CHANNEL || "chromium",
  headless: true,
});
try {
  const page = await browser.newPage({ deviceScaleFactor: 1 });
  async function render(file, width, height, content, extra = "") {
    await page.setViewportSize({ width, height });
    await page.setContent(`<!doctype html><html><head><style>
      *{box-sizing:border-box}body{margin:0;background:#f7f7f7;color:#0f0f0f;font-family:Arial,sans-serif}
      .brand{display:flex;align-items:center;gap:12px;font-size:23px;font-weight:700;letter-spacing:-.5px}.brand img{width:58px;height:58px}
      .eyebrow{font-size:13px;letter-spacing:2.8px;font-weight:700;color:#c00;text-transform:uppercase}
      h1{font-size:66px;line-height:1.04;letter-spacing:-3px;margin:30px 0 24px;max-width:600px}
      p{font-size:22px;line-height:1.5;color:#606060;max-width:530px;margin:0}
      .shot{position:absolute;right:82px;top:100px;width:380px;height:600px;box-shadow:0 12px 45px #0002;border-radius:12px;outline:1px solid #ddd}
      .copy{padding:62px 0 0 68px}.copy .eyebrow{margin-top:80px}.benefits{margin-top:32px;display:grid;gap:13px;font-size:18px;font-weight:600}.benefits span:before{content:'✓';color:#c00;margin-right:12px}
      .foot{position:absolute;bottom:53px;left:74px;font-size:12px;letter-spacing:2px;font-weight:700;color:#606060}
      ${extra}</style></head><body>${content}</body></html>`);
    await page.evaluate(() =>
      Promise.all([...document.images].map((img) => img.decode())),
    );
    await page.screenshot({ path: file });
    console.log(path.normalize(file));
  }
  const brandMarkup = `<div class="brand"><img src="${logo}" alt="">${brand.name}</div>`;
  await render(
    "docs/store-assets/01-layout.png",
    1280,
    800,
    `<div class="copy">${brandMarkup}<div class="eyebrow">A layout that fits you</div><h1>Your feed.<br>Your rules.</h1><p>Choose how many videos fit in a row on YouTube.</p><div class="benefits"><span>Precise row controls</span><span>Separate channel settings</span><span>A live layout preview</span></div></div><img class="shot" src="${await dataUrl("docs/screenshots/layout-light.png")}"><div class="foot">SMALL EXTENSION. MORE CONTROL.</div>`,
  );
  await render(
    "docs/store-assets/02-hide.png",
    1280,
    800,
    `<div class="copy">${brandMarkup}<div class="eyebrow">Less in the way</div><h1>Keep what<br>you watch.</h1><p>Hide Shorts shelves, Playables, and channel avatars.</p><div class="benefits"><span>Your settings stay in your browser</span><span>No account or tracking</span><span>Light and dark appearance</span></div></div><img class="shot" src="${await dataUrl("docs/screenshots/hide-dark.png")}"><div class="foot">YOUR FEED. YOUR RULES.</div>`,
    `body{background:#0f0f0f;color:#f1f1f1}p,.foot{color:#aaa}.eyebrow,.benefits span:before{color:#ff5c5c}.shot{outline-color:#303030;box-shadow:0 15px 60px #0008}.brand img{background:#fff;border-radius:13px}`,
  );
  await render(
    "docs/store-assets/promo-440x280.png",
    440,
    280,
    `<div class="promo">${brandMarkup}<h1>Your feed.<br>Your rules.</h1><p>A cleaner YouTube layout.</p><div class="rule"></div></div>`,
    `.promo{padding:22px 30px}.brand{font-size:15px;gap:4px;margin-left:-8px;letter-spacing:-.35px}.brand img{width:48px;height:48px}h1{font-size:43px;letter-spacing:-1.8px;margin:18px 0 12px}p{font-size:16px}.rule{position:absolute;bottom:0;left:0;width:100%;height:7px;background:#c00}`,
  );
  await render(
    "docs/kofi-assets/cover-1200x400.png",
    1200,
    400,
    `<div class="cover">${brandMarkup}<h1>Your feed. Your rules.</h1><p>More control over your YouTube layout.</p></div><div class="grid"><i></i><i></i><i></i><i></i></div>`,
    `.cover{padding:38px 56px}h1{font-size:52px;max-width:800px;margin-top:35px;letter-spacing:-2px}p{font-size:21px}.grid{position:absolute;right:70px;top:89px;display:grid;grid-template-columns:86px 86px;gap:15px;background:#0f0f0f;padding:24px;border-radius:35px}.grid i{height:75px;background:#fff;border-radius:12px}.grid i:nth-child(2){background:#c00}`,
  );
} finally {
  await browser.close();
}
