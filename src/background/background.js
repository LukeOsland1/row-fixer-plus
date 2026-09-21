import { scriptContentScript, scriptInjectScript } from "../data/scriptId";
import { KeyExtensionStatus } from "../data/storage-key";
import { getStorage } from "../utils/browserStorage";
import {
  getRegisteredScripts,
  injectScript,
  unregisterScripts,
} from "./modules/utils/registered";

// No install-time tabs or external requests.
const main = async () => {
  try {
    const registeredScripts = await getRegisteredScripts();
    const registeredIds = new Set(registeredScripts.map(({ id }) => id));

    if (!registeredIds.has(scriptContentScript)) {
      await injectScript({
        id: scriptContentScript,
        files: ["inject/bridge.js"],
      });
    }
    if (!registeredIds.has(scriptInjectScript)) {
      await injectScript({
        id: scriptInjectScript,
        world: "MAIN",
        files: ["inject/lib/ytZara.js", "inject/inject_script.js"],
      });
    }
  } catch (err) {
    console.log(err);
  }
};

const updateRegisteredScripts = async () => {
  try {
    const extensionStatus = await getStorage(KeyExtensionStatus);

    if (extensionStatus) {
      await main();
      return;
    }

    const registeredScripts = await getRegisteredScripts();
    if (!registeredScripts.length) {
      return;
    }
    await unregisterScripts(registeredScripts.map(({ id }) => id));
  } catch (err) {
    console.log(err);
  }
};

chrome.storage.onChanged.addListener(updateRegisteredScripts);

// Restore the persisted enabled/disabled state when the service worker starts.
updateRegisteredScripts();
