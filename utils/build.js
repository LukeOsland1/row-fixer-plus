const { copyFile } = require("fs/promises");
const { directory } = require("./modules/config");
const writeNotices = require("./writeNotices");

const main = async () => {
  try {
    // Build the Chrome extension
    await copyFile(
      "extension/manifest-chrome.json",
      `${directory}/manifest.json`,
    );
    await writeNotices(directory);
  } catch (err) {
    console.log(err);
    process.exitCode = 1;
  }
};

main();
