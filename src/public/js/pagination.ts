const pagination = document.getElementById('pagination');
if (pagination) {
const prev = pagination.querySelector('.page-item:first-of-type .page-link') as HTMLAnchorElement;
const next = pagination.querySelector('.page-item:last-of-type .page-link') as HTMLAnchorElement;

prev?.addEventListener('click', (e) => {
  e.preventDefault();
  prev?.click()
});

next?.addEventListener('click', (e) => {
  e.preventDefault();
  next?.click();
});

}
