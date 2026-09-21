import Logo from "../icon/Logo";
import brand from "../../data/brand.json";
import { KeyExtensionStatus } from "../../data/storage-key";
import { useStorageState } from "../../hooks/useStorage";

export default function Header() {
  const [enabled, setEnabled, loaded] = useStorageState(KeyExtensionStatus);
  return (
    <header className="app-header">
      <div className="brand-lockup">
        <Logo />
        <h1>{brand.shortName}</h1>
      </div>
      <button
        className={"power-control " + (enabled ? "is-on" : "")}
        role="switch"
        aria-label="Extension enabled"
        aria-checked={!!enabled}
        disabled={!loaded}
        onClick={() => setEnabled(!enabled)}
        title="Refresh your YouTube tabs after changing this setting"
      >
        <span className="status-dot" />
        {enabled ? "On" : "Off"}
      </button>
    </header>
  );
}
