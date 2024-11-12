document.querySelectorAll("button[data-delete]").forEach((button) => {
  button.addEventListener("click", () => {
    const reportId = button.getAttribute("data-delete");
    document
      .querySelector("#delete-record")
      ?.setAttribute("data-delete-id", reportId ?? "");
  });
});

document.querySelector("#delete-record")?.addEventListener("click", () => {
  const reportId = document
    .querySelector("#delete-record")
    ?.getAttribute("data-delete-id");
  window.electronAPI.send("delete-record", { reportId: reportId });
});
