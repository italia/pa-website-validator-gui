import {
  INPUT_URL,
  START_BUTTON,
  PERCENTAGE,
  PROGRESS_BAR,
  PROGRESS_SPINNER,
  URL_FORM,
  FULL_SETTINGS_CONTAINER,
  LOGS_CONTAINER,
  REPORT_CONTAINER,
  REPORT_DOWNLOAD_BTN,
  AUTOCOMPLETE_LIST,
  MORE_INFO_URL,
} from './elements.js';
import {
  getSettingsFormValues,
  getAuditsFormValues,
  getUrlInputFormValues,
} from './settingsForm.js';

INPUT_URL?.addEventListener('input', (e) => {
  if (!START_BUTTON) return;

  //@ts-ignore
  const value = e.target.value;
  if (value.length) START_BUTTON.removeAttribute('disabled');
  else START_BUTTON.setAttribute('disabled', 'true');
});

let progress = 0;
function updateProgress() {
  showStep(2);
  console.log('start');
  setIsLoading(true);

  const increment = 7.3;
  const interval = 500; // 0,5 secondi in millisecondi

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
      setIsLoading(false);
      progress = 0;
      //showStep(3);
      // workaround to navigate programmatically
      (document.querySelector('[data-page="report"]') as HTMLAnchorElement)?.click();
    }
  }, interval);
}

function isValidURL(string: string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

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

URL_FORM?.addEventListener('submit', (e) => {
  e.preventDefault();
  getUrlInputFormValues();
  getSettingsFormValues();
  getAuditsFormValues();
  updateProgress();
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
    PROGRESS_SPINNER && PROGRESS_SPINNER.classList.remove('d-none');
    START_BUTTON && START_BUTTON.setAttribute('disabled', 'true');
  } else {
    PROGRESS_SPINNER && PROGRESS_SPINNER.classList.add('d-none');
    START_BUTTON && START_BUTTON.removeAttribute('disabled');
  }
}
