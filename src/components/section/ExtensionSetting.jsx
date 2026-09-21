import brand from "../../data/brand.json";

export default function ExtensionSetting() {
  return (
    <>
      <p className="section-label">ABOUT</p>
      <section className="settings-card" aria-label="About and links">
        <a
          className="link-row"
          href={brand.repositoryUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Project &amp; support<span aria-hidden="true">↗</span>
        </a>
        {brand.storeUrl && (
          <a
            className="link-row"
            href={brand.storeUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Rate {brand.shortName}
            <span aria-hidden="true">↗</span>
          </a>
        )}
        {brand.donationUrl && (
          <a
            className="link-row"
            href={brand.donationUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Support development<span aria-hidden="true">♡</span>
          </a>
        )}
        <a
          className="link-row"
          href="privacy.html"
          target="_blank"
          rel="noopener noreferrer"
        >
          Privacy<span aria-hidden="true">↗</span>
        </a>
        <a
          className="link-row"
          href="credits.html"
          target="_blank"
          rel="noopener noreferrer"
        >
          Credits &amp; licences<span aria-hidden="true">↗</span>
        </a>
      </section>
      <div className="about-note">
        <p>
          {brand.shortName} {brand.descriptor}, an independent extension by{" "}
          {brand.author}.
        </p>
        <p>
          Your preferences stay in this browser. No account, analytics, or
          tracking.
        </p>
        <p>
          Built on YouTube Row Fixer by Sapondanai Sriwan, with ytZara by
          cyfung1031.
        </p>
        <p>Not affiliated with, endorsed by, or sponsored by YouTube or Google.</p>
      </div>
    </>
  );
}
