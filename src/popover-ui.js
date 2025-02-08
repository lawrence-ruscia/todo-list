import { Todo, Task, Project } from "./todo";
import { DOMHandler } from "./dom-handler";
import { ProjectItemUIHandler } from "./projects-ui";
import { TaskItemHandler } from "./task-ui";

export class PopoverHandler {
  #DOMElements = {
    taskPopover: document.querySelector(".add-task__popover"),
    taskForm: document.querySelector("#add-task__form"),
    taskFormTitle: document.querySelector(".task-form__title"),
    taskContainer: document.querySelector(".task-container"),
    addTaskBtn: document.querySelector(".add-task__btn"),
    confirmAddTaskBtn: document.querySelector(".confirm-add-task"),
    cancelTaskBtn: document.querySelector(".cancel-add-task"),

    addProjectBtn: document.querySelector(".projects__add"),
    projectsModal: document.querySelector(".projects-modal"),
    projectsForm: document.querySelector("#projects-form"),
    projectName: document.querySelector(".project-name"),
    projectsClose: document.querySelector(".projects__close-btn"),
    projectsCancel: document.querySelector(".projects__cancel"),
    projectsAdd: document.querySelector(".projects__add-btn"),
  };

  #domHandler;
  #todo;
  #taskItemHandler;

  constructor() {
    this.#domHandler = new DOMHandler();
    this.#todo = new Todo();
    this.#taskItemHandler = new TaskItemHandler();
  }

  setUpEventListeners() {
    this.#handleTaskPopover();
    this.#handleTaskForm();
    this.#handleProjectsForm();
    this.#handleTaskButtons();
    this.#handleInvalidInputs();

    this.#handleProjectsPopover();
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
      this.#taskItemHandler.renderTaskItem(task);

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

  #handleProjectsForm() {
    this.#DOMElements.projectsForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const projectName = this.#DOMElements.projectName.value;

      const project = new Project({ name: projectName });
      const projectItemUI = new ProjectItemUIHandler();
      this.#addProjectToStorage(project);
      projectItemUI.renderProjectItem(project);
      this.#DOMElements.projectsModal.close();
    });

    this.#DOMElements.projectsForm.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        this.#DOMElements.projectsForm.requestSubmit();
      }
    });
  }
  #handleTaskPopover() {
    this.#DOMElements.taskPopover.addEventListener("close", () => {
      this.#DOMElements.taskForm.reset();
    });
  }

  #handleProjectsPopover() {
    this.#DOMElements.addProjectBtn.addEventListener("click", () => {
      this.#DOMElements.projectsModal.showModal();
    });

    this.#DOMElements.projectsClose.addEventListener("click", () => {
      this.#DOMElements.projectsModal.close();
    });

    this.#DOMElements.projectsModal.addEventListener("close", () => {
      this.#DOMElements.projectsForm.reset();
    });

    this.#DOMElements.projectsCancel.addEventListener("click", () => {
      this.#DOMElements.projectsModal.close();
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

    this.#DOMElements.projectName.addEventListener("input", () => {
      this.#DOMElements.projectsAdd.disabled =
        !this.#DOMElements.projectName.checkValidity();
    });
  }

  // HACK: Duplicate code with the handleInvalidInputs, provide a better solution
  #validateInput() {
    this.#DOMElements.confirmAddTaskBtn.disabled =
      !this.#DOMElements.taskFormTitle.checkValidity();

    this.#DOMElements.projectsAdd.disabled =
      !this.#DOMElements.projectName.checkValidity();
  }

  #addTaskToStorage(task) {
    this.#todo.addTask(task);
  }

  #addProjectToStorage(project) {
    this.#todo.createProject(project);
  }
}
