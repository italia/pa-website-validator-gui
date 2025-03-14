// URL SEARCH BAR
export const URL_FORM: HTMLFormElement | null =
  document.querySelector("form#urlForm");
export const URL_FORM_PENDING: HTMLFormElement | null = document.querySelector(
  "form#urlFormPending",
);
export const TYPE_SELECT: HTMLSelectElement | null =
  document.querySelector("select#type-select");
export const INPUT_URL = document.querySelector<HTMLInputElement>("#inputUrl");
export const AUTOCOMPLETE_LIST = URL_FORM?.querySelector(".autocomplete-list");
export const START_BUTTON = document.getElementById("startBtn");

// STEP 1
export const FULL_SETTINGS_CONTAINER = document.getElementById(
  "full-settings-container",
);
export const SETTINGS_FORM: HTMLFormElement | null =
  document.querySelector("form#settingsForm");
export const AUDITS_FORM: HTMLFormElement | null =
  document.querySelector("form#auditsForm");

// STEP 2
export const LOGS_CONTAINER = document.getElementById("logs-container");
export const LOGS_TEXTAREA = document.getElementById("logs");

// STEP 3
export const REPORT_CONTAINER = document.getElementById("report-container");
export const REPORT_FRAME = document.getElementById("reportFrame");
export const REPORT_DOWNLOAD_BTN = document.getElementById("reportDownloadBtn");
export const AUDITS_REDO_FORM = document.getElementById("auditsRedoForm");
export const AUDITS_REDO_BTN = document.getElementById("auditsRedoBtn");

// HISTORY PAGE
export const HISTORY_TABLE = document.getElementById(
  "history-table",
) as HTMLDivElement;
