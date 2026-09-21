import { useEffect, useState } from "react";
import { useStorageState } from "../../hooks/useStorage";

export default function SliderControl({
  label,
  storageKey,
  maxValue,
  minValue = 1,
  step = 1,
  onLiveChange,
}) {
  const [saved, setSaved, loaded] = useStorageState(storageKey);
  const [value, setValue] = useState(minValue);
  const [draft, setDraft] = useState("");
  useEffect(() => {
    if (loaded) {
      setValue(saved);
      setDraft(String(saved));
    }
  }, [saved, loaded]);
  const clamp = (input) =>
    Math.min(maxValue, Math.max(minValue, Math.round(input)));
  const preview = (next) => {
    setValue(next);
    if (onLiveChange) onLiveChange(next);
  };
  const commit = (next) => {
    if (loaded && next !== saved) setSaved(next);
  };
  const drag = (event) => {
    preview(Number(event.target.value));
    setDraft(event.target.value);
  };
  const type = (event) => {
    setDraft(event.target.value);
    const parsed = Number(event.target.value);
    if (event.target.value !== "" && Number.isFinite(parsed))
      preview(clamp(parsed));
  };
  const commitDraft = () => {
    const parsed = Number(draft);
    const next =
      draft === "" || !Number.isFinite(parsed) ? saved : clamp(parsed);
    preview(next);
    setDraft(String(next));
    commit(next);
  };
  return (
    <div className="slider-control">
      <div className="slider-heading">
        <label htmlFor={storageKey}>{label}</label>
        <span className="value-entry">
          <input
            type="number"
            inputMode="numeric"
            min={minValue}
            max={maxValue}
            step={step}
            disabled={!loaded}
            value={loaded ? draft : ""}
            aria-label={label + ", exact value"}
            onChange={type}
            onBlur={commitDraft}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                commitDraft();
                event.currentTarget.blur();
              }
              if (event.key === "Escape") {
                setDraft(String(saved));
                event.currentTarget.blur();
              }
            }}
          />
          <span aria-hidden="true">/ {maxValue}</span>
        </span>
      </div>
      <input
        id={storageKey}
        type="range"
        min={minValue}
        max={maxValue}
        step={step}
        disabled={!loaded}
        value={value}
        onChange={drag}
        onPointerUp={() => commit(value)}
        onKeyUp={() => commit(value)}
        onBlur={() => commit(value)}
        style={{
          "--range-fill":
            ((value - minValue) / (maxValue - minValue)) * 100 + "%",
        }}
      />
    </div>
  );
}
