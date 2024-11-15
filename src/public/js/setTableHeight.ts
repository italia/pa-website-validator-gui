const table = document.querySelector(".table-wrapper") as HTMLDivElement;

if (table) {
  setTextareaHeight();

  window.addEventListener("resize", setTextareaHeight);

  function setTextareaHeight() {
    if (table) {
      const elDistanceFromTop = table.getBoundingClientRect().top;

      const pagination = document.querySelector(
        ".pagination-wrapper",
      ) as HTMLDivElement;
      const paginationHeight = pagination?.offsetHeight ?? 0;

      const footerSpacer = document.querySelector(
        ".footer-spacer",
      ) as HTMLDivElement;
      const footerSpacerHeight = footerSpacer?.offsetHeight ?? 0;

      const footerHeight = document.querySelector("footer")?.offsetHeight ?? 0;

      const occupiedHeight =
        elDistanceFromTop +
        paginationHeight +
        footerSpacerHeight +
        footerHeight;

      table.style.height = `calc(100vh - ${occupiedHeight}px)`;
    }
  }
}
