import { eventGetRowFixerData, eventSendRowFixerData } from "../../data/event";
import { settingKey } from "../../data/storage-key";
import port from "../modules/utils/port";
import { getAllStorage } from "../modules/utils/storage";

// Relay extension storage from the ISOLATED world to the MAIN-world page patch.
// CustomEvent bridge approach: https://stackoverflow.com/questions/76937442

const sendSettings = async () => {
  const allData = await getAllStorage(settingKey);
  port.callEvent({
    name: eventSendRowFixerData,
    detail: allData,
  });
};

chrome.storage.onChanged.addListener(async () => {
  await sendSettings();
});

port.listen(eventGetRowFixerData, async () => {
  await sendSettings();
});

// The MAIN and ISOLATED world scripts are registered separately, so Chrome
// does not give us a reliable listener-registration order at document_start.
// Sending once proactively makes the handshake work regardless of which
// script starts first.
sendSettings();
