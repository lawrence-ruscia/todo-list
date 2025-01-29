import { TaskItemHandler } from "./task-ui";
import { PopoverHandler } from "./popover-ui";

export class TodoUIHandler {
  #components = {
    taskUI: new TaskItemHandler(),
    popover: new PopoverHandler(),
  };

  render() {
    this.#components.taskUI.render();
    this.#components.popover.render();
  }
}
