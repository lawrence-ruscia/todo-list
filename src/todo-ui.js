import { TaskItemHandler } from "./task-ui";
import { PopoverHandler } from "./popover-ui";
import { ProjectItemUIHandler } from "./projects-ui";
import { Todo, Project } from "./todo";

export class TodoUIHandler {
  #components = {
    taskUI: new TaskItemHandler(),
    projectItemUI: new ProjectItemUIHandler(),
    popover: new PopoverHandler(),
    sidebarHandler: new SidebarHandler(),
    themeHandler: new ThemeHandler(),
  };

  setUpPageEventListeners() {
    this.#components.taskUI.setUpEventListeners();
    this.#components.projectItemUI.setUpEventListeners();
    this.#components.popover.setUpEventListeners();
    this.#components.sidebarHandler.setUpEventListeners();
    this.#components.themeHandler.setUpEventListeners();
  }
}

class SidebarHandler {
  #todo = new Todo();
  #projectItemUI = new ProjectItemUIHandler();

  #sidebar = document.querySelector("#sidebar");

  setUpEventListeners() {
    this.#handleMenuClick();
    this.#handleSelectedProject();
  }
  #handleMenuClick() {
    let selectedButton = null;
    this.#sidebar.addEventListener("click", (e) => {
      const button = e.target.closest(".page-button");

      if (!button || button === selectedButton) return;

      if (selectedButton) {
        selectedButton.classList.remove("sidebar__btn--selected");
      }

      button.classList.add("sidebar__btn--selected");
      selectedButton = button; // update selected button
    });
  }

  #handleSelectedProject() {
    this.#sidebar.addEventListener("click", (e) => {
      const selectedProject = e.target;

      if (selectedProject.dataset.projectId) {
        const projectId = selectedProject.dataset.projectId;
        this.#todo.setCurrentProject(projectId);
        console.log(`Clicked Project ${this.#todo.getCurrentProject().name}`);

        const currentProject = Project.fromJSON(this.#todo.getCurrentProject());

        this.#projectItemUI.renderProject(currentProject);
      }
    });
  }
}

class ThemeHandler {
  #themeBtn;
  #body;

  constructor() {
    this.#themeBtn = document.querySelector("#theme-btn");
    this.#body = document.body;
  }

  setUpEventListeners() {
    this.#loadDarkMode();

    this.#themeBtn.addEventListener("click", () => {
      this.#toggleDarkMode();
    });
  }

  #loadDarkMode() {
    const isDarkMode = localStorage.getItem("theme") === "dark";
    if (isDarkMode) {
      this.#body.classList.add("dark-mode");
    }
  }

  #toggleDarkMode() {
    const isDark = this.#body.classList.toggle("dark-mode");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }
}
