import { TaskItemHandler } from "./task-ui";
import { PopoverHandler } from "./popover-ui";
import { ProjectsUIHandler } from "./projects-ui";
import { Todo, Project } from "./todo";

export class TodoUIHandler {
  #components = {
    taskUI: new TaskItemHandler(),
    projectUI: new ProjectsUIHandler(),
    popover: new PopoverHandler(),
    sidebarHandler: new SidebarHandler(),
  };

  setUpPageEventListeners() {
    this.#components.taskUI.setUpEventListeners();
    this.#components.projectUI.setUpEventListeners();
    this.#components.popover.setUpEventListeners();
    this.#components.sidebarHandler.setUpEventListeners();
  }
}

class SidebarHandler {
  #todo = new Todo();
  #projectUI = new ProjectsUIHandler();

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

        this.#projectUI.renderProject(currentProject);
      }
    });
  }
}
