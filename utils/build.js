const { directory } = require("./modules/config");
const processInlineScript = require("./modules/inlineScript");
const moveFile = require("./modules/moveFiles");
const writeNotices = require("./writeNotices");

const main = async () => {
  try {
    // Build the Chrome extension
    await moveFile(
      "extension/manifest-chrome.json",
      `${directory}/manifest.json`
    );
    await processInlineScript(directory);
    await writeNotices(directory);
  } catch (err) {
    console.log(err);
    process.exitCode = 1;
  }
};

main();
