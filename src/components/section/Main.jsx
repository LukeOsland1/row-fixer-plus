import { useState } from "react";
import SwitchControl from "../ui/SwitchControl";
import SliderControl from "../ui/SliderControl";
import ExtensionSetting from "./ExtensionSetting";
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

const tabs = ["Layout", "Hide", "About"];
export default function Main() {
  const [tab, setTab] = useState("Layout");
  const [page, setPage] = useState("home");
  const [enabled, , loaded] = useStorageState(KeyExtensionStatus);
  const [rows] = useStorageState(
    page === "home" ? KeyVideoPerRow : KeyChannelPageVideoPerRow
  );
  const chooseTab = (event, index) => {
    const direction =
      event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
        ? tabs.length - 1
        : (index + direction + tabs.length) % tabs.length;
    if (direction || event.key === "Home" || event.key === "End") {
      event.preventDefault();
      setTab(tabs[next]);
      document.getElementById("tab-" + tabs[next]).focus();
    }
  };
  return (
    <>
      <nav className="tab-bar" role="tablist" aria-label="Settings">
        {tabs.map((name, index) => (
          <button
            key={name}
            id={"tab-" + name}
            role="tab"
            aria-selected={tab === name}
            aria-controls={"panel-" + name}
            tabIndex={tab === name ? 0 : -1}
            onClick={() => setTab(name)}
            onKeyDown={(event) => chooseTab(event, index)}
          >
            {name}
          </button>
        ))}
      </nav>
      <main className="popup-content">
        {loaded && !enabled && (
          <p className="paused-note">
            Extension paused. Refresh YouTube to apply the change.
          </p>
        )}
        <div role="tabpanel" id={"panel-" + tab} aria-labelledby={"tab-" + tab}>
          {tab === "Layout" && (
            <>
              <div className="panel-intro">
                <p className="eyebrow">LESS SCROLL. MORE CHOICE.</p>
                <h2>Make room for more.</h2>
                <p>Set the rhythm of your YouTube feed.</p>
              </div>
              <div
                className="layout-preview"
                aria-hidden="true"
                style={{ "--columns": Math.min(Number(rows) || 5, 15) }}
              >
                {Array.from({ length: (Number(rows) || 5) * 2 }, (_, i) => (
                  <span key={i}>
                    <i />
                    <b />
                  </span>
                ))}
              </div>
              <div className="page-picker" aria-label="Page to customise">
                <button
                  aria-pressed={page === "home"}
                  onClick={() => setPage("home")}
                >
                  Home feed
                </button>
                <button
                  aria-pressed={page === "channel"}
                  onClick={() => setPage("channel")}
                >
                  Channel pages
                </button>
              </div>
              <section className="settings-card" aria-label="Row settings">
                {page === "home" ? (
                  <div key="home">
                    <SliderControl
                      label="Videos per row"
                      storageKey={KeyVideoPerRow}
                      maxValue={15}
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
                      description="Adjust the grid on smaller screens."
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
            </>
          )}
          {tab === "Hide" && (
            <>
              <div className="panel-intro">
                <p className="eyebrow">KEEP WHAT YOU CAME FOR.</p>
                <h2>A quieter feed.</h2>
                <p>Choose what stays out of your way.</p>
              </div>
              <section
                className="settings-card"
                aria-label="Content visibility"
              >
                <SwitchControl
                  label="Hide Shorts"
                  description="Remove Shorts shelves from your feeds."
                  storageKey={KeyHideShort}
                />
                <SwitchControl
                  label="Hide Playables"
                  description="Hide game shelves, cards, and sidebar links."
                  storageKey={KeyHidePlayables}
                />
                <SwitchControl
                  label="Hide channel avatars"
                  description="Keep video cards a little cleaner."
                  storageKey={KeyHideChannelProfile}
                />
              </section>
              <div className="tip-card">
                <span className="tip-symbol" aria-hidden="true">
                  ✦
                </span>
                <p>
                  Your choices are saved automatically.
                  <br />
                  Change your mind? Switch them back anytime.
                </p>
              </div>
            </>
          )}
          {tab === "About" && <ExtensionSetting />}
        </div>
      </main>
      <footer className="popup-footer">
        <span>{brand.tagline}</span>
        <span>v{brand.version}</span>
      </footer>
    </>
  );
}
