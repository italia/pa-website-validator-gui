import {
  SETTINGS_FORM,
  AUDITS_FORM,
  URL_FORM,
  TYPE_SELECT,
} from "./elements.js";
import {
  municipalityAudits,
  schoolAudits,
} from "../../storage/auditMapping.js";

export const getUrlInputFormValues = () => {
  if (URL_FORM) {
    const formData = new FormData(URL_FORM);
    const formObject = Object.fromEntries(formData.entries());
    formObject.type = TYPE_SELECT?.value || "";
    return formObject;
  }
};
export const getSettingsFormValues = () => {
  if (SETTINGS_FORM) {
    const formData = new FormData(SETTINGS_FORM);
    const formObject = Object.fromEntries(formData.entries());
    return formObject;
  }
};
export const getAuditsFormValues = () => {
  // Seleziona tutte le checkbox con il nome "options"
  const checkboxes = AUDITS_FORM?.querySelectorAll(
    'input[name="audits"]:checked',
  );
  const finalAudits: string[] = [];
  checkboxes?.forEach((checkbox) => {
    finalAudits.push(checkbox.id);
  });
  return finalAudits;
};

TYPE_SELECT?.addEventListener("change", () => {
  getAuditsFromSettings();
});

const getAuditsFromSettings = (e?: Event) => {
  e?.preventDefault();
  const type = TYPE_SELECT?.value;
  let audits: {
    title: string;
    code: string;
    id: string;
    innerId: string;
    weight: number;
  }[] = [];
  if (type == "municipality") {
    audits = municipalityAudits;
  } else {
    audits = schoolAudits;
  }

  if (AUDITS_FORM) {
    AUDITS_FORM.innerHTML = "";
    audits.forEach((audit) => {
      if (audit.code.length > 0) {
        (AUDITS_FORM as HTMLElement).innerHTML += `
        <div class="form-check">
          <input class="form-check-input" id="${audit.id}" type="checkbox" name="audits" checked>
          <label class="form-check-label" for="${audit.id}">${audit.code.toUpperCase() + " - " + audit.title.toUpperCase()}</label>
        </div>
      `;
      }
    });
  }
};
