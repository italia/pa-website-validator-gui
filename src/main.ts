import { app, BrowserWindow, ipcMain } from 'electron';
import { getItems, initializeDatabase, insertItem, searchURL, updateItem } from './db.js';
import { ChildProcess, exec } from 'child_process';
import path from 'path';
import { createWriteStream , readFileSync, writeFileSync} from 'fs';
import * as ejs from 'ejs';
const __dirname = import.meta.dirname;
import {getDataFromJSONReport} from './utils.js'

// todo: Only dev mode
const pathToCrawler = '/Users/lorenzo.vernocchi/projects/mitd/DTD_Crawler/dist'

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
    loadPage('');
}

const loadPage = (page: string) => {

    const data = {
        crawlerVersion: '1.0.0',
        guiVersion: '1.0.0',
        publicPath: "public/",
        basePath: "renderer/",
        currentPage: '',
        mock: JSON.parse(readFileSync('mock.json', 'utf8'))
    };

    const filePath = path.join(__dirname, 'views', `index.ejs`);

    console.log('filepath', filePath)
    data.currentPage = page;
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

ipcMain.on('navigate', (event, page) => {
    loadPage(page);
});

/** flow for 'Avvia scansione' */
ipcMain.on('start-node-program', async (event, data) => {
    //console.log(items)

    console.log('Website', data.website)
    let { website, accuracy, scope, timeout, concurrentPages } = data
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

    let command = `node ${pathToCrawler} --type municipality --destination ${reportFolder} --report report --website ${website} --scope  ${scope} --accuracy ${accuracy} --concurrentPages ${concurrentPages} --timeout ${timeout} --view false `;

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
        event.sender.send('scan-finished', `${code}`);

        logStream.write('Execution time: ' + executionTime);
        logStream.close()

        //get data from jsonReport
        const {} = getDataFromJSONReport(`${reportFolder}/report.json`)

        updateItem(itemId, executionTime);

        event.sender.send('open-report', `${reportFolder}/report.html`);
    });
});



// ipcMain.on('database:fetchAll', () => {
//   const itemRepo = dataSource.manager.repository(Item);
//   return itemRepo.find();
// });

