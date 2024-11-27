const MODAL_CONFIRM_DELETE = document.getElementById("modal-confirm-delete");
const MCD_AUTOFOCUS_TARGET = document.getElementById("mcd-cancel");

MODAL_CONFIRM_DELETE?.addEventListener("shown.bs.modal", () => {
  MCD_AUTOFOCUS_TARGET?.focus();
});
