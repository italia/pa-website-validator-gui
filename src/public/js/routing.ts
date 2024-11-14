document.querySelectorAll("a[data-page]").forEach((link) => {
  link.addEventListener("click", (event) => {
    if (typeof window?.electronAPI?.send === "function") {
      event.preventDefault();

      if (event && event.target) {
        const pageName = link.getAttribute("data-page");
        const url = link.getAttribute("href");
        const websiteType = link.getAttribute("data-url-type");
        const website = link.getAttribute("data-url");
        const accuracy = link.getAttribute("data-url-accuracy");
        const timeout = link.getAttribute("data-url-timeout");
        const pages = link.getAttribute("data-url-pages");

        window.electronAPI.send("navigate", { pageName: pageName, url: url, scanningWebsite: website, scanningWebsiteType: websiteType, accuracy: accuracy, timeout: timeout, pages: pages });
      }
    }
  });
});
