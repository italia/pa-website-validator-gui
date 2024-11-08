import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import {getFolderWithId, getItemById, getItems, initializeDatabase, insertItem, searchURL, updateItem} from './db.js';
import { fork } from 'child_process';
import path from 'path';
import { createWriteStream , readFileSync, writeFileSync } from 'fs';
import * as ejs from 'ejs';
import {getDataFromJSONReport} from './utils.js'
import {municipalityAudits, schoolAudits} from "./storage/auditMapping.js";
import {Item} from "./entities/Item";
import fs from "fs";

const __dirname = import.meta.dirname;
const saveDirname = app.getPath('userData');

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
            contextIsolation: true,
        }
    });

    mainWindow.webContents.openDevTools();

    // load first page
    await loadPage('home', '');
}

const loadPage = async (pageName: string, url: string) => {
    const queryParam = url?.split('id=')[1]

    const item = await getItemById(queryParam ?? '');
    const mappedAuditsFailedObject: ({ title: string; code: string; id: string; innerId: string; weight: number; } | undefined)[] = [];
    if(item?.failedAudits){
        item.failedAudits.forEach(audit => {
            let itemFound;
            if(item.type === 'Comune'){
                itemFound = municipalityAudits.find(el => el.id === audit);
            }else{
                itemFound = schoolAudits.find(el => el.id === audit);
            }

            mappedAuditsFailedObject.push(itemFound);
        })
    }

    const data = {
        crawlerVersion: '1.0.0',
        guiVersion: '1.0.0',
        basePathCss: path.join(__dirname, 'public/css/'),
        basePathJs: path.join(__dirname, 'public/js/'),
        currentPage: '',
        mock: {
            "id": item?.id,
            "results": {
                "status": item?.status,
                "total_audits": (item?.successCount ?? 0) + (item?.failedCount ?? 0) + (item?.errorCount ?? 0),
                "passed_audits": item?.successCount ? item?.successCount : 0,
                "failed_audits": item?.failedCount && item?.errorCount ? item?.failedCount + item?.errorCount : item?.failedCount ? item.failedCount: item?.errorCount ? item.errorCount : 0,
            },
            "redo_audits": mappedAuditsFailedObject && mappedAuditsFailedObject.length ? mappedAuditsFailedObject : [],
            "logs": queryParam ? readFileSync( `${getFolderWithId(queryParam)}/logs.txt`, 'utf8') : ''
        },
        defaultAudits: municipalityAudits,
        reportId: queryParam,
        historyData:{

        }
    };

    const filePath = path.join(__dirname, 'views', `index.ejs`);

    if (pageName == 'history') {
        if(url){
            const queryParam = url?.split('page=')[1];
            data.historyData  = await getItems(queryParam ? Number(queryParam) : 1,5);
        }else{
            data.historyData  = await getItems(1,5)
        }
    }

    data.currentPage = pageName;
    ejs.renderFile(filePath, data, {}, (err, str) => {
        if (err) {
            console.error("Error rendering EJS:", err);
            return;
        }

        const outputPathFile = path.join(saveDirname,'index.html');
        try {
            writeFileSync(outputPathFile, str)
            console.log('File HTML generato con successo:', outputPathFile);
            if (mainWindow)
                mainWindow.loadFile(outputPathFile)
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
    let { type, website, accuracy, scope, timeout, concurrentPages } = data

    if (!type) type = 'municipality'
    if (!accuracy) accuracy = 'all'
    if (!scope) scope = 'online'
    if (!timeout) timeout = 30000
    if (!concurrentPages) concurrentPages = 20

    const itemValues = await insertItem(website, data)

    console.log(' SEARCH URL ', await searchURL('save'))

    let reportFolder = itemValues?.reportFolder
    const itemId = itemValues?.id

    if (!reportFolder || !itemId) {
        throw new Error()
    }

    const logFilePath = path.join(reportFolder, './logs.txt')
    const logStream = createWriteStream(logFilePath, { flags: 'a' });
    const startTime = Date.now();

    let auditsString = ''
    if (data.audits.length > 0) {
        const selectedAudits = data.audits;
        if(type == 'municipality' && selectedAudits.includes('lighthouse')){
            selectedAudits.push('municipality_improvement_plan')
        }

        auditsString = selectedAudits.join(',');
    }

    let folderScript = __dirname;
    let commandPath = path.join(folderScript, 'commands', 'scan');
    if (process.env.NODE_ENV !== 'development') {
        folderScript = process.resourcesPath;
        commandPath = path.join(folderScript, 'dist','commands', 'scan');
    }

    const args = [
        '--type', type,
        '--destination', reportFolder,
        '--report', 'report',
        '--website', website,
        '--scope', scope,
        '--accuracy', accuracy,
        '--concurrentPages', concurrentPages,
        '--timeout', timeout,
        '--auditsSubset', auditsString
    ];

    const nodeProcess = fork(commandPath, args, {
        stdio: ['pipe', 'pipe', 'pipe', 'ipc']
    });

    nodeProcess.stdout && nodeProcess.stdout.on('data', (data) => {
        event.sender.send('log-update', data.toString());
        logStream.write(data.toString());
    });

    nodeProcess.stderr && nodeProcess.stderr.on('data', (data) => {
        event.sender.send('log-update', data.toString());
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

        const mappedAuditsFailedString : string[] = failedAudits.map(audit => {
            let idFound;
            if(type === 'municipality'){
                idFound = municipalityAudits.find(el => el.innerId === audit) ? municipalityAudits.find(el => el.innerId === audit)?.id : '';
            }else{
                idFound = schoolAudits.find(el => el.innerId === audit) ? schoolAudits.find(el => el.innerId === audit)?.id : '';
            }

            return idFound ?? ''
        })

        updateItem(itemId, type === 'municipality' ? 'Comune' : 'Scuola', executionTime, generalResult, mappedAuditsFailedString, successCount, failedCount, errorCount, accuracy, timeout, concurrentPages, scope);

        event.sender.send('open-report', `${reportFolder}/report.html`);
    });
});

ipcMain.on('start-type', async (event, data) => {
    let urls : string[] | Item[] | undefined = await searchURL(data, 1, 10);
    
    if(urls?.length){
        urls = urls.map(el => {
            return el.url
        })
    }

    event.sender.send('update-autocomplete-list', urls)
})

ipcMain.on('recover-report', async (event, data) => {
    const item = await getItemById(data ?? '');
    event.sender.send('return-report-item', item)
})
ipcMain.on('download-report', async (event, data) => {
    const item: Item | null = await getItemById(data['reportId']);

    if(!item){
        return;
    }

    const filePath = getFolderWithId(item.id) + '/report.html'

    const { filePath: savePath } = await dialog.showSaveDialog({
        defaultPath: path.basename(filePath) ,
    });

    if (savePath) {
        fs.copyFile(filePath, savePath, (err) => {
            if (err) {
                console.error('Errore durante il download:', err);
            } else {
                console.log('File scaricato con successo!');
            }
        });
    }
})