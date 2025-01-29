import "./style.css";
import "./normalize.css";

import { TodoUIHandler } from "./todo-ui";
import { ProjectsUIHandler } from "./projects-ui";
class PageRenderer {
  #main = document.querySelector("#main");
  #sidebar = document.querySelector("#sidebar");
  #PageSections = {
    todo: new TodoUIHandler(),
    projects: new ProjectsUIHandler(),
  };

  constructor() {
    this.#PageSections.todo.render();

    // this.#setUpEventListeners();
  }

  #setUpEventListeners() {
    const sidebar = this.#sidebar;

    sidebar.addEventListener("click", (e) => {
      const page = e.target;

      if (page.dataset.button) {
        const pageKey = page.dataset.button;
        const page = this.#PageSections[pageKey];

        if (page) {
          this.#clearPage();
          this.#appendPage(page);

          window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        }
      }
    });
  }

  #appendPage(page) {
    this.#main.appendChild(page);
  }

  #clearPage() {
    this.#main.innerHTML = "";
  }
}

new PageRenderer();
