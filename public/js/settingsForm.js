const getSettinngsFormValues = () => {
  const formData = new FormData(SETTINGS_FORM);
  const formObject = Object.fromEntries(formData.entries());
  console.log('settings', formObject);
  return formObject;
}
const getAuditsFormValues = () => {
  // Seleziona tutte le checkbox con il nome "options"
  const checkboxes = AUDITS_FORM.querySelectorAll(
    'input[name="audits"]:checked'
  );
  const finalAudits = [];
  checkboxes.forEach((checkbox) => {
    finalAudits.push(checkbox.id)
  });
  console.log("audits",finalAudits);
  return finalAudits;
}

//! TODO capire se stare in ascolto sui singoli input (--> eliminare submit)
//! o se lasciare form submit (--> eliminare eventListener)
SETTINGS_FORM?.addEventListener('input', () => {
  getAuditsFromSettings();
})

const audits = [];
const getAuditsFromSettings = (e) => {
  e?.preventDefault();
  const settings = getSettinngsFormValues();
  // get Audits according to selected settings
  fetch('https://jsonplaceholder.typicode.com/todos')
    .then((response) => response.json())
    .then((json) => {
      audits.splice(0, audits.length);      
      audits.push(...json.splice(Math.round(Math.random() * 100), settings.concurrentPages));
      // console.log('audits', audits);

      if (AUDITS_FORM) {
        AUDITS_FORM.innerHTML = '';
        audits.forEach((audit, i) => {
          AUDITS_FORM.innerHTML += `
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
getAuditsFromSettings();
