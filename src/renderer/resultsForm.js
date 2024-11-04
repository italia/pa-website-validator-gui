const AUDITS_REDO_NAME = 'audits-redo';

const getCheckedIds = (name) => {
  const checkboxes = Array.from(document.querySelectorAll(
    `input[name="${name}"]:checked`
  ));

  const checkedIds = checkboxes.reduce((acc, cur) => {
    return [...acc, cur.id];
  }, []);

  console.log("checkedIds:", checkedIds);
  return checkedIds;
};

AUDITS_REDO_BTN?.addEventListener('click', () => {
  getCheckedIds(AUDITS_REDO_NAME); //TODO
});

const buildAuditsRedoForm = () => {
  const failedAudits = [];

  fetch('https://jsonplaceholder.typicode.com/todos') //TODO
    .then((response) => response.json())
    .then((json) => {
      failedAudits.push(...json.splice(0, 4)); //TODO

      if (AUDITS_REDO_FORM) {
        AUDITS_REDO_FORM.innerHTML = '';
        failedAudits.forEach(({ id, title }, i) => {
          AUDITS_REDO_FORM.innerHTML += `
            <div class="form-check">
              <input class="form-check-input" id="${AUDITS_REDO_NAME}-${id}" type="checkbox" name="${AUDITS_REDO_NAME}" checked>
              <label class="form-check-label" for="${AUDITS_REDO_NAME}-${id}">${title}</label>
            </div>
          `;
        });
      }
    });
};


