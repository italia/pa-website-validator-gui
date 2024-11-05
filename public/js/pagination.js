const pagination = document.getElementById('pagination');
const prev = pagination.querySelector('.page-item:first-of-type .page-link');
const next = pagination.querySelector('.page-item:last-of-type .page-link');
const currentPage = pagination.querySelector('.page-item [aria-current="page"]');
const currentPageValue = Number(currentPage.dataset.currentPage);

prev?.addEventListener('click', (e) => {
  e.preventDefault();
  console.log(`Go to page: ${currentPageValue - 1}`);
  //TODO
});

next?.addEventListener('click', (e) => {
  e.preventDefault();
  console.log(`Go to page: ${currentPageValue + 1}`);
  //TODO
});
