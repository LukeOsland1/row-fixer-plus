import { test, expect } from "@playwright/test";
import { openExtension } from "./extension.mjs";

const fixture = `<!doctype html><html><head><style>
ytd-rich-section-renderer,ytd-rich-item-renderer,ytd-rich-grid-renderer {display:block;min-height:40px}
</style></head><body><ytd-page-manager><div page-subtype="home">
<ytd-rich-grid-renderer id="grid"></ytd-rich-grid-renderer>
<ytd-rich-section-renderer id="shorts"><a href="/shorts/test">Shorts</a></ytd-rich-section-renderer>
<ytd-rich-section-renderer id="games"><a href="/playables/test">Game</a></ytd-rich-section-renderer>
</div></ytd-page-manager><script>
customElements.define('ytd-rich-grid-renderer',class extends HTMLElement {
  constructor(){super();this.hostElement=this;this.isChannelPage=false;}
  calcElementsPerRow(){return 3;} calcMaxSlimElementsPerRow(){return 3;} refreshGridLayout(){}
});
customElements.define('ytd-rich-shelf-renderer',class extends HTMLElement {refreshGridLayoutNew(){}});
</script></body></html>`;

test("settings and enabled state survive browser restarts; content scripts follow them", async ({}, testInfo) => {
  const profile = testInfo.outputPath("profile");
  let session;
  const errors = [];
  const start = async () => {
    session = await openExtension(profile);
    session.popup.on("pageerror", (error) => errors.push(error.message));
    await session.context.route("https://www.youtube.com/**", (route) =>
      route.fulfill({ contentType: "text/html", body: fixture }),
    );
    return session;
  };
  try {
    let { popup, worker, context } = await start();
    await expect
      .poll(() =>
        worker.evaluate(
          async () =>
            (await chrome.scripting.getRegisteredContentScripts()).length,
        ),
      )
      .toBe(2);
    const rows = popup.getByRole("spinbutton", {
      name: "Videos per row, exact value",
    });
    await rows.fill("8");
    await rows.press("Enter");
    await popup
      .getByRole("button", { name: "Channel pages", exact: true })
      .click();
    await rows.fill("6");
    await rows.press("Enter");
    await popup.getByRole("button", { name: "Home feed", exact: true }).click();
    await expect(rows).toHaveValue("8");
    for (const name of ["Shorts shelves", "Playables"])
      await popup.getByRole("switch", { name, exact: true }).click();
    const youtube = await context.newPage();
    youtube.on("pageerror", (error) => errors.push(error.message));
    await youtube.goto("https://www.youtube.com/");
    await expect(youtube.locator("#shorts")).toBeHidden();
    await expect(youtube.locator("#games")).toBeHidden();
    await expect
      .poll(() =>
        youtube
          .locator("#grid")
          .evaluate((el) =>
            el.style.getPropertyValue("--ytd-rich-grid-items-per-row"),
          ),
      )
      .toBe("8");
    await popup.getByRole("switch", { name: "Extension enabled" }).click();
    await expect
      .poll(() =>
        worker.evaluate(
          async () =>
            (await chrome.scripting.getRegisteredContentScripts()).length,
        ),
      )
      .toBe(0);
    await context.close();

    ({ popup, worker, context } = await start());
    await expect(
      popup.getByRole("switch", { name: "Extension enabled" }),
    ).toHaveAttribute("aria-checked", "false");
    await expect(
      popup.getByRole("spinbutton", { name: "Videos per row, exact value" }),
    ).toHaveValue("8");
    await expect
      .poll(() =>
        worker.evaluate(
          async () =>
            (await chrome.scripting.getRegisteredContentScripts()).length,
        ),
      )
      .toBe(0);
    const disabledPage = await context.newPage();
    await disabledPage.goto("https://www.youtube.com/");
    await expect(disabledPage.locator("#shorts")).toBeVisible();
    await expect(disabledPage.locator("#games")).toBeVisible();
    await expect(disabledPage.locator("style.RFYT")).toHaveCount(0);
    await popup.getByRole("switch", { name: "Extension enabled" }).click();
    await expect
      .poll(() =>
        worker.evaluate(
          async () =>
            (await chrome.scripting.getRegisteredContentScripts()).length,
        ),
      )
      .toBe(2);
    await context.close();

    ({ popup, worker, context } = await start());
    await expect(
      popup.getByRole("switch", { name: "Extension enabled" }),
    ).toHaveAttribute("aria-checked", "true");
    await popup
      .getByRole("button", { name: "Channel pages", exact: true })
      .click();
    await expect(
      popup.getByRole("spinbutton", { name: "Videos per row, exact value" }),
    ).toHaveValue("6");
    await expect
      .poll(() =>
        worker.evaluate(
          async () =>
            (await chrome.scripting.getRegisteredContentScripts()).length,
        ),
      )
      .toBe(2);
    const enabledPage = await context.newPage();
    await enabledPage.goto("https://www.youtube.com/");
    await expect(enabledPage.locator("#shorts")).toBeHidden();
    await expect(enabledPage.locator("#games")).toBeHidden();
    expect(errors).toEqual([]);
  } finally {
    await session?.context.close();
  }
});
