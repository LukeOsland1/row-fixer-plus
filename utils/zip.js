const { readFile, mkdir } = require("fs/promises");
const { directory } = require("./modules/config");
const AdmZip = require("adm-zip");

const run = async () => {
  await mkdir("zip", { recursive: true });

  for (const browser of ["Chrome", "Firefox"]) {
    const manifest = await readFile(
      `extension/manifest-${browser.toLowerCase()}.json`
    );
    const { version } = JSON.parse(manifest);
    const zip = new AdmZip();
    zip.addLocalFolder(directory);
    // Replace the manifest only inside this archive, preserving the local build.
    zip.addFile("manifest.json", manifest);
    zip.writeZip(`zip/${browser} v${version}.zip`);
    console.log(`🚀 ${browser} extension was built`);
  }
};

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
