import { HISTORY_TABLE, LOGS_TEXTAREA } from "./elements.js";

if (LOGS_TEXTAREA) {
  setElHeight(LOGS_TEXTAREA);
  window.addEventListener("resize", () => setElHeight(LOGS_TEXTAREA));
}

if (HISTORY_TABLE) {
  setElHeight(HISTORY_TABLE);
  window.addEventListener("resize", () => setElHeight(HISTORY_TABLE));
}

function setElHeight(el: HTMLElement | null) {
  if (!el) return;

  /* Preemptively set it exceedingly high otherwise on landing it wouldn't adapt */
  el.style.height = "100vh";

  const elDistanceFromTop = el.getBoundingClientRect().top;
  const pageHeight = document.body.scrollHeight;
  const elDistanceFromBottom = pageHeight - el.getBoundingClientRect().bottom;

  const occupiedHeight = elDistanceFromTop + elDistanceFromBottom;
  el.style.height = `calc(100vh - ${occupiedHeight}px)`;
}
