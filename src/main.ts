import { app, BrowserWindow, ipcMain, dialog, Menu, MenuItem } from "electron";
import {
  deleteItem,
  getFolderWithId,
  getItemById,
  getItems,
  initializeDatabase,
  insertItem,
  searchURL,
  updateItem,
} from "./db.js";
import { fork, ChildProcess } from "child_process";
import path from "path";
import { createWriteStream, readFileSync, writeFileSync } from "fs";
import * as ejs from "ejs";
import { getDataFromJSONReport, cleanConsoleOutput, AuditI, getPathDirectoryInDirectory } from "./utils.js";
import { municipalityAudits, schoolAudits } from "./storage/auditMapping.js";
import { Item } from "./entities/Item";
import fs from "fs";
import { VERSION, VERSION_VALIDATOR } from "./versions.js";
const __dirname = import.meta.dirname;
const saveDirname = app.getPath("userData");

let mainWindow: BrowserWindow | null = null;

app.disableHardwareAcceleration();

app.whenReady().then(() => {
  console.log("System platform is: ", process.platform);
  initializeDatabase();
  createWindow();
});

app.on("window-all-closed", () => {
  //   if (process.platform !== 'darwin')
  app.quit();
});

let nodeProcess: ChildProcess;
let killedManually = false;

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    minWidth: 600,
    height: 1000,
    minHeight: 600,
    icon: path.join(__dirname, "icon.png"),
    title: "DTD - App di valutazione",
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      nodeIntegration: true,
      contextIsolation: true,
      zoomFactor: 1,
    },
  });

  mainWindow.webContents.on("before-input-event", (event, input) => {
    if (
      (input.control || input.meta) &&
      (input.key === "+" || input.key === "-" || input.key === "0")
    ) {
      event.preventDefault();
    }
  });

  const defaultMenu = Menu.getApplicationMenu();
  if (!defaultMenu) return;

  const modifiedMenuTemplate: MenuItem[] = defaultMenu.items.map((item) => {
    if (item.submenu) {
      const modifiedSubmenu = item.submenu.items.filter((subItem) => {
        return !["zoomin", "zoomout", "resetzoom", "toggledevtools"].includes(
          subItem.role as string,
        );
      });
      return { ...item, submenu: Menu.buildFromTemplate(modifiedSubmenu) };
    }
    return item;
  });

  const modifiedMenu = Menu.buildFromTemplate(modifiedMenuTemplate);
  Menu.setApplicationMenu(modifiedMenu);

  //To remove comment only for development reason
  //mainWindow.webContents.openDevTools();

  // load first page
  await loadPage("home", "");
}

const loadPage = async (pageName: string, url: string) => {
  const queryParam = url?.split("id=")[1];

  const item = await getItemById(queryParam ?? "");
  const mappedAuditsFailedObject: (
    | {
        title: string | undefined;
        code: string | undefined;
        id: string | undefined;
        innerId: string | undefined;
        weight: number | undefined;
        status: string | undefined;
      }
    | undefined
  )[] = [];

  if (
    item?.failedAudits &&
    item?.failedAudits.length &&
    item.failedAudits[0] !== "[]"
  ) {
    JSON.parse(item.failedAudits).forEach((audit: AuditI) => {
      let itemFound;
      if (item.type === "Comune") {
        itemFound = municipalityAudits.find(
          (el) => el.id === audit?.text || el.innerId === audit?.text,
        );
      } else {
        itemFound = schoolAudits.find(
          (el) => el.id === audit?.text || el.innerId === audit?.text,
        );
      }

      mappedAuditsFailedObject.push(
        itemFound ? { ...itemFound, status: audit?.status } : undefined,
      );
    });
  } else {
    if (item?.type === "Comune" || item?.type === "municipality") {
      municipalityAudits.forEach((audit) => {
        mappedAuditsFailedObject.push({ ...audit, status: "undone" });
      });
    } else {
      schoolAudits.forEach((audit) => {
        mappedAuditsFailedObject.push({ ...audit, status: "undone" });
      });
    }
  }

  const data = {
    crawlerVersion: VERSION_VALIDATOR,
    guiVersion: VERSION,
    basePathCss: path.join(__dirname, "public/css/"),
    basePathJs: path.join(__dirname, "public/js/"),
    basePathImages: path.join(__dirname, "public/images/"),
    currentPage: "",
    mock: {
      id: item?.id,
      date: item?.date,
      type: item?.type,
      accuracy: item?.accuracy,
      website: item?.url,
      results: {
        status: item?.status,
        total_audits:
          (item?.successCount ?? 0) +
          (item?.failedCount ?? 0) +
          (item?.errorCount ?? 0),
        passed_audits: item?.successCount ? item?.successCount : 0,
        failed_audits:
          item?.failedCount && item?.errorCount
            ? item?.failedCount + item?.errorCount
            : item?.failedCount
              ? item.failedCount
              : item?.errorCount
                ? item.errorCount
                : 0,
      },
      redo_audits:
        mappedAuditsFailedObject && mappedAuditsFailedObject.length
          ? mappedAuditsFailedObject
          : [],
      logs: queryParam
        ? readFileSync(`${getFolderWithId(queryParam)}/logs.txt`, "utf8")
        : "",
    },
    defaultAudits: municipalityAudits,
    reportId: queryParam,
    historyData: {},
  };

  const filePath = path.join(__dirname, "views", `index.ejs`);

  if (pageName == "history") {
    if (url) {
      const queryParam = url?.split("page=")[1];
      data.historyData = await getItems(queryParam ? Number(queryParam) : 1, 8);
    } else {
      data.historyData = await getItems(1, 8);
    }
  }

  data.currentPage = pageName;
  ejs.renderFile(filePath, data, {}, (err, str) => {
    if (err) {
      console.error("Error rendering EJS:", err);
      return;
    }

    const outputPathFile = path.join(saveDirname, "index.html");
    try {
      writeFileSync(outputPathFile, str);
      console.log("File HTML generato con successo:", outputPathFile);
      if (mainWindow) mainWindow.loadFile(outputPathFile);
    } catch (err: unknown) {
      console.error("Errore nel salvare il file HTML:", err);
    }
  });
};

