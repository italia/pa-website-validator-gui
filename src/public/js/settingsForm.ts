import {
  SETTINGS_FORM,
  AUDITS_FORM,
  URL_FORM,
  TYPE_SELECT,
} from "./elements.js";

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
  // Seleziona tutte le checkbox con il nome "audits" filtrate per type
  const type = TYPE_SELECT?.value;
  const checkboxes = AUDITS_FORM?.querySelectorAll(
    `#${type}Audits input[name="audits"]:checked`,
  );

  const finalAudits: string[] = [];
  checkboxes?.forEach((checkbox) => {
    finalAudits.push(checkbox.id);
  });

  return finalAudits;
};
