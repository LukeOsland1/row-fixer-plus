import { MoonIcon, SunIcon } from "../icon/Icons";
import { KeyExtensionTheme } from "../../data/storage-key";
import { useStorageState } from "../../hooks/useStorage";

export function ThemeSwitcher() {
  const [dark, setDark, loaded] = useStorageState(KeyExtensionTheme);
  const next = dark ? "light" : "dark";
  return (
    <button
      type="button"
      className="icon-button"
      disabled={!loaded}
      aria-label={"Switch to " + next + " appearance"}
      title={"Switch to " + next + " appearance"}
      onClick={() => setDark(!dark)}
    >
      {dark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
