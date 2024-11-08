//! TODO rimuovere file?
import { ipcRenderer } from "electron";
const formSubmit: HTMLElement | null = document.getElementById("startBtn");

//form elements
const inputURL: HTMLTextAreaElement | HTMLElement | null =
  document.getElementById("inputUrl");

const logsTextArea: HTMLTextAreaElement | HTMLElement | null =
  document.getElementById("logs");
const reportFrame: HTMLIFrameElement | HTMLElement | null =
  document.getElementById("reportFrame");

let progress = 0;

function updateProgress() {
  console.log("start");
  setIsLoading(true);

  const increment = 7.3;
  const interval = 500; // 0,5 secondi in millisecondi

  const timer = setInterval(() => {
    progress += increment;

    progress = Math.min(progress, 100);

    if (progress >= 100) {
      clearInterval(timer);
      // showStep(3);
      // setIsLoading(false);
      // progress = 0;
    }
  }, interval);
}

const completeProgress = () => {
  setIsLoading(false);
  progress = 0;
};

function setIsLoading(status: boolean) {
  if (status) {
    if (formSubmit) formSubmit.setAttribute("disabled", "true");
  } else {
    if (formSubmit) formSubmit.removeAttribute("disabled");
  }
}

if (formSubmit)
  formSubmit.addEventListener("click", (data) => {
    console.log("CLICKED", data);
    let website = "";
    if (inputURL) {
      console.log("FOUND TEZTAREA", inputURL);
      website = (inputURL as HTMLTextAreaElement).value;
    }

    if (isValidURL(website)) {
      const args = {
        website,
      };
      updateProgress();
      console.log(
        "send event",
        ipcRenderer.send("database-insert", { title: website }),
      );

      ipcRenderer.send("start-node-program", args);
    } else {
      alert("Please enter a valid URL");
    }
  });

ipcRenderer.on("scan-finished", () => {
  console.log("SCAN FINISHED");
  completeProgress();
});

ipcRenderer.on("log-update", (event, data) => {
  console.log(data);
  if (logsTextArea) {
    (logsTextArea as HTMLTextAreaElement).value += data + "\n";
    logsTextArea.scrollTop = logsTextArea.scrollHeight;
  }
});

ipcRenderer.on("open-report", (event, reportPath) => {
  if (reportFrame) {
    (reportFrame as HTMLIFrameElement).src = reportPath;
    reportFrame.style.display = "block";
  }
});

function isValidURL(url: string): boolean {
  try {
    const result = new URL(url);
    return !result.hostname || !result.port;
  } catch {
    return false;
  }
}
