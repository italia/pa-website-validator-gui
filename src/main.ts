import { app, BrowserWindow, ipcMain } from 'electron';
import {getFolderWithId, getItemById, getItems, initializeDatabase, insertItem, searchURL, updateItem} from './db.js';
import { ChildProcess, exec } from 'child_process';
import path from 'path';
import { createWriteStream , readFileSync, writeFileSync} from 'fs';
import * as ejs from 'ejs';
const __dirname = import.meta.dirname;
import {getDataFromJSONReport} from './utils.js'

// todo: Only dev mode
const pathToCrawler = '/Users/luca.carrisi/DTD_Crawler/dist'

let mainWindow: BrowserWindow | null = null;

app.disableHardwareAcceleration()

app.whenReady().then(() => {
    console.log('System platform is: ', process.platform)
    initializeDatabase();
    createWindow();
});

app.on('window-all-closed', () => {
    //   if (process.platform !== 'darwin') 
    app.quit();
});

async function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 1000,
        webPreferences: {
            preload: path.join(__dirname, "preload.mjs"),
            nodeIntegration: true,
            contextIsolation: true, // Disabilita l'isolamento del contesto
        }
    });

    mainWindow.webContents.openDevTools();

    // load first page
    await loadPage('', '');
}

const loadPage = async (pageName: string, url: string) => {
    const queryParam = url.split('id=')[1]

    const item = await getItemById(queryParam ?? '')

    const data = {
        crawlerVersion: '1.0.0',
        guiVersion: '1.0.0',
        basePathCss: "public/css/",
        basePathJs: "public/js/",
        currentPage: '',
        mock: {
            "results": {
                "status": item?.status,
                "total_audits": (item?.successCount ?? 0) + (item?.failedCount ?? 0) + (item?.errorCount ?? 0),
                "passed_audits": item?.successCount ? item?.successCount : 0,
                "failed_audits": item?.failedCount && item?.errorCount ? item?.failedCount + item?.errorCount : item?.failedCount ? item.failedCount: item?.errorCount ? item.errorCount : 0,
            },
            "logs": queryParam ? readFileSync( `${getFolderWithId(queryParam)}/logs.txt`, 'utf8') : ''
        }
    };

    const filePath = path.join(__dirname, 'views', `index.ejs`);

    data.currentPage = pageName;
    ejs.renderFile(filePath, data, {}, (err, str) => {
        if (err) {
            console.error("Error rendering EJS:", err);
            return;
        }
        const outputPath = path.join(__dirname, './', 'index.html');
        try {
            writeFileSync(outputPath, str)
            console.log('File HTML generato con successo:', outputPath);
            if (mainWindow)
                mainWindow.loadFile('index.html')
        } catch (err: unknown) {

            console.error('Errore nel salvare il file HTML:', err);
        }
    })
}

ipcMain.on('navigate', async (event, data) => {
    await loadPage(data.pageName, data.url);
});

/** flow for 'Avvia scansione' */
ipcMain.on('start-node-program', async (event, data) => {
    //console.log(items)

    console.log('Website', data.website)
    let { type, website, accuracy, scope, timeout, concurrentPages } = data
    if (!accuracy) accuracy = 'all'
    if (!scope) scope = 'online'
    if (!timeout) timeout = 300
    if (!concurrentPages) concurrentPages = 20

    const itemValues = await insertItem(website, data)
    //console.log(await getItems())

    //console.log(' SEARCH ITEMS ', await searchItems('save'))
    console.log(' SEARCH URL ', await searchURL('save'))

    const reportFolder = itemValues?.reportFolder
    const itemId = itemValues?.id

    if (!reportFolder || !itemId) {
        throw new Error()
    }

    const logFilePath = path.join(reportFolder, './logs.txt')
    const logStream = createWriteStream(logFilePath, { flags: 'a' });
    const startTime = Date.now();

    let command = `node ${pathToCrawler} --type ${type} --destination ${reportFolder} --report report --website ${website} --scope  ${scope} --accuracy ${accuracy} --concurrentPages ${concurrentPages} --timeout ${timeout} --view false `;

    if (data.audits.length > 0) {
        const auditsString = data.audits.join(', ');
        command += `--onlyAudits ${auditsString}`
    }

    const nodeProcess = exec(command)

    nodeProcess.stdout && nodeProcess.stdout.on('data', (data) => {
        event.sender.send('log-update', data);
        logStream.write(data.toString());
    });

    nodeProcess.stderr && nodeProcess.stderr.on('data', (data) => {
        event.sender.send('log-update', `${data}`);
        logStream.write(data.toString());
    });

    nodeProcess.on('close', (code) => {
        const endTime = Date.now();
        const executionTime = endTime - startTime

        event.sender.send('log-update', `Process finished with code ${code}`);

        logStream.write('Execution time: ' + executionTime);
        setTimeout(() => {
            logStream.close()
        }, 5000)

        //get data from jsonReport
        const {
            generalResult,
            failedAudits,
            successCount,
            failedCount,
            errorCount} = getDataFromJSONReport(`${reportFolder}/report.json`);

        event.sender.send('scan-finished', [itemId]);

        console.log(failedAudits);
        updateItem(itemId, executionTime, generalResult, failedAudits, successCount, failedCount, errorCount);

        event.sender.send('open-report', `${reportFolder}/report.html`);
    });
});



// ipcMain.on('database:fetchAll', () => {
//   const itemRepo = dataSource.manager.repository(Item);
//   return itemRepo.find();
// });

