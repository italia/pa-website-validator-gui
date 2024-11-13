document.querySelector('[data-deselect-all]')?.addEventListener('click', (e) => {
    e.preventDefault();

    document.querySelectorAll('input[name="audits"]').forEach((item) => {
        item.removeAttribute('checked');
        (item as HTMLInputElement).checked = false;
    })
})