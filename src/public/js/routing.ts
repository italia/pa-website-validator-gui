document.querySelectorAll("a[data-page]").forEach((link) => {
  link.addEventListener("click", (event) => {
    if (typeof window?.electronAPI?.send === "function") {
      event.preventDefault();

      if (event && event.target) {
        const pageName = link.getAttribute("data-page");
        const url = link.getAttribute("href");

        window.electronAPI.send("navigate", { pageName: pageName, url: url });
      }
    }
  });
});
