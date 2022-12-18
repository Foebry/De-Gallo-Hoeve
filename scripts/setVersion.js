const fs = require("fs");

const template = (buildInfo) =>
  `
// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.
export const VERSION = '${buildInfo.version}';
export const BUILD_DATE = '${buildInfo.buildDate}';
export const BUILD = '${buildInfo.build}';
export const GIT_REF = '${buildInfo.gitRef}';
`.trim();

function generateVersionFile(dest) {
  const branchName = process.env.BRANCH_NAME || "local";
  const buildNumber = process.env.CIRCLE_BUILD_NUM || "000";
  const buildInfo = {
    version: process.env.npm_package_version || "0.0.0",
    build: `${branchName}.${process.env.npm_package_version}.${buildNumber}`,
    buildDate: new Date().toUTCString(),
    gitRef: process.env.CIRCLE_SHA1 || "unknown",
  };
  console.log("Generate version file: ", buildInfo);
  let content = template(buildInfo);
  writeVersion(dest, content);
}

function writeVersion(path, content) {
  return fs.writeFileSync(path, content);
}

generateVersionFile(process.argv[2]);
