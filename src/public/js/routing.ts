document.querySelectorAll('a[data-page]').forEach((link) => {
    console.log(link, link.getAttribute('href'), link.getAttribute('data-page'))
    link.addEventListener('click', (event) => {
        if (typeof window?.electronAPI?.send === "function") {
            event.preventDefault();

            if (event && event.target) {
                //@ts-ignore
                const pageName = event.target.getAttribute('data-page');
                //@ts-ignore
                const url = event.target.getAttribute('href');

                window.electronAPI.send('navigate', {pageName: pageName, url: url});
            }
        }
    });
});
