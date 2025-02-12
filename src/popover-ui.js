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

  #todo;
  #taskItemHandler;

  constructor() {
    this.#todo = new Todo();
    this.#taskItemHandler = new TaskItemHandler();
  }

  setUpEventListeners() {
    this.#handleTaskPopover();
    this.#handleTaskForm();
    this.#handleTaskButtons();
    this.#validateTaskTitle();
  }

  #handleTaskForm() {
    this.#DOMElements.taskForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // reset checkbox value
      document.querySelector(".checkbox__input").checked = false;

      const name = document.querySelector(".task-form__title").value;
      const description = document.querySelector(
        ".task-form__description"
      ).value;
      const dueDate = document.querySelector(".task-form__date").value;
      const priority = document.querySelector(".task-form__priority").value;
      const isCompleted = document.querySelector(".checkbox__input").checked;

      const task = new Task({
        name,
        description,
        dueDate,
        priority,
        isCompleted,
      });

      this.#todo.addTask(task);
      this.#taskItemHandler.renderTaskItem(task);
      this.#taskItemHandler.renderTasks();

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
      this.#todo.createProject(project);
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

  setUpProjectsPopoverListeners() {
    this.#DOMElements.projectsClose.addEventListener("click", () => {
      this.#DOMElements.projectsModal.close();
    });

    this.#DOMElements.projectsModal.addEventListener("close", () => {
      this.#DOMElements.projectsForm.reset();
    });

    this.#handleProjectsForm();
    this.#handleProjectButtons();
    this.#validateProjectName();
  }

  #handleTaskButtons() {
    this.#DOMElements.addTaskBtn.addEventListener("click", () => {
      this.#toggleConfirmAddTaskBtn();
      this.#DOMElements.taskPopover.show();
    });

    this.#DOMElements.cancelTaskBtn.addEventListener("click", (e) => {
      e.preventDefault();
      this.#DOMElements.taskPopover.close();
    });
  }

  #handleProjectButtons() {
    this.#DOMElements.projectsCancel.addEventListener("click", () => {
      this.#DOMElements.projectsModal.close();
    });
    this.#DOMElements.addProjectBtn.addEventListener("click", () => {
      this.#DOMElements.projectsModal.showModal();
    });
  }

  #validateTaskTitle() {
    this.#DOMElements.taskFormTitle.addEventListener("input", () => {
      this.#toggleConfirmAddTaskBtn();
    });
  }

  #validateProjectName() {
    this.#DOMElements.projectName.addEventListener("input", () => {
      this.#toggleProjectsAddBtn();
    });
  }

  #toggleConfirmAddTaskBtn() {
    this.#DOMElements.confirmAddTaskBtn.disabled =
      !this.#DOMElements.taskFormTitle.checkValidity();
  }

  #toggleProjectsAddBtn() {
    this.#DOMElements.projectsAdd.disabled =
      !this.#DOMElements.projectName.checkValidity();
  }
}
