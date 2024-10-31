import { app, BrowserWindow, ipcMain } from 'electron';
import { getItems, initializeDatabase, insertItem , searchURL} from '../db/db';
import { ChildProcess, exec } from 'child_process';
import path from 'path';
import { createWriteStream , writeFileSync} from 'fs';
import * as ejs from 'ejs';

let mainWindow: BrowserWindow | null = null;

app.whenReady().then(() => {
    console.log('System platform is: ', process.platform)
    createWindow();
    initializeDatabase();
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
            nodeIntegration: true,
            contextIsolation: false, // Disabilita l'isolamento del contesto
        }
    });


    const data = {
        crawlerVersion: '1.0.0',
        publicPath: "src/renderer/"
      };
      const templatePath = path.join('views', 'index.ejs');
      ejs.renderFile(templatePath, data, {}, (err, str) => {
        if (err) {
          console.error('Errore nel renderizzare il template EJS:', err);
          return;
        }
        const outputPath = path.join('./', 'index.html');
    
        writeFileSync(outputPath, str)
      });
    
    mainWindow.webContents.openDevTools()
    mainWindow.loadFile(path.join('./','..','..', 'index.html'))//'../renderer/index.html');

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    //await mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
}


/** flow for 'Avvia scansione' */
ipcMain.on('start-node-program', async (event, data) => {
    //const items = getItems()
    //console.log(items)

    console.log('Website', data.website)
    const website = data.website 

    const itemValues = await insertItem(website)
    console.log(await getItems())

    //console.log(' SEARCH ITEMS ', await searchItems('save'))
    console.log(' SEARCH URL ', await searchURL('save'))

     const reportFolder = itemValues?.reportFolder 


     if (!reportFolder) {
        throw new Error()
     }

     const logFilePath = path.join(reportFolder,'./logs.txt')
     const logStream = createWriteStream(logFilePath, { flags: 'a' });
     const startTime = Date.now();
     const nodeProcess = exec(`node /Users/lorenzo.vernocchi/projects/mitd/DTD_Crawler/dist --type municipality --destination ${reportFolder} --report report --website ${website} --scope online --view false --accuracy all`);
 

     //todo: update row

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
        const duration = endTime - startTime

        event.sender.send('log-update', `Process finished with code ${code}`);
        event.sender.send('scan-finished', `${code}`);
        logStream.write('DURATION' + duration);
        logStream.close()


        event.sender.send('open-report', '/Users/lorenzo.vernocchi/projects/mitd/DTD_Crawler_pa-website-validator-ng-gui/report.html');
    });
});



// ipcMain.on('database:fetchAll', () => {
//   const itemRepo = dataSource.manager.repository(Item);
//   return itemRepo.find();
// });

