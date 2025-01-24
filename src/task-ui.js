class AddTaskHandler {
  renderModal() {
    const addTaskBtn = document.querySelector(".add-task__btn");
    const addTaskModal = document.querySelector(".add-task-modal");

    addTaskBtn.addEventListener("click", () => {
      addTaskBtn.open();
    });
  }
}
