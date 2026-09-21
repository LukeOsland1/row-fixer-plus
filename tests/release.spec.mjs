import { test, expect } from "@playwright/test";
import { publishChrome } from "../utils/modules/chrome-publish.mjs";

const config = {
  version: "1.0.1",
  archive: Buffer.from("test"),
  publisherId: "publisher",
  itemId: "item",
  clientId: "client",
  clientSecret: "secret",
  refreshToken: "refresh",
};
const revision = (version, state) => ({
  state,
  distributionChannels: [{ crxVersion: version }],
});
function mockApi(responses) {
  const calls = [];
  return {
    calls,
    fetchImpl: async (url, options) => {
      calls.push({ url, ...options });
      if (!responses.length) throw new Error("Unexpected API request");
      const body = responses.shift();
      return {
        ok: !body.httpError,
        status: body.httpError ?? 200,
        json: async () => body,
      };
    },
    sleep: async () => {},
  };
}
test("Chrome submission waits for upload completion before publishing", async () => {
  const api = mockApi([
    { access_token: "token" },
    {},
    { uploadState: "IN_PROGRESS" },
    { lastAsyncUploadState: "SUCCEEDED" },
    { state: "PENDING_REVIEW" },
  ]);
  expect(await publishChrome(config, api)).toContain("PENDING_REVIEW");
  expect(api.calls.map(({ url }) => url.split(":").pop())).toEqual([
    "//oauth2.googleapis.com/token",
    "fetchStatus",
    "upload",
    "fetchStatus",
    "publish",
  ]);
  expect(JSON.parse(api.calls.at(-1).body)).toEqual({
    publishType: "DEFAULT_PUBLISH",
    skipReview: false,
    blockOnWarnings: true,
  });
});
test("Chrome retry does not re-upload the same submitted version", async () => {
  const api = mockApi([
    { access_token: "token" },
    { submittedItemRevisionStatus: revision("1.0.1", "PENDING_REVIEW") },
  ]);
  expect(await publishChrome(config, api)).toContain("Already submitted");
  expect(api.calls).toHaveLength(2);
});
test("Chrome does not cancel or replace another pending version", async () => {
  const api = mockApi([
    { access_token: "token" },
    { submittedItemRevisionStatus: revision("1.0.0", "PENDING_REVIEW") },
  ]);
  await expect(publishChrome(config, api)).rejects.toThrow(
    "Another Chrome version",
  );
  expect(api.calls).toHaveLength(2);
});
test("Chrome rejects failed uploads and does not expose OAuth error bodies", async () => {
  const failed = mockApi([
    { access_token: "token" },
    {},
    { uploadState: "FAILED" },
  ]);
  await expect(publishChrome(config, failed)).rejects.toThrow(
    "upload not complete",
  );
  expect(failed.calls).toHaveLength(3);
  const oauth = mockApi([{ httpError: 400, error: "secret-token" }]);
  await expect(publishChrome(config, oauth)).rejects.toThrow(
    "Chrome API request failed (400)",
  );
});
