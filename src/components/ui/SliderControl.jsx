import { useEffect, useState } from "react";
import { useStorageState } from "../../hooks/useStorage";

export default function SliderControl({
  label,
  storageKey,
  maxValue,
  minValue = 1,
  step = 1,
}) {
  const [saved, setSaved, loaded] = useStorageState(storageKey);
  const [value, setValue] = useState(minValue);
  useEffect(() => {
    if (loaded) setValue(saved);
  }, [saved, loaded]);
  const commit = () => {
    if (loaded && value !== saved) setSaved(value);
  };
  return (
    <div className="slider-control">
      <div className="slider-heading">
        <label htmlFor={storageKey}>{label}</label>
        <output htmlFor={storageKey}>{loaded ? value : "—"}</output>
      </div>
      <input
        id={storageKey}
        type="range"
        min={minValue}
        max={maxValue}
        step={step}
        disabled={!loaded}
        value={value}
        onChange={(event) => setValue(Number(event.target.value))}
        onPointerUp={commit}
        onKeyUp={commit}
        onBlur={commit}
        style={{
          "--range-fill":
            ((value - minValue) / (maxValue - minValue)) * 100 + "%",
        }}
      />
      <div className="range-labels" aria-hidden="true">
        <span>{minValue}</span>
        <span>{maxValue}</span>
      </div>
    </div>
  );
}
