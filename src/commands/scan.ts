"use strict";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { existsSync } from "fs";
import { mkdir } from "fs/promises";
import { logLevels, run } from "pa-website-validator-ng/dist/launchScript.js";

const parser = yargs(hideBin(process.argv))
    .usage("Usage: --type <type> --destination <folder> --report <report_name> --website <url> --scope <scope>")
    .option("type", {
      describe: "Crawler to run",
      type: "string",
      demandOption: true,
      choices: ["municipality", "school"],
    })
    .option("destination", {
      describe: "Path where to save the report",
      type: "string",
      demandOption: true,
    })
    .option("report", {
      describe: "Name of the result report",
      type: "string",
      demandOption: true,
    })
    .option("website", {
      describe: "Website where to run the crawler",
      type: "string",
      demandOption: true,
    })
    .option("scope", {
      describe: "Execution scope",
      type: "string",
      demandOption: true,
      default: "online",
      choices: ["local", "online"],
    })
    .option("accuracy", {
      describe: "Indicates the precision with which scanning is done: the greater the precision the greater the number of pages scanned",
      type: "string",
      demandOption: true,
      default: "suggested",
      choices: ["min", "suggested", "high", "all"],
    })
    .option("timeout", {
      describe: "Request timeout in milliseconds. If the request takes longer than this value, the request will be aborted",
      type: "number",
      demandOption: false,
      default: 300000,
    })
    .option("concurrentPages", {
      describe: "Number of pages to be opened in parallel",
      type: "number",
      demandOption: false,
      default: 20,
    })
    .option("auditsSubset", {
      describe: "Subset of audits to be executed",
      type: "string",
      demandOption: false,
      default: "",
    });

try {
  const args = await parser.argv;
  console.log(args);

  if (!existsSync(args.destination)) {
    await mkdir(args.destination, { recursive: true });
  }
  const subset = args.auditsSubset ? args.auditsSubset.split(",") : undefined;
  console.log(args.destination);
  await run(
      args.website,
      args.type,
      args.scope,
      logLevels.display_info,
      true,
      args.destination,
      args.report,
      "false",
      args.accuracy,
      args.timeout,
      10,
      args.concurrentPages,
      subset
  );
  process.exit(0);
}
catch (e) {
  console.error(e);
  process.exit(1);
}