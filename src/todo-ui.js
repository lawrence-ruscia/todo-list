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

export class TaskUIHandler extends UIHandler {
  #components = {
    taskItem: new TaskItemHandler(),
    popover: new PopoverHandler(),
  };

  render() {
    this.#components.popover.render();
  }
}

class TaskItemHandler {
  render() {}
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

  #addTaskToStorage({ name, description, dueDate, priority }) {
    const task = new Task({ name, description, dueDate, priority });
    this.#todo.addTask(task);
  }

  #renderTaskItem({ name }) {
    const taskContainer = document.querySelector(".task-container");
    const taskItem = this.#createTaskItem(name);
    taskContainer.insertBefore(taskItem, taskContainer.lastElementChild);
  }

  #createTaskItem(name) {
    const taskItem = this.#domHandler.createListItem({
      classNames: ["task-item"],
    });

    const details = this.#createTaskDetails(name);
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
    const box = this.#domHandler.createSpan({ classNames: ["checkbox__box"] });
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
