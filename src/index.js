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
    const projectItem = this.#PageSections.projectItem;
    this.#appendPage(projectItem);

    const todoUIHandler = new TodoUIHandler();
    todoUIHandler.setUpEventListeners();

    this.#setUpEventListeners();
  }

  #setUpEventListeners() {
    const sidebar = document.querySelector("#sidebar");

    sidebar.addEventListener("click", (e) => {
      const page = e.target;

      if (page.dataset.button) {
        const pageKey = page.dataset.button;
        const selectedPage = this.#PageSections[pageKey];
        console.log(selectedPage);

        if (selectedPage) {
          console.log("Projects clicked");
          this.#clearPage();
          this.#appendPage(selectedPage);

          window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        }
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
