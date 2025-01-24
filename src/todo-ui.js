export class AddTaskHandler {
  renderModal() {
    const addTaskBtn = document.querySelector(".add-task__btn");
    const addTaskPopover = document.querySelector(".add-task__popover");
    const confirmTask = document.querySelector(".confirm-add-task");
    const cancelTask = document.querySelector(".cancel-add-task");

    addTaskBtn.addEventListener("click", () => {
      addTaskPopover.show();
    });

    confirmTask.addEventListener("click", (e) => {
      // TODO: add logic for sending form data
    });

    cancelTask.addEventListener("click", (e) => {
      e.preventDefault();
      addTaskPopover.close();
    });
  }
}
