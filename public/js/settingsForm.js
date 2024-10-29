const settingsForm = document.getElementById('settingsForm');
const auditsForm = document.getElementById('auditsForm');

const getSettinngsFormValues = () => {
  const formData = new FormData(settingsForm);
  const formObject = Object.fromEntries(formData.entries());
  console.log('settings', formObject);
  return formObject;
}
const getAuditsFormValues = () => {
  // Seleziona tutte le checkbox con il nome "options"
  const checkboxes = auditsForm.querySelectorAll(
    'input[name="audits"]:checked'
  );
  const finalAudits = [];
  checkboxes.forEach((checkbox) => {
    finalAudits.push(checkbox.id)
  });
  console.log("audits",finalAudits);
  return finalAudits;
}

const submitForm = (e) => {
  e?.preventDefault();
  
  const settings = getSettinngsFormValues();
  getAuditsFromSettings(settings);
};
const audits = [];
const getAuditsFromSettings = (form) => {
  // get Audits according to selected settings
  fetch('https://jsonplaceholder.typicode.com/todos')
    .then((response) => response.json())
    .then((json) => {
      audits.splice(0, audits.length);      
      audits.push(...json.splice(Math.round(Math.random() * 100), form.concurrentPages));
      // console.log('audits', audits);

      if (auditsForm) {
        auditsForm.innerHTML = '';
        audits.forEach((audit, i) => {
          auditsForm.innerHTML += `
<fieldset>
  <div class="form-check form-check-inline">
    <input id="audit-${audit.id}" type="checkbox" name="audits" checked>
    <label for="audit-${audit.id}">${audit.title}</label>
  </div>
</fieldset>
          `;
        });
      }
    });
};

// first submit with default settings
submitForm();
