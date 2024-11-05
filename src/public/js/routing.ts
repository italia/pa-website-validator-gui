document.querySelectorAll('a[data-page]').forEach(link => {
    link.addEventListener('click', event => {        
        event.preventDefault();
        
        if (event && event.target) {
            //@ts-ignore
            const pageName = event.target.getAttribute('data-page');
            window.electronAPI.send('navigate', pageName);
        }
    });
});
