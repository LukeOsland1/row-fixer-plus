import { readFile, writeFile } from "node:fs/promises";
import addonsLinter from "addons-linter";

const { version } = JSON.parse(
  await readFile("extension/manifest-firefox.json", "utf8"),
);
const archive = `zip/Firefox v${version}.zip`;
const linter = addonsLinter.createInstance({
  config: {
    _: [archive],
    logLevel: "fatal",
    stack: false,
    pretty: false,
    warningsAsErrors: false,
    metadata: false,
    output: "none",
    boring: true,
    selfHosted: false,
    shouldScanFile: () => true,
  },
  runAsBinary: false,
});

await linter.run();
const report = linter.output;
await writeFile(
  "zip/firefox-validation.json",
  JSON.stringify(report, null, 2) + "\n",
);
console.log(`${archive}: ${JSON.stringify(report.summary)}`);
for (const severity of ["errors", "warnings", "notices"]) {
  for (const finding of report[severity]) {
    console.log(
      `${severity}: ${finding.code}: ${finding.message} (${finding.file}:${finding.line ?? ""}:${finding.column ?? ""})`,
    );
  }
}
if (report.summary.errors > 0) process.exitCode = 1;
