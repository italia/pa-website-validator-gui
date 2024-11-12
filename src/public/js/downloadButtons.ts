document.querySelectorAll("button[data-download]").forEach((button) => {
  button.addEventListener("click", (event) => {
    if (typeof window?.electronAPI?.send === "function") {
      event.preventDefault();

      if (event && event.target) {
        const reportId = button.getAttribute("data-download");
        window.electronAPI.send("download-report", { reportId });
      }
    }
  });
});


document.querySelectorAll("button[data-open-report]").forEach((button) => {
  button.addEventListener("click", (event) => {
    if (typeof window?.electronAPI?.send === "function") {  
      // send request to main process
      if (event && event.target) {
        const reportId = (button as HTMLAnchorElement).getAttribute("data-open-report");
        window.electronAPI.send("get-report-path", { reportId });
      }
    }
  });
});

// get new href from main process 
window.electronAPI.receive("open-html-report", (filePath) => { 
  window.open(filePath, "_blank", "width=1200,height=800"); 
});
