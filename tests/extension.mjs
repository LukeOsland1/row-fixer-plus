import { chromium } from "@playwright/test";
import path from "node:path";

export async function openExtension(profile, options = {}) {
  const extension = path.resolve("build");
  const channel = process.env.RFP_BROWSER_CHANNEL || "chromium";
  const context = await chromium.launchPersistentContext(profile, {
    channel,
    headless: true,
    viewport: { width: 1280, height: 900 },
    ignoreDefaultArgs: ["--disable-extensions"],
    args:
      channel === "chromium"
        ? [
            `--disable-extensions-except=${extension}`,
            `--load-extension=${extension}`,
          ]
        : ["--enable-unsafe-extension-debugging"],
    ...options,
  });
  if (channel !== "chromium") {
    // Branded Chrome uses the supported DevTools command instead of --load-extension.
    // This browser has only the isolated test profile, never a user's normal profile.
    const cdp = await context.browser().newBrowserCDPSession();
    await cdp.send("Extensions.loadUnpacked", { path: extension });
    await cdp.detach();
  }
  const worker =
    context.serviceWorkers()[0] ||
    (await context.waitForEvent("serviceworker"));
  const id = new URL(worker.url()).host;
  const popup = await context.newPage();
  await popup.goto(`chrome-extension://${id}/index.html`);
  await popup.getByRole("switch", { name: "Extension enabled" }).waitFor();
  await popup.waitForFunction(() =>
    [...document.querySelectorAll("input,button")].every((el) => !el.disabled),
  );
  return { context, worker, popup, id };
}
