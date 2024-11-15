import { LOGS_TEXTAREA } from "./elements.js";

if (LOGS_TEXTAREA) {
  setTextareaHeight();

  window.addEventListener("resize", setTextareaHeight);

  function setTextareaHeight() {
    if (LOGS_TEXTAREA) {
      const elDistanceFromTop = LOGS_TEXTAREA.getBoundingClientRect().top;

      const footerSpacer = document.querySelector(
        ".footer-spacer",
      ) as HTMLDivElement;
      const footerSpacerHeight = footerSpacer?.offsetHeight ?? 0;

      const footerHeight = document.querySelector("footer")?.offsetHeight ?? 0;

      const occupiedHeight =
        elDistanceFromTop + footerSpacerHeight + footerHeight;

      LOGS_TEXTAREA.style.height = `calc(100vh - ${occupiedHeight}px)`;
    }
  }
}
