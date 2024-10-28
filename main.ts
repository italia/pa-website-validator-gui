import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { ChildProcess, exec } from 'child_process';
//import Database from './db/database.js';
import { initializeDatabase , insertItem, getItems} from './db/db.js';

app.disableHardwareAcceleration();

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 1000,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false, // Disabilita l'isolamento del contesto
        }
    });

    mainWindow.webContents.openDevTools()

    mainWindow.loadFile('index.html');

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    //database listeners
}

app.whenReady().then(() => {
    initializeDatabase()
    createWindow()
});

ipcMain.on('start-node-program', (event) => {

    console.log('EVENT', event)

    const items = getItems()
    console.log(items)

    const url = "https://www.comune.mottola.ta.it/"

    insertItem({url})

    const nodeProcess = exec(`node /Users/lorenzo.vernocchi/projects/mitd/DTD_Crawler/dist --type municipality --destination /Users/lorenzo.vernocchi/projects/mitd/DTD_Crawler_pa-website-validator-ng-gui/ --report report --website ${url} --scope online --view false --accuracy all`);

    nodeProcess.stdout && nodeProcess.stdout.on('data', (data) => {
        event.sender.send('log-update', data);
    });

    nodeProcess.stderr && nodeProcess.stderr.on('data', (data) => {
        event.sender.send('log-update', `${data}`);
    });

    nodeProcess.on('close', (code) => {
        event.sender.send('log-update', `Process finished with code ${code}`);
        event.sender.send('open-report', '/Users/lorenzo.vernocchi/projects/mitd/DTD_Crawler_pa-website-validator-ng-gui/report.html');
    });
});
