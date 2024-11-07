document.querySelectorAll('button[data-download]').forEach((button) => {
    button.addEventListener('click', (event) => {
        if (typeof window?.electronAPI?.send === "function") {
            event.preventDefault();

            if (event && event.target) {
                //@ts-ignore
                const reportId = button.getAttribute('data-download');

                window.electronAPI.send('download-report', {reportId});
            }
        }
    });
});
