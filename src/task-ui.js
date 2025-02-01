import { PopoverHandler } from "./popover-ui";
import { Todo, Task } from "./todo";
export class TaskItemHandler {
  #DOMElements = {
    taskContainer: document.querySelector(".task-container"),
    modal: document.querySelector(".task-item__modal"),
    modalDetails: document.querySelector(".modal__details"),
    itemForm: document.querySelector("#item-form"),
    titleInput: document.querySelector(".item-form__title"),
    descriptionInput: document.querySelector(".item-form__description"),
    dueDateInput: document.querySelector(".item-form__date"),
    priorityInput: document.querySelector(".item-form__priority"),

    todo: new Todo(),
  };

  setUpEventListeners() {
    this.#handleItemClick();
    this.#handleModal();
    this.#renderItemDetails();
    this.#handleSaveClick();
  }

  #handleItemClick() {
    const taskContainer = this.#DOMElements.taskContainer;
    const modal = this.#DOMElements.modal;

    taskContainer.addEventListener("click", (e) => {
      const taskItem = e.target;
      if (taskItem.classList.contains("task-item")) {
        modal.showModal();
      }
    });
  }

  #handleModal() {
    // Handle close btn click
    const handleCloseBtn = (() => {
      document
        .querySelector(".modal__close-btn")
        .addEventListener("click", () => {
          this.#DOMElements.modal.close();
        });
    })();

    const handleFormDetailActions = (() => {
      const form = this.#DOMElements.itemForm;
      const actions = document.querySelector(".item-form__actions");
      const text = document.querySelector(".item-form__text");

      form.addEventListener("focusin", (e) => {
        const input = e.target;
        if (input.tagName === "INPUT") {
          actions.style.display = "flex";
          text.classList.add("item-form__text--focus");
        }
      });

      form.addEventListener("click", (e) => {
        const button = e.target;

        if (button.classList.contains("item-form__cancel")) {
          actions.style.display = "none";
          text.classList.remove("item-form__text--focus");
        }
      });
    })();
  }

  // TODO: Render checkbox data if the task is already done
  #renderItemDetails() {
    const container = this.#DOMElements.taskContainer;
    container.addEventListener("click", (e) => {
      const taskItem = e.target;

      // Determine which task item div was clicked
      if (taskItem.classList.contains("task-item")) {
        // Get task ID and retrieve task obj
        const taskId = taskItem.dataset.taskId;
        console.log(`Task selected: ${taskId}`);
        const task = this.#DOMElements.todo.getTask(taskId);

        // Render task data on input fields
        const titleInput = this.#DOMElements.titleInput;
        const descriptionInput = this.#DOMElements.descriptionInput;
        const dueDateInput = this.#DOMElements.dueDateInput;
        const priorityInput = this.#DOMElements.priorityInput;

        titleInput.value = task.name;
        descriptionInput.value = task.description;
        dueDateInput.value = task.dueDate;
        priorityInput.value = task.priority;

        this.#handleDeleteClick(task);

        // Store task ID in the form's dataset to identify task
        this.#DOMElements.itemForm.dataset.taskId = taskId;
      }
    });
  }

  #handleSaveClick() {
    const todo = this.#DOMElements.todo;
    const popover = new PopoverHandler();

    const form = this.#DOMElements.itemForm;

    form.addEventListener("submit", (e) => {
      // Retrieve task ID from the form's dataset
      const taskId = form.dataset.taskId;

      // Get updated input values
      const titleInput = this.#DOMElements.titleInput;
      const descriptionInput = this.#DOMElements.descriptionInput;
      const dueDateInput = this.#DOMElements.dueDateInput;
      const priorityInput = this.#DOMElements.priorityInput;

      const updatedTask = new Task({
        name: titleInput.value,
        description: descriptionInput.value,
        dueDate: dueDateInput.value,
        priority: priorityInput.value,
      });

      // Update task in localStorage
      todo.editTask(taskId, updatedTask);

      // Update task details in the DOM
      popover.updateTaskItem(taskId, updatedTask);
      console.log(`Task ${taskId} has been updated.`);
    });
  }

  #handleDeleteClick(task) {
    const deleteBtn = document.querySelector(".options__delete");
    const todo = this.#DOMElements.todo;
    const popover = new PopoverHandler();

    const newDeleteBtn = deleteBtn.cloneNode(true);
    deleteBtn.parentNode.replaceChild(newDeleteBtn, deleteBtn);

    newDeleteBtn.addEventListener("click", (e) => {
      // Delete from DOM
      popover.deleteTaskItem(task.id);

      // Delete from localStorage
      todo.deleteTask(task);

      this.#DOMElements.modal.close();
    });
  }
}