ipcMain.on("navigate", async (event, data) => {
  await loadPage(data.pageName, data.url);
});

/** flow for 'Avvia scansione' */
ipcMain.on("start-node-program", async (event, data) => {
  let { type, accuracy, scope, timeout, concurrentPages } = data;
  const { website } = data;

  if (!type) type = "municipality";
  if (!accuracy) accuracy = "all";
  if (!scope) scope = "online";
  if (!timeout) timeout = 30000;
  if (!concurrentPages) concurrentPages = 20;

  const itemValues = await insertItem(website, data);

  console.log(" SEARCH URL ", await searchURL("save"));

  const reportFolder = itemValues?.reportFolder;
  const itemId = itemValues?.id;

  if (!reportFolder || !itemId) {
    throw new Error();
  }

  const logFilePath = path.join(reportFolder, "./logs.txt");
  const logStream = createWriteStream(logFilePath, { flags: "a" });
  const startTime = Date.now();

  let auditsString = "";
  if (data.audits.length > 0) {
    const selectedAudits = data.audits;
    if (type == "municipality" && selectedAudits.includes("lighthouse")) {
      selectedAudits.push("municipality_improvement_plan");
    }

    auditsString = selectedAudits.join(",");
  }

  let folderScript = __dirname;
  let commandPath = path.join(folderScript, "commands", "scan");
  if (process.env.NODE_ENV?.toString().trim() !== "development") {
    folderScript = process.resourcesPath;
    commandPath = path.join(folderScript, "dist", "commands", "scan");
  }

  const args = [
    "--type",
    type,
    "--destination",
    reportFolder,
    "--report",
    "report",
    "--website",
    website,
    "--scope",
    scope,
    "--accuracy",
    accuracy,
    "--concurrentPages",
    concurrentPages,
    "--timeout",
    timeout,
    "--auditsSubset",
    auditsString,
  ];

  let chromeFilePath = path.join(__dirname, "../", "chrome-headless-shell");
  if (process.env.NODE_ENV?.toString().trim() !== "development") {
    chromeFilePath = path.join(process.resourcesPath, "chrome-headless-shell");
  }

  chromeFilePath = getPathDirectoryInDirectory(chromeFilePath);
  chromeFilePath = getPathDirectoryInDirectory(chromeFilePath);
  chromeFilePath = path.join(chromeFilePath, "chrome-headless-shell");

  console.log("CHROME FILE PATH:", chromeFilePath, );

  nodeProcess = fork(commandPath, args, {
    stdio: ["pipe", "pipe", "pipe", "ipc"],
    env: {
      ...process.env,
      PUPPETEER_EXECUTABLE_PATH: chromeFilePath
    }
  });

  if (nodeProcess.stdout) {
    // update input form with current website & disable form
    nodeProcess.stdout.once("data", () => {
      event.sender.send("input-form-update", { type, website });
    });

    nodeProcess.stdout.on("data", (data) => {
      const logString = cleanConsoleOutput(data.toString());
      event.sender.send("log-update", logString);
      logStream.write(logString);
    });
  }

  if (nodeProcess.stderr) {
    nodeProcess.stderr.on("data", (data) => {
      const logString = cleanConsoleOutput(data.toString());
      event.sender.send("log-update", logString);
      logStream.write(logString);
    });
  }

  nodeProcess.on("exit", (code, signal) => {
    if (signal) {
      console.log(`Processo figlio terminato tramite segnale ${signal}`);
    } else {
      console.log(`Processo figlio terminato con codice ${code}`);
    }

    if (code) {
      if (code) {
        const logString = cleanConsoleOutput(code.toString());
        event.sender.send("log-update", logString);
        logStream.write(logString);
        event.sender.send("log-update", `Process finished with code ${code}`);
      }

      logStream.close();
    }

    console.log(" console.log(passo);", itemId, reportFolder);

    updateItem(
      itemId,
      type === "municipality" ? "Comune" : "Scuola",
      undefined,
      -2,
      "[]",
      undefined,
      undefined,
      undefined,
    );

    event.sender.send("scan-finished", [itemId]);
  });

  nodeProcess.on("close", (code) => {
    console.log("passo");
    if (!killedManually) {
      console.log("passaaaaaa");
      const endTime = Date.now();
      const executionTime = endTime - startTime;

      event.sender.send("log-update", `Process finished with code ${code}`);

      logStream.write("Execution time: " + executionTime);
      setTimeout(() => {
        logStream.close();
      }, 5000);

      //get data from jsonReport
      const {
        generalResult,
        failedAudits,
        successCount,
        failedCount,
        errorCount,
      } = getDataFromJSONReport(`${reportFolder}/report.json`);

      event.sender.send("scan-finished", [itemId]);

      const referenceArray =
        type === "municipality" ? municipalityAudits : schoolAudits;
      const mappedAudit: (AuditI | undefined)[] = referenceArray.map((item) => {
        if (
          failedAudits.find(
            (el) => el.text === item.innerId || el.text === item.id,
          )
        ) {
          return failedAudits.find(
            (el) => el.text === item.innerId || el.text === item.id,
          );
        } else {
          return {
            text: item.id,
            status: "undone",
          };
        }
      });

      updateItem(
        itemId,
        type === "municipality" ? "Comune" : "Scuola",
        executionTime,
        generalResult,
        JSON.stringify(mappedAudit),
        successCount,
        failedCount,
        errorCount,
        accuracy,
        timeout,
        concurrentPages,
        scope,
      );

      event.sender.send("open-report", `${reportFolder}/report.html`);
    }

    killedManually = false;
  });
});

