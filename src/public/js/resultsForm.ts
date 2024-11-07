import {AUDITS_REDO_BTN, AUDITS_REDO_FORM, REPORT_FRAME} from "./elements.js";
import {Item} from "../../entities/Item";

const AUDITS_REDO_NAME = 'audits';

const getCheckedIds = (name: string) => {
  const checkboxes = Array.from(document.querySelectorAll(
    `input[name="${name}"]:checked`
  ));

  const checkedIds = checkboxes.reduce((acc: any, cur:any) => {
    return [...acc, cur.id];
  }, []);

  return checkedIds;
};

AUDITS_REDO_BTN?.addEventListener('click', () => {
    document.querySelector<HTMLAnchorElement>('[data-page="scanning"]')?.click();

  window.electronAPI.send('recover-report', AUDITS_REDO_FORM?.getAttribute('data-report-id'));
});

window.electronAPI?.receive('return-report-item', (item : Item) => {

 const args = {
    type: item.type === 'Comune' ? 'municipality' : 'school',
   website: item.url,
   accuracy: item.accuracy,
   scope: item.scope,
   timeout: item.timeout,
   concurrentPages: item.concurrentPages,
     audits: getCheckedIds(AUDITS_REDO_NAME)
 }

  window.electronAPI.send('start-node-program', args);
});


