import {
  INPUT_URL,
  START_BUTTON,
  URL_FORM,
  FULL_SETTINGS_CONTAINER,
  LOGS_CONTAINER,
  REPORT_CONTAINER,
  REPORT_DOWNLOAD_BTN,
  LOGS_TEXTAREA,
  REPORT_FRAME,
  MORE_INFO_URL,
  AUTOCOMPLETE_LIST,
} from './elements.js';
import { getSettingsFormValues, getAuditsFormValues, getUrlInputFormValues } from './settingsForm.js';

/* INPUT & AUTOCOMPLETE LOGICS START */
interface OptionI {
  text: string;
  link: string;
}
const options: OptionI[] = [
  { text: 'www.comune.errato.it', link: '#' },
  { text: 'http://www.comune.it', link: '#' },
  { text: 'https://scuola.esempio.it', link: '#' },
];
const setOption = (e: any) => {
  if (INPUT_URL) {
    INPUT_URL.value = e?.target?.innerText || '';
    INPUT_URL.dispatchEvent(new Event('input'));
  }
};
const setAutocompleteOptions = (opts: OptionI[] = []) => {
  if (AUTOCOMPLETE_LIST) {
    // reset list
    AUTOCOMPLETE_LIST.innerHTML = '';

    if (options.length > 0) {
      opts.forEach((opt: OptionI) => {
        (AUTOCOMPLETE_LIST as any).innerHTML += `
      <li class="autocomplete-option" >
       <a href="${opt.link}" >${opt.text}</a>
      </li>
      `;
      });

      document
        .querySelectorAll('.autocomplete-option')
        .forEach((opt) => opt.addEventListener('mousedown', setOption));
    }
  }
};
INPUT_URL?.addEventListener('focus', (e) => {
  AUTOCOMPLETE_LIST?.classList?.add('autocomplete-list-show');
});
INPUT_URL?.addEventListener('blur', (e) => {
  AUTOCOMPLETE_LIST?.classList?.remove('autocomplete-list-show');
});
function isValidURL(string: string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}
INPUT_URL?.addEventListener('input', (e: any) => {
  const url = e.target.value;
  if (url && START_BUTTON && MORE_INFO_URL) {
    if (isValidURL(url)) {
      START_BUTTON.removeAttribute('disabled');
      MORE_INFO_URL.classList.remove('error');
      MORE_INFO_URL.innerHTML = '';
    } else {
      START_BUTTON.setAttribute('disabled', '');
      MORE_INFO_URL.classList.add('error');
      MORE_INFO_URL.innerHTML = "L'url inserito non è valido";
    }

    setAutocompleteOptions(options);
  } else if (MORE_INFO_URL) {
    MORE_INFO_URL.classList.remove('error');
    MORE_INFO_URL.innerHTML = '';
    setAutocompleteOptions([]);
  }
});
/* INPUT & AUTOCOMPLETE LOGICS END */

let inScan = true;

/* SCAN WEBSITE FLOW START */
URL_FORM?.addEventListener('submit', (e) => {
  e.preventDefault();
  const settingsFormValues: any = getSettingsFormValues();
  const auditsFormValues: any = getAuditsFormValues();
  const {website, type}: any = getUrlInputFormValues();  

  console.log('start');
  showStep(2);
  setIsLoading(true);

  console.log('type', type);
  console.log('website', website);
  console.log('SETTINGS VALUES', settingsFormValues);
  console.log('AUDITS VALUES', auditsFormValues);

  const args = {
    type,
    website,
    settingsFormValues,
    audits: auditsFormValues,
  };

  if (typeof window.electronAPI?.send === "function")
    window.electronAPI.send('start-node-program', args);
  else {
    setTimeout(() => { 
      //? TODO remove browser 
      console.log('SCAN FINISHED');
      completeProgress();
    }, 3000);
  } 
});

function showStep(step: number) {
  switch (step) {
    case 2:
      FULL_SETTINGS_CONTAINER &&
        FULL_SETTINGS_CONTAINER.classList.add('d-none');
      LOGS_CONTAINER && LOGS_CONTAINER.classList.remove('d-none');
      REPORT_CONTAINER && REPORT_CONTAINER.classList.add('d-none');
      break;
    case 3:
      FULL_SETTINGS_CONTAINER &&
        FULL_SETTINGS_CONTAINER.classList.add('d-none');
      LOGS_CONTAINER && LOGS_CONTAINER.classList.add('d-none');
      REPORT_CONTAINER && REPORT_CONTAINER.classList.remove('d-none');
      REPORT_DOWNLOAD_BTN && REPORT_DOWNLOAD_BTN.classList.remove('d-none');
      break;

    case 1:
    default:
      FULL_SETTINGS_CONTAINER &&
        FULL_SETTINGS_CONTAINER.classList.remove('d-none');
      LOGS_CONTAINER && LOGS_CONTAINER.classList.add('d-none');
      REPORT_CONTAINER && REPORT_CONTAINER.classList.add('d-none');
      break;
  }
}

function setIsLoading(status: any) {
  if (status) {
    START_BUTTON && START_BUTTON.setAttribute('disabled', 'true');
  } else {
    START_BUTTON && START_BUTTON.removeAttribute('disabled');
  }
}

window.electronAPI?.receive('start-node-program', (event, data) => {
    console.log('SCAN FINISHED');
    completeProgress();
  });

window.electronAPI?.receive('log-update', (data) => {
  if (LOGS_TEXTAREA) {
    (LOGS_TEXTAREA as HTMLTextAreaElement).value += data;
    LOGS_TEXTAREA.scrollTop = LOGS_TEXTAREA.scrollHeight;
  }
});
/* SCAN WEBSITE FLOW END */

/* REPORT PAGE START */
window.electronAPI?.receive('scan-finished', () => {
  setTimeout(() => { //! TODO remove timeout
    console.log('SCAN FINISHED');
    completeProgress();
  }, 3000);
});

window.electronAPI?.receive('open-report', (reportPath) => {
  // TODO popolare pagina report correttamente
  if (REPORT_FRAME) {
    (REPORT_FRAME as HTMLIFrameElement).src = reportPath;
    REPORT_FRAME.style.display = 'block';
  }
});

const completeProgress = () => {
  inScan = false;
  // workaround to navigate programmatically
  document.querySelector<HTMLAnchorElement>('[data-page="report"]')?.click();
  setIsLoading(false);
};
/* REPORT PAGE START */