ipcMain.on("kill-process", async () => {
  killedManually = true;
  nodeProcess.kill("SIGKILL");
});

ipcMain.on("start-type", async (event, data) => {
  let urls: string[] | Item[] | undefined = await searchURL(data, 1, 10);

  if (urls?.length) {
    urls = urls.map((el) => {
      return el.url;
    });
  }

  event.sender.send("update-autocomplete-list", urls);
});

ipcMain.on("recover-report", async (event, data) => {
  const item = await getItemById(data ?? "");
  event.sender.send("return-report-item", item);
});
ipcMain.on("download-report", async (event, data) => {
  const item: Item | null = await getItemById(data["reportId"]);

  if (!item) {
    return;
  }

  const filePath =
    getFolderWithId(item.id) +
    `/report_${item.url.toString().replace("https://", "").replace("/", "")}_${new Date(item.date).toISOString().split(".")[0].replace("T", "_").replace(/[-:]/g, ".")}.html`;

  const { filePath: savePath } = await dialog.showSaveDialog({
    defaultPath: path.basename(filePath),
  });

  if (savePath) {
    fs.copyFile(filePath, savePath, (err) => {
      if (err) {
        console.error("Errore durante il download:", err);
      } else {
        console.log("File scaricato con successo!");
      }
    });
  }
});

ipcMain.on("get-report-path", async (event, data) => {
  if (!data.reportId) {
    return;
  }

  const filePath = getFolderWithId(data.reportId) + "/report.html";
  event.sender.send("open-html-report", filePath);
});

ipcMain.on("delete-record", async (event, data) => {
  if (!data["reportId"]) {
    return;
  }
  await deleteItem(data["reportId"]);

  if (getFolderWithId(data["reportId"])) {
    fs.rm(
      getFolderWithId(data["reportId"]) ?? "",
      { recursive: true, force: true },
      (err) => {
        if (err) {
          throw err;
        }

        console.log(`Folder eliminata!`);

        loadPage("history", "");
      },
    );
  }

  return;
});
