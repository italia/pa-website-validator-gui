import { readFileSync, readdirSync, statSync } from "fs";
import path from "path";
import puppeteer from "puppeteer";
import { VERSION as currentVersion } from "./versions.js";

export interface AuditI {
  text: string;
  status: string;
}

const GITHUBReleaseUrl =
  "https://api.github.com/repos/italia/pa-website-validator-gui/releases/latest";

let releaseInfo: null | any = null;

const getDataFromJSONReport = (reportPath: string) => {
  let successCount = 0;
  let failedCount = 0;
  let errorCount = 0;

  const jsonString = readFileSync(reportPath, "utf8");
  let jsonData: Record<string, Record<string, Record<string, unknown>>> = {};
  try {
    jsonData = JSON.parse(jsonString);
  } catch (error) {
    console.error("Error reading or parsing the JSON file:", error);
  }

  const failedAudits: AuditI[] = [];
  let generalResult = 1;
  Object.keys(jsonData.audits).forEach((key) => {
    if (
      !jsonData.audits[key].info &&
      !jsonData.audits[key].infoScore &&
      jsonData.audits[key].specificScore !== undefined &&
      key !== "municipality-performance-improvement-plan"
    ) {
      if (jsonData.audits[key].specificScore === 0) {
        if (generalResult === 1) {
          generalResult = 0;
        }
        failedAudits.push({ text: key, status: "fail" });
        failedCount++;
      } else if (jsonData.audits[key].specificScore === -1) {
        generalResult = -1;
        failedAudits.push({ text: key, status: "error" });
        errorCount++;
      } else {
        successCount++;
        failedAudits.push({ text: key, status: "pass" });
      }
    } else if (
      jsonData.audits[key].info &&
      !!jsonData.audits[key].specificScore
    ) {
      if (jsonData.audits[key].specificScore === 0) {
        failedAudits.push({ text: key, status: "fail" });
      } else if (jsonData.audits[key].specificScore === 1) {
        failedAudits.push({ text: key, status: "pass" });
      } else {
        failedAudits.push({ text: key, status: "error" });
      }
    } else if (
      (jsonData.audits[key].info && !jsonData.audits[key].specificScore) ||
      !jsonData.audits[key].specificScore ||
      key === "municipality-performance-improvement-plan"
    ) {
      failedAudits.push({ text: key, status: "pass" });
    }
  });

  return {
    generalResult,
    failedAudits,
    successCount,
    failedCount,
    errorCount,
  };
};

const cleanConsoleOutput = (consoleOutput: string) => {
  return consoleOutput
    .replace("[32m", "")
    .replace("[0m", "")
    .replaceAll("", "");
};

const getPathDirectoryInDirectory = (startPath: string) => {
  const files = readdirSync(startPath);
  for (const file of files) {
    const findPathChrome = path.join(startPath, file);
    if (statSync(findPathChrome).isDirectory()) {
      startPath = findPathChrome;
      break;
    }
  }

  return startPath;
};

const getChromePath = () => {
  try {
    return puppeteer.executablePath();
  } catch {
    let chromeFilePath = path.join(
      import.meta.dirname,
      "../",
      "chrome-headless-shell",
    );
    if (process.env.NODE_ENV?.toString().trim() !== "development") {
      chromeFilePath = path.join(
        process.resourcesPath,
        "chrome-headless-shell",
      );
    }

    chromeFilePath = getPathDirectoryInDirectory(chromeFilePath);
    chromeFilePath = getPathDirectoryInDirectory(chromeFilePath);
    chromeFilePath = path.join(chromeFilePath, "chrome-headless-shell");

    if (process.platform === "win32") {
      chromeFilePath += ".exe";
    }

    return chromeFilePath;
  }
};

const checkNewerRelease = async () => {
  if (releaseInfo) return releaseInfo;

  try {
    const response = await fetch(GITHUBReleaseUrl);
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`);
    }
    const latestRelease = await response.json();
    const latestVersion = latestRelease.tag_name;
    const latestVersionURL = latestRelease.html_url;

    const isLatest = currentVersion >= latestVersion.replace("v", "");

    releaseInfo = {
      isLatest,
      currentVersion,
      latestVersion,
      latestVersionURL,
    };
  } catch (error) {
    if (error instanceof Error) console.log(`${error.message}`);
    releaseInfo = {
      isLatest: true,
      currentVersion,
    };
  }

  return releaseInfo;
};

export {
  getDataFromJSONReport,
  cleanConsoleOutput,
  getChromePath,
  checkNewerRelease,
};
