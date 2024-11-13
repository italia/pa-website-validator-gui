import {
  INPUT_URL,
  START_BUTTON,
  URL_FORM,
  LOGS_TEXTAREA,
  REPORT_FRAME,
  MORE_INFO_URL,
  AUTOCOMPLETE_LIST,
  TYPE_SELECT,
  URL_FORM_PENDING,
} from "./elements.js";
import {
  getSettingsFormValues,
  getAuditsFormValues,
  getUrlInputFormValues,
} from "./settingsForm.js";

const setOption = (e: Event) => {
  if (INPUT_URL) {
    INPUT_URL.value = (e?.target as HTMLElement)?.innerText || "";
    INPUT_URL.dispatchEvent(new Event("input"));
  }
};
const setAutocompleteOptions = (opts: string[] = []) => {
  if (AUTOCOMPLETE_LIST) {
    // reset list
    AUTOCOMPLETE_LIST.innerHTML = "";

    if (opts.length > 0 && INPUT_URL?.value) {
      const filteredOptions = [...new Set(opts)].filter((opt) =>
        isValidURL(opt),
      );

      filteredOptions.forEach((opt: string) => {
        (AUTOCOMPLETE_LIST as HTMLElement).innerHTML += `
      <li class="autocomplete-option" >
       <a href="${opt}" >${opt}</a>
      </li>
      `;
      });

      document
        .querySelectorAll(".autocomplete-option")
        .forEach((opt) => opt.addEventListener("mousedown", setOption));
    }
  }
};
INPUT_URL?.addEventListener("focus", () => {
  AUTOCOMPLETE_LIST?.classList?.add("autocomplete-list-show");
});
INPUT_URL?.addEventListener("blur", () => {
  AUTOCOMPLETE_LIST?.classList?.remove("autocomplete-list-show");
});
function isValidURL(string: string) {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
}
INPUT_URL?.addEventListener("input", (e) => {
  const url = (e.target as HTMLInputElement).value;

  if (url && START_BUTTON && MORE_INFO_URL) {
    if (isValidURL(url)) {
      START_BUTTON.removeAttribute("disabled");
      MORE_INFO_URL.classList.remove("error");
      MORE_INFO_URL.innerHTML = "";
    } else {
      START_BUTTON.setAttribute("disabled", "");
      MORE_INFO_URL.classList.add("error");
      MORE_INFO_URL.innerHTML = "L’URL inserito non è valido. Assicurati che sia nel formato corretto, ad esempio: https://xyz.it.";
    }
  } else if (MORE_INFO_URL) {
    MORE_INFO_URL.classList.remove("error");
    MORE_INFO_URL.innerHTML = "";
  }

  if (typeof window.electronAPI?.send === "function")
    window.electronAPI.send("start-type", url);
});

window.electronAPI?.receive("update-autocomplete-list", (urls: string[]) => {
  setAutocompleteOptions(urls);
});

/* SCAN WEBSITE FLOW START */
URL_FORM?.addEventListener("submit", (e) => {
  e.preventDefault();
  const settingsFormValues = getSettingsFormValues();
  const auditsFormValues = getAuditsFormValues();
  const { website, type } = getUrlInputFormValues() as {
    website: string;
    type: string;
  };

  console.log("start");
  document.querySelector<HTMLAnchorElement>('[data-page="scanning"]')?.click();

  console.log("type", type);
  console.log("website", website);
  console.log("SETTINGS VALUES", settingsFormValues);
  console.log("AUDITS VALUES", auditsFormValues);

  const args = {
    type,
    website,
    ...settingsFormValues,
    audits: auditsFormValues,
  };

  if (typeof window.electronAPI?.send === "function") {
    window.electronAPI.send("start-node-program", args);
  } else {
    setTimeout(() => {
      //? TODO remove browser
      console.log("SCAN FINISHED");
      completeProgress("a");
    }, 3000);
  }
});

window.electronAPI?.receive("input-form-update", (data) => {
  if (TYPE_SELECT) {
    TYPE_SELECT.value = data.type;
    TYPE_SELECT.setAttribute("disabled", "");
  }
  if (INPUT_URL) {
    INPUT_URL.value = data.website;
    INPUT_URL.setAttribute("readonly", "");
  }
});

window.electronAPI?.receive("log-update", (data) => {
  if (LOGS_TEXTAREA) {
    (LOGS_TEXTAREA as HTMLTextAreaElement).value += data;
    LOGS_TEXTAREA.scrollTop = LOGS_TEXTAREA.scrollHeight;
  }
});
/* SCAN WEBSITE FLOW END */

/* REPORT PAGE START */
window.electronAPI?.receive("scan-finished", (id) => {
  console.log("ricevo");
  setTimeout(() => {
    //! TODO remove timeout
    console.log("SCAN FINISHED", id);
    completeProgress(id);
  }, 3000);
});

window.electronAPI?.receive("open-report", (reportPath) => {
  if (REPORT_FRAME) {
    (REPORT_FRAME as HTMLIFrameElement).src = reportPath;
    REPORT_FRAME.style.display = "block";
  }
});

URL_FORM_PENDING?.addEventListener("submit", (e) => {
  e.preventDefault();
  window.electronAPI.send("kill-process", {
    id: document.querySelector("#stop-process")?.getAttribute("data-item-id"),
  });
});

const completeProgress = (id: string) => {
  // workaround to navigate programmatically
  const reportLink: HTMLAnchorElement | null =
    document.querySelector<HTMLAnchorElement>('[data-page="report"]');
  if (reportLink) {
    reportLink.href = reportLink.href + `?id=${id}`;
    console.log(reportLink.href);
  }
  document.querySelector<HTMLAnchorElement>('[data-page="report"]')?.click();
};
/* REPORT PAGE START */
