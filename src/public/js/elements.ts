// URL SEARCH BAR
const URL_FORM = document.getElementById('urlForm');
const INPUT_URL = document.getElementById('inputUrl');
const START_BUTTON = document.getElementById('startBtn');
const PROGRESS_SPINNER = document.getElementById('progress-spinner');

// STEP 1
const FULL_SETTINGS_CONTAINER = document.getElementById('full-settings-container');
const SETTINGS_FORM: HTMLElement | HTMLFormElement | null = document.getElementById('settingsForm');
const AUDITS_FORM = document.getElementById('auditsForm');

// STEP 2
const LOGS_CONTAINER = document.getElementById('logs-container');
const PROGRESS_BAR = LOGS_CONTAINER?.querySelector('.progress-bar');
const PERCENTAGE = LOGS_CONTAINER?.querySelector('#progress-percentage');
const LOGS_TEXTAREA: HTMLTextAreaElement | HTMLElement | null = document.getElementById('logs');

// STEP 3
const REPORT_CONTAINER = document.getElementById('report-container');
const REPORT_FRAME = document.getElementById('reportFrame');
const REPORT_DOWNLOAD_BTN = document.getElementById('reportDownloadBtn');

export { 
  URL_FORM, 
  INPUT_URL, 
  START_BUTTON, 
  PROGRESS_SPINNER,
  
  FULL_SETTINGS_CONTAINER, 
  SETTINGS_FORM, 
  AUDITS_FORM,
  
  LOGS_CONTAINER, 
  PROGRESS_BAR, 
  PERCENTAGE, 
  LOGS_TEXTAREA,
  
  REPORT_CONTAINER, 
  REPORT_FRAME, 
  REPORT_DOWNLOAD_BTN
};
