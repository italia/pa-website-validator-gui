import { readFileSync } from "fs";

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

  const failedAudits: string[] = [];
  let generalResult = 1;
  Object.keys(jsonData.audits).forEach((key) => {
    if (
      !jsonData.audits[key].info &&
      jsonData.audits[key].specificScore !== undefined &&
      key !== "municipality-performance-improvement-plan"
    ) {
      if (jsonData.audits[key].specificScore === 0) {
        if (generalResult === 1) {
          generalResult = 0;
        }
        failedAudits.push(key);
        failedCount++;
      } else if (jsonData.audits[key].specificScore === -1) {
        generalResult = -1;
        failedAudits.push(key);
        errorCount++;
      } else {
        successCount++;
      }
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

export { getDataFromJSONReport };
