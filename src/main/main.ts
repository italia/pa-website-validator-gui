import { app, BrowserWindow, ipcMain } from 'electron';
import { initializeDatabase } from '../db/db';
import { ChildProcess, exec } from 'child_process';

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

    mainWindow.webContents.openDevTools()
    mainWindow.loadFile('../renderer/index.html');

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    //await mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
}


/** flow for 'Avvia scansione' */
ipcMain.on('start-node-program', (event, data) => {
    //const items = getItems()
    //console.log(items)

    console.log('Website', data.website)
    const website = data.website

    

    //insertItem({url})


    // const nodeProcess = exec(`node /Users/lorenzo.vernocchi/projects/mitd/DTD_Crawler/dist --type municipality --destination /Users/lorenzo.vernocchi/projects/mitd/DTD_Crawler_pa-website-validator-ng-gui/ --report report --website ${website} --scope online --view false --accuracy all`);

    // nodeProcess.stdout && nodeProcess.stdout.on('data', (data) => {
    //     event.sender.send('log-update', data);
    // });

    // nodeProcess.stderr && nodeProcess.stderr.on('data', (data) => {
    //     event.sender.send('log-update', `${data}`);
    // });

    // nodeProcess.on('close', (code) => {

    //     event.sender.send('log-update', `Process finished with code ${code}`);
    //     event.sender.send('scan-finished', `${code}`);

    //     event.sender.send('open-report', '/Users/lorenzo.vernocchi/projects/mitd/DTD_Crawler_pa-website-validator-ng-gui/report.html');
    // });
});



// ipcMain.on('database:fetchAll', () => {
//   const itemRepo = dataSource.manager.repository(Item);
//   return itemRepo.find();
// });

