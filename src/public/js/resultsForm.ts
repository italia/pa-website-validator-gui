import { AUDITS_REDO_BTN, AUDITS_REDO_FORM } from "./elements.js";
import { Item } from "../../entities/Item";

const AUDITS_REDO_NAME = "audits";

const getCheckedIds = (name: string) => {
  const checkboxes: NodeListOf<HTMLElement> = document.querySelectorAll(
    `input[name="${name}"]:checked`,
  );

  return Array.from(checkboxes).reduce((acc: string[], cur: HTMLElement) => {
    return [...acc, cur.id];
  }, []);
};

AUDITS_REDO_BTN?.addEventListener("click", () => {
  window.electronAPI.send(
    "recover-report",
    AUDITS_REDO_FORM?.getAttribute("data-report-id"),
  );
});

window.electronAPI?.receive("return-report-item", (item: Item) => {
  const args = {
    type: item.type === "Comune" ? "municipality" : "school",
    website: item.url,
    accuracy: item.accuracy,
    scope: item.scope,
    timeout: item.timeout,
    concurrentPages: item.concurrentPages,
    audits: getCheckedIds(AUDITS_REDO_NAME),
  };

  document
    .querySelector<HTMLAnchorElement>('[data-page="scanning"]')
    ?.setAttribute("data-url", item.url);
  document
    .querySelector<HTMLAnchorElement>('[data-page="scanning"]')
    ?.setAttribute("data-url-type", item.type);
  document
    .querySelector<HTMLAnchorElement>('[data-page="scanning"]')
    ?.setAttribute("data-url-accuracy", item.accuracy);
  document
    .querySelector<HTMLAnchorElement>('[data-page="scanning"]')
    ?.setAttribute("data-url-timeout", item.timeout.toString());
  document
    .querySelector<HTMLAnchorElement>('[data-page="scanning"]')
    ?.setAttribute("data-url-pages", item.concurrentPages.toString());
  document.querySelector<HTMLAnchorElement>('[data-page="scanning"]')?.click();

  window.electronAPI.send("start-node-program", args);
});
