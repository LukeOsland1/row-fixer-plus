import { useEffect, useState } from "react";
import SwitchControl from "../ui/SwitchControl";
import SliderControl from "../ui/SliderControl";
import LayoutPreview from "../ui/LayoutPreview";
import ExtensionSetting from "./ExtensionSetting";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { GithubIcon, InfoIcon, KofiIcon } from "../icon/Icons";
import { useStorageState } from "../../hooks/useStorage";
import {
  KeyChannelPageShelfItemPerRow,
  KeyChannelPageVideoPerRow,
  KeyChannelPageWideLayout,
  KeyDisplayFullTitle,
  KeyDynamicVideo,
  KeyHideChannelProfile,
  KeyHideShort,
  KeyHidePlayables,
  KeyPostPerRow,
  KeyShelfItemPerRow,
  KeyVideoPerRow,
  KeyExtensionStatus,
} from "../../data/storage-key";
import brand from "../../data/brand.json";

export default function Main() {
  const [page, setPage] = useState("home");
  const [about, setAbout] = useState(false);
  const [liveRows, setLiveRows] = useState(null);
  const [enabled, , loaded] = useStorageState(KeyExtensionStatus);
  const home = page === "home";
  const [storedRows] = useStorageState(
    home ? KeyVideoPerRow : KeyChannelPageVideoPerRow
  );
  const [fullTitles] = useStorageState(KeyDisplayFullTitle);
  useEffect(() => setLiveRows(null), [page]);
  return (
    <>
      <main className="popup-content">
        {loaded && !enabled && (
          <p className="paused-note">
            Extension paused. Refresh YouTube to apply the change.
          </p>
        )}
        {about ? (
          <ExtensionSetting />
        ) : (
          <>
            <div className="scope-switch" aria-label="Page to customise">
              <button
                type="button"
                aria-pressed={home}
                onClick={() => setPage("home")}
              >
                Home feed
              </button>
              <button
                type="button"
                aria-pressed={!home}
                onClick={() => setPage("channel")}
              >
                Channel pages
              </button>
            </div>

            <LayoutPreview
              rows={liveRows ?? storedRows}
              fullTitles={home && !!fullTitles}
              scopeLabel={home ? "Home feed" : "Channel pages"}
            />

            <section className="settings-card" aria-label="Row settings">
              {home ? (
                <div key="home">
                  <SliderControl
                    label="Videos per row"
                    storageKey={KeyVideoPerRow}
                    maxValue={15}
                    onLiveChange={setLiveRows}
                  />
                  <SliderControl
                    label="Shorts per row"
                    storageKey={KeyShelfItemPerRow}
                    maxValue={12}
                  />
                  <SliderControl
                    label="Posts per row"
                    storageKey={KeyPostPerRow}
                    maxValue={6}
                  />
                  <SwitchControl
                    label="Fit to window"
                    hint="Adjust the grid on smaller screens."
                    storageKey={KeyDynamicVideo}
                  />
                  <SwitchControl
                    label="Show full video titles"
                    storageKey={KeyDisplayFullTitle}
                  />
                </div>
              ) : (
                <div key="channel">
                  <SliderControl
                    label="Videos per row"
                    storageKey={KeyChannelPageVideoPerRow}
                    maxValue={15}
                    onLiveChange={setLiveRows}
                  />
                  <SliderControl
                    label="Shorts per row"
                    storageKey={KeyChannelPageShelfItemPerRow}
                    maxValue={15}
                  />
                  <SwitchControl
                    label="Wide channel layout"
                    description="Give channel videos more room."
                    storageKey={KeyChannelPageWideLayout}
                  />
                </div>
              )}
            </section>

            <p className="section-label">HIDE</p>
            <section className="settings-card" aria-label="Content visibility">
              <SwitchControl
                label="Shorts shelves"
                hint="Remove Shorts shelves from your feeds."
                storageKey={KeyHideShort}
              />
              <SwitchControl
                label="Playables"
                hint="Hide game shelves, cards, and sidebar links."
                storageKey={KeyHidePlayables}
              />
              <SwitchControl
                label="Channel avatars"
                hint="Keep video cards a little cleaner."
                storageKey={KeyHideChannelProfile}
              />
            </section>
          </>
        )}
      </main>
      <footer className="popup-footer">
        <div className="footer-actions">
          <ThemeSwitcher />
          <a
            className="icon-button"
            href={brand.repositoryUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Project and support"
            title="Project and support"
          >
            <GithubIcon />
          </a>
          <button
            type="button"
            className="icon-button"
            aria-pressed={about}
            aria-label="About this extension"
            title="About this extension"
            onClick={() => setAbout(!about)}
          >
            <InfoIcon />
          </button>
          {brand.donationUrl && (
            <a
              className="kofi-link"
              href={brand.donationUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Support ${brand.name} on Ko-fi`}
              title={`Support ${brand.name} on Ko-fi`}
            >
              <KofiIcon />
              Support on Ko-fi
            </a>
          )}
        </div>
        <span>v{brand.version}</span>
      </footer>
    </>
  );
}
