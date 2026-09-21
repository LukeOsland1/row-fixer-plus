import { createHmac, randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import { setTimeout as delay } from "node:timers/promises";

const issuer = process.env.AMO_JWT_ISSUER;
const secret = process.env.AMO_JWT_SECRET;
if (!issuer || !secret)
  throw new Error("Configure AMO_JWT_ISSUER and AMO_JWT_SECRET.");
const manifest = JSON.parse(
  await readFile("extension/manifest-firefox.json", "utf8"),
);
const url = `https://addons.mozilla.org/api/v5/addons/addon/${encodeURIComponent(manifest.browser_specific_settings.gecko.id)}/`;
const encode = (value) =>
  Buffer.from(JSON.stringify(value)).toString("base64url");
async function request(path = "", options = {}, attempt = 0) {
  const now = Math.floor(Date.now() / 1000);
  const unsigned = `${encode({ alg: "HS256", typ: "JWT" })}.${encode({ iss: issuer, jti: randomUUID(), iat: now, exp: now + 60 })}`;
  const token = `${unsigned}.${createHmac("sha256", secret).update(unsigned).digest("base64url")}`;
  const response = await fetch(url + path, {
    ...options,
    headers: { ...options.headers, Authorization: `JWT ${token}` },
    signal: AbortSignal.timeout(60_000),
  });
  if (response.status === 429 && attempt < 2) {
    const retryAfter = response.headers.get("retry-after");
    const seconds = retryAfter === null ? 60 : Number(retryAfter);
    const waitMs = Number.isFinite(seconds)
      ? Math.max(1000, seconds * 1000)
      : Math.max(1000, Date.parse(retryAfter) - Date.now());
    if (Number.isFinite(waitMs) && waitMs <= 90_000) {
      await response.body?.cancel();
      console.log(
        `Mozilla rate limit: retrying in ${Math.ceil(waitMs / 1000)} seconds.`,
      );
      await delay(waitMs);
      return request(path, options, attempt + 1);
    }
  }
  if (!response.ok)
    throw new Error(
      `Mozilla artwork request failed: HTTP ${response.status}. Inspect the listing before retrying.`,
    );
  return response.json();
}
const listing = await request();
const icon = new FormData();
icon.set(
  "icon",
  new Blob([await readFile("public/images/row-fixer-plus-128.png")], {
    type: "image/png",
  }),
  "row-fixer-plus-128.png",
);
await request("", { method: "PATCH", body: icon });
console.log("Uploaded the current 128px icon.");
const images = [
  [
    "docs/store-assets/01-layout.png",
    "Customise your YouTube grid with separate channel settings.",
  ],
  [
    "docs/store-assets/02-hide.png",
    "Hide Shorts, Playables, and channel avatars.",
  ],
];
for (const [file, caption] of images) {
  if (
    listing.previews.some((preview) =>
      Object.values(preview.caption ?? {}).includes(caption),
    )
  ) {
    console.log(`Screenshot already present: ${file}`);
    continue;
  }
  // Do not guess which image to replace after an interrupted upload.
  if (
    listing.previews.some(
      (preview) => !Object.values(preview.caption ?? {}).some(Boolean),
    )
  ) {
    throw new Error(
      "An existing screenshot has no caption. Inspect it in the dashboard before retrying to avoid duplicates.",
    );
  }
  const form = new FormData();
  form.set(
    "image",
    new Blob([await readFile(file)], { type: "image/png" }),
    file.split("/").pop(),
  );
  form.set("position", String(listing.previews.length));
  const preview = await request("previews/", { method: "POST", body: form });
  if (!Number.isInteger(preview.id))
    throw new Error(
      "Mozilla did not return a screenshot ID; inspect the listing before retrying.",
    );
  await request(`previews/${preview.id}/`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ caption: { "en-GB": caption } }),
  });
  listing.previews.push({ ...preview, caption: { "en-GB": caption } });
  console.log(`Uploaded screenshot: ${file}`);
}
const saved = await request();
if (
  !images.every(([, caption]) =>
    saved.previews.some((preview) =>
      Object.values(preview.caption ?? {}).includes(caption),
    ),
  )
) {
  throw new Error("Could not verify both saved screenshot captions.");
}
console.log(
  "Verified both listing screenshots. No extension version was uploaded or changed.",
);
