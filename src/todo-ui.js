import { TaskItemHandler } from "./task-ui";
import { PopoverHandler } from "./popover-ui";
import { ProjectItemUIHandler, ProjectsUIHandler } from "./projects-ui";
import { Todo, Project } from "./todo";

export class TodoUIHandler {
  static instance;

  #components = {
    taskUI: new TaskItemHandler(),
    projectsUIHandler: new ProjectsUIHandler(),
    projectItemUI: new ProjectItemUIHandler(),
    popover: new PopoverHandler(),
    sidebarHandler: new SidebarHandler(),
    themeHandler: new ThemeHandler(),
  };

  constructor() {
    if (!TodoUIHandler.instance) {
      return TodoUIHandler.instance;
    }

    TodoUIHandler.instance = this;
  }

  setUpEventListeners() {
    this.setUpPageEventListeners();
    this.setUpTaskEventListeners();
  }

  setUpPageEventListeners() {
    this.#components.projectsUIHandler.setUpEventListeners();
    this.#components.projectItemUI.setUpEventListeners();
    this.#components.sidebarHandler.setUpEventListeners();
    this.#components.themeHandler.setUpEventListeners();

    this.#components.popover.setUpProjectsPopoverListeners();
  }

  setUpTaskEventListeners() {
    this.#components.taskUI.setUpEventListeners();
    this.#components.popover.setUpEventListeners();
  }
}

class SidebarHandler {
  #taskListenersLoaded = false;

  #todo;

  #projects;
  #projectItemUI;
  #todoUIHandler = null;

  #sidebar;
  #content;

  constructor() {
    this.#todo = new Todo();

    this.#projects = new ProjectsUIHandler();
    this.#projectItemUI = new ProjectItemUIHandler();

    this.#sidebar = document.querySelector("#sidebar");
    this.#content = document.querySelector("#content");
  }

  setUpEventListeners() {
    this.#handleMenuClick();
    this.#handleSelectedProject();
  }

  #handleMenuClick() {
    let selectedButton = null;
    const projectsBtn = document.querySelector("#projects-btn");
    this.#sidebar.addEventListener("click", (e) => {
      const button = e.target.closest(".page-button");

      if (!button || button === selectedButton) return;

      if (button) {
        projectsBtn.classList.remove("sidebar__btn--selected");
      }

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

        const projectItemUIDiv = document.querySelector("#project");
        if (!projectItemUIDiv) {
          // If `projectItemUIDiv` is not present render a new one
          this.#renderProjectItemUIDiv();

          // Only set up task event listeners ONCE
          if (!this.#taskListenersLoaded) {
            this.#getTodoUIHandler().setUpTaskEventListeners();
            this.#taskListenersLoaded = true; // Avoid re-adding listeners
          }
        }

        this.#projectItemUI.renderProject(currentProject);
      }
    });
  }

  #getTodoUIHandler() {
    // Only create an instance when it's actually needed
    if (!this.#todoUIHandler) {
      this.#todoUIHandler = new TodoUIHandler();
    }
    return this.#todoUIHandler;
  }

  #renderProjectItemUIDiv() {
    const content = this.#content;
    content.innerHTML = "";

    const projectItemUIDiv = this.#projectItemUI.render();
    content.append(projectItemUIDiv);
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
