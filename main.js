import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { exec } from 'child_process';
import * as ejs from 'ejs';
import * as fs from 'fs';

app.disableHardwareAcceleration();

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // Disabilita l'isolamento del contesto,
    },
  });

  mainWindow.webContents.openDevTools();

  // load first page
  loadPage('');

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

// TODO capire da dove prendere questi dati
const data = {
  guiVersion: "1.0.0",
  crawlerVersion: '1.0.0',
  publicPath: "public/",
  currentPage: ''
};

// rebuild html when page changes
function loadPage(page) {
  const filePath = path.join('views', `index.ejs`);
  data.currentPage = page;
  data.mock = JSON.parse(fs.readFileSync('mock.json', 'utf8'));

  ejs.renderFile(filePath, data, {}, (err, str) => {
    if (err) {
      console.error("Error rendering EJS:", err);
      return;
    }
    const outputPath = path.join('./', 'index.html');
    fs.writeFile(outputPath, str, (err) => {
      if (err) {
        console.error('Errore nel salvare il file HTML:', err);
      } else {
        console.log('File HTML generato con successo:', outputPath);
        mainWindow.loadFile('index.html');
      }
    });
  });
}
ipcMain.on('navigate', (event, page) => {
  loadPage(page);
});


ipcMain.on('start-node-program', (event) => {
  const nodeProcess = exec(
    `node /Users/simone.amadio/Documents/Lavoro/Builds/DTD_Crawler/dist --type municipality --destination /Users/simone.amadio/Documents/Lavoro/Builds/DTD_Crawler_pa-website-validator-ng-gui --report report --website https://www.comune.mottola.ta.it/ --scope online --view false --accuracy all`
  );

  nodeProcess.stdout.on('data', (data) => {
    event.sender.send('log-update', data);
  });

  nodeProcess.stderr.on('data', (data) => {
    event.sender.send('log-update', `${data}`);
  });

  nodeProcess.on('close', (code) => {
    event.sender.send('log-update', `Process finished with code ${code}`);

    event.sender.send(
      'open-report',
      '/Users/simone.amadio/Documents/Lavoro/Builds/DTD_Crawler_pa-website-validator-ng-gui/report.html'
    );
  });
});
