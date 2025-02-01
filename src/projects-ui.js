import { DOMHandler } from "./dom-handler";
export class ProjectsUIHandler {
  #domHandler = new DOMHandler();
  #DOMElements;

  #title;

  constructor(title) {
    this.#title = title;

    this.#DOMElements = {
      projects: this.#domHandler.createDiv({ id: "project" }),
      title: this.#createProjectTitle(),
      addTask: this.#createAddTask(),
      taskContainer: this.#createTaskContainer(),
    };
  }

  get title() {
    return this.#title;
  }

  render() {
    const {
      projects: projects,
      title,
      addTask,
      taskContainer,
    } = this.#DOMElements;
    projects.append(title, taskContainer);

    return projects;
  }

  #createProjectTitle() {
    const container = this.#domHandler.createDiv({
      classNames: ["project-title"],
    });
    const input = this.#domHandler.createInput({
      type: "text",
      id: "myTodo",
      classNames: ["title-input"],
      name: "myTodo",
      value: this.title,
      required: true,
    });

    container.append(input);

    return container;
  }

  #createTaskContainer() {
    const ul = this.#domHandler.createList({
      listType: "ul",
      classNames: ["task-container"],
    });

    const addTask = this.#createAddTask();
    ul.append(addTask);
    return ul;
  }

  #createAddTask() {
    const container = this.#domHandler.createDiv({ classNames: ["add-task"] });
    const button = this.#createAddTaskBtn();
    const dialog = this.#createTaskPopover();

    container.append(button, dialog);

    return container;
  }

  #createAddTaskBtn() {
    const button = this.#domHandler.createButton({
      classNames: ["add-task__btn"],
    });

    const text = this.#domHandler.createPara({
      textContent: "Add task",
      classNames: ["add-task__text"],
    });

    const icon = this.#createAddTaskIcon();

    button.append(icon, text);
    return button;
  }

  #createTaskPopover() {
    const dialog = document.createElement("dialog");
    dialog.className = "add-task__popover";
    dialog.appendChild(this.#createTaskForm());

    return dialog;
  }

  #createTaskForm() {
    const form = document.createElement("form");
    form.method = "dialog";
    form.id = "add-task__form";

    const formContent = document.createElement("div");
    formContent.classList.add("task-form__content");

    // Task Text Inputs
    const textContainer = document.createElement("div");
    textContainer.classList.add("task-form__text");

    const titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.classList.add("task-form__title");
    titleInput.placeholder = "Title";
    titleInput.name = "title";
    titleInput.required = true;
    titleInput.autocomplete = "off";

    const descriptionInput = document.createElement("input");
    descriptionInput.type = "text";
    descriptionInput.classList.add("task-form__description");
    descriptionInput.placeholder = "Description";
    descriptionInput.name = "description";
    descriptionInput.autocomplete = "off";

    textContainer.append(titleInput, descriptionInput);

    // Task Select Inputs
    const selectContainer = document.createElement("div");
    selectContainer.classList.add("task-form__select");

    const dateInput = document.createElement("input");
    dateInput.type = "date";
    dateInput.classList.add("task-form__date");
    dateInput.name = "date";

    const prioritySelect = document.createElement("select");
    prioritySelect.name = "priority";
    prioritySelect.id = "priority";
    prioritySelect.classList.add("task-form__priority");

    const priorities = ["P1", "P2", "P3", "P4"];
    priorities.forEach((priority, index) => {
      const option = document.createElement("option");
      option.value = priority;
      option.textContent = `Priority ${index + 1}`;
      if (priority === "P4") option.selected = true;
      prioritySelect.appendChild(option);
    });

    selectContainer.append(dateInput, prioritySelect);
    formContent.append(textContainer, selectContainer);

    // Form Footer with Buttons
    const formFooter = document.createElement("div");
    formFooter.classList.add("task-form__footer");

    const optionsContainer = document.createElement("div");
    optionsContainer.classList.add("task-form__options");

    const cancelButton = document.createElement("button");
    cancelButton.classList.add("filled-button", "cancel-add-task");
    cancelButton.textContent = "Cancel";

    const confirmButton = document.createElement("button");
    confirmButton.classList.add("cta-button", "confirm-add-task");
    confirmButton.textContent = "Add task";

    optionsContainer.append(cancelButton, confirmButton);
    formFooter.appendChild(optionsContainer);

    form.append(formContent, formFooter);
    return form;
  }

  #createAddTaskIcon() {
    const svgNS = "http://www.w3.org/2000/svg";

    // Create <svg> element
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("class", "add-task-icon");
    svg.setAttribute("width", "24px");
    svg.setAttribute("height", "24px");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "#de4c4a");
    svg.setAttribute("xmlns", svgNS);

    // Create <g> elements
    const g1 = document.createElementNS(svgNS, "g");
    g1.setAttribute("id", "SVGRepo_bgCarrier");
    g1.setAttribute("stroke-width", "0");

    const g2 = document.createElementNS(svgNS, "g");
    g2.setAttribute("id", "SVGRepo_tracerCarrier");
    g2.setAttribute("stroke-linecap", "round");
    g2.setAttribute("stroke-linejoin", "round");

    const g3 = document.createElementNS(svgNS, "g");
    g3.setAttribute("id", "SVGRepo_iconCarrier");

    // Create <path> elements
    const path1 = document.createElementNS(svgNS, "path");
    path1.setAttribute("d", "M6 12h6V6h1v6h6v1h-6v6h-1v-6H6z");

    const path2 = document.createElementNS(svgNS, "path");
    path2.setAttribute("fill", "none");
    path2.setAttribute("d", "M0 0h24v24H0z");

    // Append paths to <g>, then <g> to <svg>
    g3.appendChild(path1);
    g3.appendChild(path2);

    svg.appendChild(g1);
    svg.appendChild(g2);
    svg.appendChild(g3);

    return svg;
  }
}
