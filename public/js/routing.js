const { ipcRenderer: renderer } = require('electron');

document.querySelectorAll('a[data-page]').forEach(link => {
    link.addEventListener('click', event => {        
        event.preventDefault();
        const pageName = event.target.getAttribute('data-page');
        renderer.send('navigate', pageName);
    });
});