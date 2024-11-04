let progress = 0;
function updateProgress() {
  showStep(2);
  setIsLoading(true);

  const increment = 7.3;
  const interval = 500; // 0,5 secondi in millisecondi

  const timer = setInterval(() => {
    progress += increment;

    progress = Math.min(progress, 100);

    if (PERCENTAGE && PROGRESS_BAR) {
      const rounded = Math.round(progress);
      PERCENTAGE.innerHTML = rounded;
      PROGRESS_BAR.style.width = `${rounded}%`;
      PROGRESS_BAR.setAttribute('aria-valuenow', rounded);
    }

    if (progress >= 100) {
      clearInterval(timer);
      showStep(3);
      setIsLoading(false);
      progress = 0;
    }
  }, interval);
}

function isValidURL(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

const options = [
  { text: 'www.comune.errato.it', link: '#' },
  { text: 'http://www.comune.it', link: '#' },
  { text: 'https://scuola.esempio.it', link: '#' },
];
const setOption = (e) => {
  INPUT_URL.value = e.target.innerText || '';
  INPUT_URL.dispatchEvent(new Event('input'));
};
const setAutocompleteOptions = (opts = []) => {
  // reset list
  AUTOCOMPLETE_LIST.innerHTML = '';

  if (options.length > 0) {
    opts.forEach((opt) => {
      AUTOCOMPLETE_LIST.innerHTML += `
      <li class="autocomplete-option" >
       <a href="${opt.link}" >${opt.text}</a>
      </li>
      `;
    });

    document
      .querySelectorAll('.autocomplete-option')
      .forEach((opt) => opt.addEventListener('mousedown', setOption));
  } else {
  }
};
INPUT_URL?.addEventListener('focus', (e) => {
  AUTOCOMPLETE_LIST.classList.add('autocomplete-list-show');
});
INPUT_URL?.addEventListener('blur', (e) => {
  AUTOCOMPLETE_LIST.classList.remove('autocomplete-list-show');
});

INPUT_URL?.addEventListener('input', (e) => {
  const url = e.target.value;
  if (url) {
    if (isValidURL(url)) {
      START_BUTTON.removeAttribute('disabled');
      MORE_INFO_URL.classList.remove('error');
      MORE_INFO_URL.innerHTML = '';
    } else {
      START_BUTTON.setAttribute('disabled', true);
      MORE_INFO_URL.classList.add('error');
      MORE_INFO_URL.innerHTML = "L'url inserito non è valido";
    }

    setAutocompleteOptions(options);
  } else {
    MORE_INFO_URL.classList.remove('error');
    MORE_INFO_URL.innerHTML = '';
    setAutocompleteOptions([]);
  }
});

URL_FORM?.addEventListener('change', (e) => {
  getUrlInputFormValues();
})

URL_FORM?.addEventListener('submit', (e) => {
  e.preventDefault();
  getSettingsFormValues();
  getAuditsFormValues();
  updateProgress();
});

function showStep(step) {
  switch (step) {
    case 2:
      FULL_SETTINGS_CONTAINER.classList.add('d-none');
      LOGS_CONTAINER.classList.remove('d-none');
      REPORT_CONTAINER.classList.add('d-none');
      break;
    case 3:
      FULL_SETTINGS_CONTAINER.classList.add('d-none');
      LOGS_CONTAINER.classList.add('d-none');
      REPORT_CONTAINER.classList.remove('d-none');
      REPORT_DOWNLOAD_BTN.classList.remove('d-none');
      buildAuditsRedoForm();
      break;

    case 1:
    default:
      FULL_SETTINGS_CONTAINER.classList.remove('d-none');
      LOGS_CONTAINER.classList.add('d-none');
      REPORT_CONTAINER.classList.add('d-none');
      break;
  }
}

function setIsLoading(status) {
  if (status) {
    PROGRESS_SPINNER.classList.remove('d-none');
    START_BUTTON.setAttribute('disabled', true);
  } else {
    PROGRESS_SPINNER.classList.add('d-none');
    START_BUTTON.removeAttribute('disabled');
  }
}

export {}
