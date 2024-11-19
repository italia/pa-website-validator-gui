function checkAllSetup(wrapperId: string) {
  const wrapper = document.getElementById(wrapperId);
  if (!wrapper) return;

  const checkAll = wrapper.querySelector(
    'input[type="checkbox"]',
  ) as HTMLInputElement;
  const checkboxes = wrapper.querySelectorAll(
    'input[type="checkbox"]',
  ) as NodeListOf<HTMLInputElement>;
  const cbs = Array.from(checkboxes).slice(1);

  function setCheckAll() {
    const checkedCount = cbs.filter((checkbox) => checkbox.checked).length;
    checkAll.checked = checkedCount === cbs.length;
    checkAll.indeterminate = checkedCount > 0 && checkedCount < cbs.length;
    checkAll.classList.toggle("semi-checked", checkAll.indeterminate);
  }

  if (checkAll) setCheckAll();

  checkAll?.addEventListener("change", () => {
    cbs.forEach((checkbox) => (checkbox.checked = checkAll.checked));
    setCheckAll();
  });

  cbs.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      setCheckAll();
    });
  });
}

checkAllSetup("auditsForm");
checkAllSetup("auditsRedoForm");
