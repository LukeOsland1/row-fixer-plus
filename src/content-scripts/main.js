import { getAllStorage, getStorage } from "./modules/utils/storage";
import { KeyExtensionStatus, settingKey } from "../data/storage-key";
import { injectAllChanges } from "./modules/options/optionsChanges";
import { optionPostsPerRow } from "./modules/options/postsPerRow";

chrome.storage.onChanged.addListener(async (changes) => {
  if (changes[KeyExtensionStatus]) {
    return;
  }

  const allData = await getAllStorage(settingKey);

  // will return if the extension is disabled
  if (!allData[KeyExtensionStatus]) {
    return;
  }
  injectAllChanges(allData);
});

const main = async () => {
  const extensionStatus = await getStorage(KeyExtensionStatus);

  // will return if the extension is disabled
  if (!extensionStatus) {
    return;
  }

  const allData = await getAllStorage(settingKey);

  injectAllChanges(allData);
  optionPostsPerRow();
};

main();
