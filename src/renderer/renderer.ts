const { ipcRenderer } = require('electron');
const formSubmit: HTMLElement | null = document.getElementById('startBtn');
const inputURL: HTMLTextAreaElement | HTMLElement | null = document.getElementById('inputUrl');
const logsTextArea: HTMLTextAreaElement | HTMLElement | null = document.getElementById('logs');
const reportFrame: HTMLIFrameElement | HTMLElement | null = document.getElementById('reportFrame');
const alertContainer: HTMLElement | null = document.getElementById('alert-container');
const logsContainer: HTMLElement | null = document.getElementById('logs-container');
const reportContainer: HTMLElement | null = document.getElementById('report-container');
const progressSpinner: HTMLElement | null = document.getElementById('progress-spinner');

const progressBar: HTMLElement | null = logsContainer && logsContainer.querySelector('.progress-bar');
const percentage: HTMLElement | null = logsContainer && logsContainer.querySelector('#progress-percentage');
let progress = 0;
let inScan = true

function updateProgress() {
  console.log('start');
  setIsLoading(true);

  const increment = 7.3;
  const interval = 500; // 0,5 secondi in millisecondi

  const timer = setInterval(() => {
    showStep(2);
    progress += increment;

    progress = Math.min(progress, 100);

    if (percentage && progressBar && inScan) {
      console.log('IN SCAN', inScan)
      const rounded = Math.round(progress);
      percentage.innerHTML = rounded.toString();
      progressBar.style.width = `${rounded}%`;
      progressBar.setAttribute('aria-valuenow', rounded.toString());
    }

    if (progress >= 100) {
      clearInterval(timer);
      // showStep(3);
      // setIsLoading(false);
      // progress = 0;
    }
  }, interval);
}

const completeProgress = () => {
  inScan=false;
  showStep(3);
  setIsLoading(false);
  progress = 0;
}

function showStep(step: number) {
  switch (step) {
    case 2:
      alertContainer && alertContainer.classList.add('d-none');
      logsContainer && logsContainer.classList.remove('d-none');
      reportContainer && reportContainer.classList.add('d-none');
      break;
    case 3:
      alertContainer && alertContainer.classList.add('d-none');
      logsContainer && logsContainer.classList.add('d-none');
      reportContainer && reportContainer.classList.remove('d-none');
      break;

    case 1:
    default:
      alertContainer && alertContainer.classList.remove('d-none');
      logsContainer && logsContainer.classList.add('d-none');
      reportContainer && reportContainer.classList.add('d-none');
      break;
  }
}

function setIsLoading(status: any) {
  if (status) {
    progressSpinner && progressSpinner.classList.remove('d-none');
    if (formSubmit) formSubmit.setAttribute('disabled', "true");
  } else {
    progressSpinner && progressSpinner.classList.add('d-none');
    if (formSubmit) formSubmit.removeAttribute('disabled');
  }
}

if (formSubmit)
  formSubmit.addEventListener('click', (data) => {
    console.log('CLICKED', data)
    let website = ''
    if (inputURL) {
      console.log('FOUND TEZTAREA', inputURL)
      website = (inputURL as HTMLTextAreaElement).value
    }

    if (isValidURL(website)) {
      const args = {
        website
      }
      updateProgress()
      console.log('send event', ipcRenderer.send('database-insert', { title: website }))

      ipcRenderer.send('start-node-program', args);
    } else {
      alert('Please enter a valid URL');
    }
  });

ipcRenderer.on('scan-finished', (event, data) => {
  console.log('SCAN FINISHED')
  completeProgress()
})

ipcRenderer.on('log-update', (event, data) => {
  console.log(data)
  if (logsTextArea) {
    (logsTextArea as HTMLTextAreaElement).value += data + '\n';
    logsTextArea.scrollTop = logsTextArea.scrollHeight;
  }
});

ipcRenderer.on('open-report', (event, reportPath) => {
  if (reportFrame) {
    (reportFrame as HTMLIFrameElement).src = reportPath;
    reportFrame.style.display = 'block';
  }
});

function isValidURL(url: string): boolean {
  try {
    const result = new URL(url);
    return !result.hostname || !result.port;
  } catch (_) {
    return false;
  }
}
