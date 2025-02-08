import "./style.css";
import "./normalize.css";

import { TodoUIHandler } from "./todo-ui";
import { ProjectItemUIHandler, ProjectsUIHandler } from "./projects-ui";
class PageRenderer {
  #content = document.querySelector("#content");
  #PageSections = {
    projects: new ProjectsUIHandler().render(),
    projectItem: new ProjectItemUIHandler("My Projects").render(),
  };

  constructor() {
    const projects = this.#PageSections.projects;
    this.#appendPage(projects);
    document.dispatchEvent(new CustomEvent("ProjectUIUpdated"));

    const todo = new TodoUIHandler();
    todo.setUpPageEventListeners();

    this.#setUpEventListeners();
  }

  #setUpEventListeners() {
    const sidebar = document.querySelector("#sidebar");

    sidebar.addEventListener("click", (e) => {
      const page = e.target;

      if (page.dataset.button) {
        const pageKey = page.dataset.button;
        const selectedPage = this.#PageSections[pageKey];

        if (selectedPage) {
          this.#clearPage();
          this.#appendPage(selectedPage);

          window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        }

        if (pageKey === "projects")
          document.dispatchEvent(new CustomEvent("ProjectUIUpdated"));
      }
    });
  }

  #appendPage(page) {
    this.#content.append(page);
  }

  #clearPage() {
    this.#content.innerHTML = "";
  }
}

new PageRenderer();
