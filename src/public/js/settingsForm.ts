import { AuditI } from "../../types/audits";
import {SETTINGS_FORM, AUDITS_FORM, URL_FORM, TYPE_SELECT } from './elements.js';

export const getUrlInputFormValues = () => {
  if (URL_FORM) {
    const formData = new FormData(URL_FORM);
    const formObject = Object.fromEntries(formData.entries());
    formObject.type = TYPE_SELECT?.value || '';
    return formObject;
  }
}
export const getSettingsFormValues = () => {
  if (SETTINGS_FORM) {
  const formData = new FormData(SETTINGS_FORM);
  const formObject = Object.fromEntries(formData.entries());
  return formObject;
  }
}
export const getAuditsFormValues = () => {
  // Seleziona tutte le checkbox con il nome "options"
  const checkboxes = AUDITS_FORM?.querySelectorAll(
    'input[name="audits"]:checked'
  );
  const finalAudits:string[] = [];
  checkboxes?.forEach((checkbox) => {
    finalAudits.push(checkbox.id)
  });
  return finalAudits;
}

TYPE_SELECT?.addEventListener('change', () => {
  getAuditsFromSettings();
})

const audits:AuditI[] = [];
const getAuditsFromSettings = (e?:Event) => {
  e?.preventDefault();
  const type = TYPE_SELECT?.value;
  if (type) {
  // get Audits according to selected settings
  fetch('https://jsonplaceholder.typicode.com/todos')
    .then((response) => response.json())
    .then((json) => {
      audits.splice(0, audits.length);
      audits.push(...json.splice(Math.round(Math.random() * 100), 10));

      if (AUDITS_FORM) {
        AUDITS_FORM.innerHTML = '';
        audits.forEach((audit, i) => {
          (AUDITS_FORM as any).innerHTML += `
            <div class="form-check">
              <input class="form-check-input" id="audit-${audit.id}" type="checkbox" name="audits" checked>
              <label class="form-check-label" for="audit-${audit.id}">${audit.title}</label>
            </div>
          `;
        });
      }
    }); 
  } else (AUDITS_FORM as any).innerHTML = '<p>Devi prima selezionare una tipologia di scansione (scuola/comune).</p>';
};

