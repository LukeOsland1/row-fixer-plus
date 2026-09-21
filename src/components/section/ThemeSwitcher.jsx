import SwitchControl from "../ui/SwitchControl";
import { KeyExtensionTheme } from "../../data/storage-key";

export function ThemeSwitcher() {
  return (
    <SwitchControl
      label="Dark appearance"
      description="A softer backdrop for your controls."
      storageKey={KeyExtensionTheme}
    />
  );
}
