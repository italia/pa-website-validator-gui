const urlForm = document.getElementById('urlForm');
const inputUrl = document.getElementById('inputUrl');
const formSubmitBtn = document.getElementById('startBtn');
const alertContainer = document.getElementById('settings-container');
const logsContainer = document.getElementById('logs-container');
const reportContainer = document.getElementById('report-container');
const progressSpinner = document.getElementById('progress-spinner');

const progressBar = logsContainer.querySelector('.progress-bar');
const percentage = logsContainer.querySelector('#progress-percentage');

inputUrl.addEventListener('input', (e) => {
  const value = e.target.value
  if (value.length) formSubmitBtn.removeAttribute('disabled');
  else formSubmitBtn.setAttribute('disabled', true);
  
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

    if (percentage && progressBar) {
      const rounded = Math.round(progress);
      percentage.innerHTML = rounded;
      progressBar.style.width = `${rounded}%`;
      progressBar.setAttribute('aria-valuenow', rounded);
    }

    if (progress >= 100) {
      clearInterval(timer);
      showStep(3);
      setIsLoading(false);
      progress = 0;
    }
  }, interval);
}

urlForm.addEventListener('submit', (e) => {
  e.preventDefault();
  getSettinngsFormValues();
  getAuditsFormValues();
  updateProgress();
});

function showStep(step) {
  switch (step) {
    case 2:
      alertContainer.classList.add('d-none');
      logsContainer.classList.remove('d-none');
      reportContainer.classList.add('d-none');
      break;
    case 3:
      alertContainer.classList.add('d-none');
      logsContainer.classList.add('d-none');
      reportContainer.classList.remove('d-none');
      break;

    case 1:
    default:
      alertContainer.classList.remove('d-none');
      logsContainer.classList.add('d-none');
      reportContainer.classList.add('d-none');
      break;
  }
}

function setIsLoading(status) {
  if (status) {
    progressSpinner.classList.remove('d-none');
    formSubmitBtn.setAttribute('disabled', true);
  } else {
    progressSpinner.classList.add('d-none');
    formSubmitBtn.removeAttribute('disabled');
  }
}
