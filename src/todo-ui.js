import { Task, Todo } from "./todo";
import { DOMHandler } from "./dom-handler";
import editIcon from "./assets/icons/edit-icon.svg";

// Abstract class
class UIHandler {
  constructor() {
    if (new.target === UIHandler) {
      throw new Error("Cannot instantiate an abstract class directly.");
    }
  }

  // Abstract method
  render() {
    throw new Error("`render()` method must be implemented by subclass.");
  }
}

export class TodoUIHandler extends UIHandler {
  #components = {
    taskItem: new TaskItemHandler(),
    popover: new PopoverHandler(),
  };

  render() {
    this.#components.taskItem.render();
    this.#components.popover.render();
  }
}

class TaskItemHandler {
  #DOMElements = {
    taskContainer: document.querySelector(".task-container"),
    modal: document.querySelector(".task-item__modal"),
    itemForm: document.querySelector("#item-form"),
    todo: new Todo(),
  };

  render() {
    this.#handleItemClick();
    this.#handleModal();
    this.#renderItemDetails();
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
        e.preventDefault();
        const button = e.target;

        if (button.classList.contains("item-form__cancel")) {
          actions.style.display = "none";
          text.classList.remove("item-form__text--focus");
        }

        if (button.classList.contains("item-form__save")) {
          // TODO: Create logic for modifying/editing tasks
        }
      });
    })();
  }

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
        const titleInput = document.querySelector(".item-form__title");
        const descriptionInput = document.querySelector(
          ".item-form__description"
        );
        const dueDateInput = document.querySelector(".item-form__date");
        const priorityInput = document.querySelector(".item-form__priority");

        titleInput.value = task.name;
        descriptionInput.value = task.description;
        dueDateInput.value = task.dueDate;
        priorityInput.value = task.priority;

        this.#handleDeleteClick(task);
      }
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

class PopoverHandler extends UIHandler {
  #DOMElements = {
    taskPopover: document.querySelector(".add-task__popover"),
    taskForm: document.querySelector("#add-task__form"),
    taskFormTitle: document.querySelector(".task-form__title"),
    addTaskBtn: document.querySelector(".add-task__btn"),
    confirmAddTaskBtn: document.querySelector(".confirm-add-task"),
    cancelTaskBtn: document.querySelector(".cancel-add-task"),
  };

  #domHandler;
  #todo;

  constructor() {
    super();
    this.#domHandler = new DOMHandler();
    this.#todo = new Todo();
  }

  render() {
    this.#renderTasks();
    this.#handleTaskPopover();
    this.#handleTaskForm();
    this.#handleTaskButtons();
    this.#handleInvalidInputs();
  }

  #handleTaskForm() {
    this.#DOMElements.taskForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.querySelector(".task-form__title").value;
      const description = document.querySelector(
        ".task-form__description"
      ).value;
      const dueDate = document.querySelector(".task-form__date").value;
      const priority = document.querySelector(".task-form__priority").value;

      const task = new Task({ name, description, dueDate, priority });
      this.#addTaskToStorage(task);
      this.#renderTaskItem(task);

      this.#DOMElements.taskPopover.close();
    });

    // Handle Enter keypress
    this.#DOMElements.taskForm.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        this.#DOMElements.taskForm.requestSubmit();
      }
    });
  }

  #handleTaskPopover() {
    this.#DOMElements.taskPopover.addEventListener("close", () => {
      this.#DOMElements.taskForm.reset();
    });
  }

  #handleTaskButtons() {
    this.#DOMElements.addTaskBtn.addEventListener("click", () => {
      this.#validateInput();
      this.#DOMElements.taskPopover.show();
    });

    this.#DOMElements.cancelTaskBtn.addEventListener("click", (e) => {
      e.preventDefault();
      this.#DOMElements.taskPopover.close();
    });
  }

  #handleInvalidInputs() {
    this.#DOMElements.taskFormTitle.addEventListener("input", () => {
      this.#DOMElements.confirmAddTaskBtn.disabled =
        !this.#DOMElements.taskFormTitle.checkValidity();
    });
  }

  // HACK: Duplicate code with the handleInvalidInputs, provide a better solution
  #validateInput() {
    this.#DOMElements.confirmAddTaskBtn.disabled =
      !this.#DOMElements.taskFormTitle.checkValidity();
  }

  #renderTasks() {
    const tasks = this.#todo.getAllTasksInOrder();
    console.log(tasks);

    tasks.forEach((task) => {
      this.#renderTaskItem(task);
      console.log(`Rendered task: ${task.name}`);
    });
  }

  #addTaskToStorage(task) {
    this.#todo.addTask(task);
  }

  #renderTaskItem(task) {
    const taskContainer = document.querySelector(".task-container");
    const taskItem = this.#createTaskItem(task);
    taskContainer.insertBefore(taskItem, taskContainer.lastElementChild);
  }

  deleteTaskItem(taskId) {
    const taskItems = document.querySelectorAll(".task-item");

    taskItems.forEach((taskItem) => {
      if (taskItem.dataset.taskId === taskId) {
        taskItem.remove();
      }
    });
  }

  #createTaskItem(task) {
    const taskItem = this.#domHandler.createListItem({
      classNames: ["task-item"],
    });

    // Assign data attr for later retrieval
    taskItem.dataset.taskId = task.id;

    const details = this.#createTaskDetails(task.name);
    const options = this.#createTaskOptions();

    taskItem.append(details, options);

    return taskItem;
  }

  #createTaskDetails(name) {
    const details = this.#domHandler.createDiv({
      classNames: ["task__details"],
    });
    const label = this.#domHandler.createLabel({
      classNames: ["task-checkbox"],
    });
    const input = this.#domHandler.createInput({
      type: "checkbox",
      classNames: ["checkbox__input"],
    });
    const box = this.#domHandler.createSpan({
      classNames: ["checkbox__box", "task-checkbox__box"],
    });
    const title = this.#domHandler.createPara({
      textContent: name,
      classNames: ["task__title"],
    });

    label.append(input, box);
    details.append(label, title);

    return details;
  }

  #createTaskOptions() {
    const options = this.#domHandler.createDiv({
      classNames: ["task__options"],
    });

    const editButton = this.#domHandler.createButton({
      classNames: ["task__edit"],
    });
    const icon = this.#domHandler.createImg({
      src: editIcon,
      classNames: ["task-btn-img", "btn-icon"],
    });

    editButton.append(icon);
    options.append(editButton);

    return options;
  }
}
