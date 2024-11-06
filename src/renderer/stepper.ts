import {INPUT_URL, 
  START_BUTTON, 
  PERCENTAGE, 
  PROGRESS_BAR, 
  PROGRESS_SPINNER, 
  URL_FORM, 
  FULL_SETTINGS_CONTAINER, 
  LOGS_CONTAINER,
  REPORT_CONTAINER,
  REPORT_DOWNLOAD_BTN,LOGS_TEXTAREA,REPORT_FRAME} from './elements.js'
import {  getSettingsFormValues, getAuditsFormValues} from './settingsForm.js'

INPUT_URL?.addEventListener('input', (e) => {
  if (!START_BUTTON) return

  //@ts-ignore
  const value = e.target.value
  if (value.length) START_BUTTON.removeAttribute('disabled');
  else START_BUTTON.setAttribute('disabled', 'true');
});

let progress = 0;
let inScan = true

function updateProgress() {
  showStep(2);
  console.log('start');
  setIsLoading(true);

  const increment = 7.3;
  const interval = 500;

  const timer = setInterval(() => {
    progress += increment;

    progress = Math.min(progress, 100);

    if (PERCENTAGE && PROGRESS_BAR) {
      const rounded = Math.round(progress);
      PERCENTAGE.innerHTML = `${rounded}`;
      (PROGRESS_BAR as HTMLProgressElement).style.width = `${rounded}%`;

      PROGRESS_BAR.setAttribute('aria-valuenow', `${rounded}`);
    }

    if (progress >= 100) {
      clearInterval(timer);
      // showStep(3);
      // setIsLoading(false);
      // progress = 0;
    }
  }, interval);
}

URL_FORM?.addEventListener('submit', (e) => {
  e.preventDefault();
  const settingsFormValues: any = getSettingsFormValues()
  const auditsFormValues: any = getAuditsFormValues();

  const website = (INPUT_URL as HTMLTextAreaElement).value

  updateProgress();

  console.log('SETTINGS VALUES',settingsFormValues) 
  console.log('AUDITS VALUES',auditsFormValues)
  console.log('website', website)

  const args = {
    website,
    settingsFormValues,
    audits: auditsFormValues
  }

  window.electronAPI.send('start-node-program', args);
});

function showStep(step: number) {
  switch (step) {
    case 2:
      FULL_SETTINGS_CONTAINER && FULL_SETTINGS_CONTAINER.classList.add('d-none');
      LOGS_CONTAINER && LOGS_CONTAINER.classList.remove('d-none');
      REPORT_CONTAINER && REPORT_CONTAINER.classList.add('d-none');
      break;
    case 3:
      FULL_SETTINGS_CONTAINER && FULL_SETTINGS_CONTAINER.classList.add('d-none');
      LOGS_CONTAINER && LOGS_CONTAINER.classList.add('d-none');
      REPORT_CONTAINER && REPORT_CONTAINER.classList.remove('d-none');
      REPORT_DOWNLOAD_BTN && REPORT_DOWNLOAD_BTN.classList.remove('d-none');
      break;

    case 1:
    default:
      FULL_SETTINGS_CONTAINER && FULL_SETTINGS_CONTAINER.classList.remove('d-none');
      LOGS_CONTAINER && LOGS_CONTAINER.classList.add('d-none');
      REPORT_CONTAINER && REPORT_CONTAINER.classList.add('d-none');
      break;
  }
}

function setIsLoading(status:any) {
  if (status) {
    PROGRESS_SPINNER && PROGRESS_SPINNER.classList.remove('d-none');
    START_BUTTON && START_BUTTON.setAttribute('disabled', 'true');
  } else {
    PROGRESS_SPINNER && PROGRESS_SPINNER.classList.add('d-none');
    START_BUTTON && START_BUTTON.removeAttribute('disabled');
  }
}

window.electronAPI.receive('log-update', (data) => {
  if (LOGS_TEXTAREA) {
    (LOGS_TEXTAREA as HTMLTextAreaElement).value += data;
    LOGS_TEXTAREA.scrollTop = LOGS_TEXTAREA.scrollHeight;
  }
});

window.electronAPI.receive('scan-finished', () => {
  console.log('SCAN FINISHED')
  completeProgress()
})

window.electronAPI.receive('open-report', (reportPath) => {
  if (REPORT_FRAME) {
    (REPORT_FRAME as HTMLIFrameElement).src = reportPath;
    REPORT_FRAME.style.display = 'block';
  }
});

const completeProgress = () => {
  inScan = false;
  showStep(3);
  setIsLoading(false);
  progress = 0;
}