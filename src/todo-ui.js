import { TaskItemHandler } from "./task-ui";
import { PopoverHandler } from "./popover-ui";

export class TodoUIHandler {
  #components = {
    taskUI: new TaskItemHandler(),
    popover: new PopoverHandler(),
    sidebarHandler: new SidebarHandler(),
  };

  setUpPageEventListeners() {
    this.#components.taskUI.setUpEventListeners();
    this.#components.popover.setUpEventListeners();
    this.#components.sidebarHandler.setUpEventListeners();
  }
}

class SidebarHandler {
  #sidebar = document.querySelector("#sidebar");

  setUpEventListeners() {
    this.#handleMenuClick();
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
}
