import { readFileSync } from "fs";

export interface AuditI {
  text: string;
  status: string;
}

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
      !jsonData.audits[key].info && !jsonData.audits[key].infoScore &&
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
  return consoleOutput.replace("[32m", "").replace("[0m", "");
};

export { getDataFromJSONReport, cleanConsoleOutput };
