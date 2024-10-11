const { ipcRenderer } = require('electron');

const startBtn = document.getElementById('startBtn');
const logsTextArea = document.getElementById('logs');
const iframeContainer = document.getElementById('iframe-container');
const reportFrame = document.getElementById('reportFrame');

startBtn.addEventListener('click', () => {
    ipcRenderer.send('start-node-program');
});

ipcRenderer.on('log-update', (event, data) => {
    logsTextArea.value += data + '\n';
    logsTextArea.scrollTop = logsTextArea.scrollHeight;
});

ipcRenderer.on('open-report', (event, reportPath) => {
    reportFrame.src = reportPath;
    iframeContainer.style.display = 'block';
});


