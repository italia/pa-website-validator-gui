INPUT_URL.addEventListener('input', (e) => {
  const value = e.target.value
  if (value.length) START_BUTTON.removeAttribute('disabled');
  else START_BUTTON.setAttribute('disabled', true);
  
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

URL_FORM.addEventListener('submit', (e) => {
  e.preventDefault();
  getSettinngsFormValues();
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
