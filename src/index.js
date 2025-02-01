import "./style.css";
import "./normalize.css";

import { TodoUIHandler } from "./todo-ui";
import { ProjectsUIHandler } from "./projects-ui";
class PageRenderer {
  #content = document.querySelector("#content");
  #PageSections = {
    projects: new ProjectsUIHandler("My Projects").render(),
  };

  constructor() {
    // FIXME: setUppageEventlisteners tries to add listener to a page that hasn't been appended yet, resulting in a error
    const projects = this.#PageSections.projects;
    this.#appendPage(projects);

    new TodoUIHandler().setUpPageEventListeners();

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
