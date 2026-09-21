import { useStorageState } from "../../hooks/useStorage";

export default function SwitchControl({ label, storageKey, description }) {
  const [selected, setSelected, loaded] = useStorageState(storageKey);
  return (
    <button
      type="button"
      className="setting-switch"
      role="switch"
      aria-label={label}
      aria-checked={!!selected}
      disabled={!loaded}
      onClick={() => setSelected(!selected)}
    >
      <span className="setting-copy">
        <span className="setting-label">{label}</span>
        {description && (
          <span className="setting-description">{description}</span>
        )}
      </span>
      <span className="switch-track" aria-hidden="true">
        <span />
      </span>
    </button>
  );
}
