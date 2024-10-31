const { ipcRenderer } = require('electron');

START_BUTTON.addEventListener('click', () => {
  ipcRenderer.send('start-node-program');
});

ipcRenderer.on('log-update', (event, data) => {
  LOGS_TEXTAREA.value += data + '\n';
  LOGS_TEXTAREA.scrollTop = LOGS_TEXTAREA.scrollHeight;
});

ipcRenderer.on('open-report', (event, reportPath) => {
  REPORT_FRAME.src = reportPath;
  REPORT_CONTAINER.style.display = 'block';
});
