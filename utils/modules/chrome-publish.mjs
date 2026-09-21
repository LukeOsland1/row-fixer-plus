// Google Chrome Web Store API v2. fetch is injectable for offline release tests.
export async function publishChrome(
  {
    version,
    archive,
    publisherId,
    itemId,
    clientId,
    clientSecret,
    refreshToken,
  },
  {
    fetchImpl = fetch,
    sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
  } = {},
) {
  const request = async (url, options = {}) => {
    const response = await fetchImpl(url, {
      ...options,
      signal: AbortSignal.timeout(60_000),
    });
    // Never echo token endpoint bodies or request headers into CI logs.
    if (!response.ok)
      throw new Error(
        `Chrome API request failed (${response.status}); inspect the store dashboard before retrying.`,
      );
    return response.json();
  };
  const token = await request("https://oauth2.googleapis.com/token", {
    method: "POST",
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });
  if (!token.access_token)
    throw new Error("Google did not return an access token.");
  const headers = { Authorization: `Bearer ${token.access_token}` };
  const name = `publishers/${encodeURIComponent(publisherId)}/items/${encodeURIComponent(itemId)}`;
  const url = `https://chromewebstore.googleapis.com/v2/${name}`;
  const status = await request(`${url}:fetchStatus`, { headers });
  if (status.takenDown || status.warned)
    throw new Error("Resolve Chrome store policy issues before publishing.");
  const versions = (revision) =>
    revision?.distributionChannels?.map((channel) => channel.crxVersion) ?? [];
  if (versions(status.publishedItemRevisionStatus).includes(version))
    return "Already published";
  const submitted = status.submittedItemRevisionStatus;
  if (["PENDING_REVIEW", "STAGED"].includes(submitted?.state)) {
    if (versions(submitted).includes(version))
      return `Already submitted: ${submitted.state}`;
    throw new Error(
      "Another Chrome version is pending review or staged; finish it before submitting this release.",
    );
  }
  let upload = await request(
    `https://chromewebstore.googleapis.com/upload/v2/${name}:upload`,
    {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/zip" },
      body: archive,
    },
  );
  for (
    let attempt = 0;
    upload.uploadState === "IN_PROGRESS" && attempt < 30;
    attempt++
  ) {
    await sleep(10_000);
    const result = await request(`${url}:fetchStatus`, { headers });
    upload = { uploadState: result.lastAsyncUploadState };
  }
  if (upload.uploadState !== "SUCCEEDED")
    throw new Error(
      `Chrome upload not complete: ${upload.uploadState ?? "unknown"}. Check dashboard before retrying.`,
    );
  const result = await request(`${url}:publish`, {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({
      publishType: "DEFAULT_PUBLISH",
      skipReview: false,
      blockOnWarnings: true,
    }),
  });
  if (!["PENDING_REVIEW", "PUBLISHED", "STAGED"].includes(result.state))
    throw new Error(`Unexpected Chrome submission state: ${result.state}`);
  return `Submitted: ${result.state}`;
}
