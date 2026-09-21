import brand from "../../data/brand.json";
import { ThemeSwitcher } from "./ThemeSwitcher";

export default function ExtensionSetting() {
  return (
    <>
      <div className="panel-intro">
        <p className="eyebrow">MADE TO FIT YOU</p>
        <h2>A little more control.</h2>
        <p>An independent extension by {brand.author}.</p>
      </div>
      <section className="settings-card">
        <ThemeSwitcher />
        <a
          className="link-row"
          href={brand.repositoryUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Project & support<span aria-hidden="true">↗</span>
        </a>
        {brand.storeUrl && (
          <a
            className="link-row"
            href={brand.storeUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Rate {brand.name}
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
          Credits & licences<span aria-hidden="true">↗</span>
        </a>
      </section>
      <div className="about-note">
        <p>
          Your preferences stay in this browser. No account, analytics, or
          tracking.
        </p>
        <p>
          Built on YouTube Row Fixer by Sapondanai Sriwan, with ytZara by
          cyfung1031.
        </p>
        <p>Independent of YouTube and Google.</p>
      </div>
    </>
  );
}
