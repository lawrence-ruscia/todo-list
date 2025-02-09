import { DOMHandler } from "./dom-handler";
import { PopoverHandler } from "./popover-ui";
import { Todo, Task, Project } from "./todo";
import { TodoUIHandler } from "./todo-ui";
import hashIcon from "./assets/icons/hash-icon.svg";
import { TaskItemHandler } from "./task-ui";

export class ProjectsUIHandler {
  #domHandler = new DOMHandler();
  #DOMElements;
  #title;
  #todo;

  #projectItemUI;
  #content;

  constructor() {
    this.#title = "My Projects";
    this.#todo = new Todo();
    this.#DOMElements = {
      projects: this.#domHandler.createDiv({ id: "projects" }),
      title: this.#createProjectTitle(),
      myProjects: this.#createMyProjects(),
      list: document.querySelector(".my-projects__list"),

      modal: document.querySelector("#myProjects-modal"),
      form: document.querySelector("#myProjects-form"),
      name: document.querySelector("#myProjectName"),
      body: document.body,
    };
    this.#projectItemUI = new ProjectItemUIHandler();
    this.#content = document.querySelector("#content");
  }

  setUpEventListeners() {
    this.#handleProjectCount();
    this.renderProjectList();
    this.#handleMyProjectsModal();
    this.#renderProjectDetailsOnModal();
    this.#handleFormSubmit();
  }

  #handleProjectCount() {
    document.addEventListener("ProjectUIUpdated", (e) => {
      const count = document.querySelector(".my-projects__project-count");
      const totalProjects = this.#todo.getAllProjectsInOrder().length;

      count.textContent =
        totalProjects === 1
          ? `${totalProjects} project`
          : `${totalProjects} projects`;
    });
  }

  #handleMyProjectsModal() {
    this.#DOMElements.body.addEventListener("click", (e) => {
      console.log("list item clicked");
      const target = e.target;

      if (
        target.dataset.projectId &&
        target.classList.contains("my-projects__item")
      ) {
        document.dispatchEvent(
          new CustomEvent("myProjectsModalLoaded", {
            detail: target.dataset.projectId,
          })
        );
        this.#DOMElements.modal.showModal();
      }

      const closeBtn = target.closest(".modal__close-btn");

      if (target.classList.contains("myProjects__cancel") || closeBtn) {
        this.#DOMElements.modal.close();
      }
    });
  }

  #renderProjectDetailsOnModal() {
    document.addEventListener("myProjectsModalLoaded", (e) => {
      const nameInput = this.#DOMElements.name;
      const projectId = e.detail;
      const project = this.#todo.getProject(projectId);

      nameInput.value = project.name;
      this.#DOMElements.modal.dataset.projectId = projectId;
    });
  }

  #handleFormSubmit() {
    this.#DOMElements.body.addEventListener("submit", (e) => {
      e.preventDefault();
      const updatedProjectName = this.#DOMElements.name.value;
      const projectId = this.#DOMElements.modal.dataset.projectId;

      if (projectId) {
        const updatedProject = new Project({ name: updatedProjectName });
        // Update project on todo
        this.#todo.updateProjectName(projectId, updatedProject);

        // Notify projectList and myProjectList to update their projects list
        document.dispatchEvent(new CustomEvent("ProjectUIUpdated"));
        this.#projectItemUI.renderProjects();

        console.log("Project updated!");
        this.#DOMElements.modal.close();
      }
    });
  }

  render() {
    const { projects, title, myProjects } = this.#DOMElements;
    projects.append(title, myProjects);

    return projects;
  }

  renderProjectList() {
    document.addEventListener("ProjectUIUpdated", () => {
      const list = document.querySelector(".my-projects__list");
      list.innerHTML = ""; // clear list first

      const projects = this.#todo.getAllProjectsInOrder();
      projects.forEach((proj) => {
        const projectItem = this.#createProjectItem(proj);
        list.append(projectItem);
      });
    });
  }

  #createProjectTitle() {
    const container = this.#domHandler.createDiv({
      classNames: ["project-title"],
    });

    const input = this.#domHandler.createInput({
      type: "text",
      id: "myProjects__title",
      classNames: ["title-input"],
      name: "myProject",
      value: this.#title,
      readOnly: true,
    });

    container.append(input);

    return container;
  }

  #createMyProjects() {
    const container = this.#domHandler.createDiv({
      classNames: ["my-projects"],
    });

    const projectCount = this.#domHandler.createPara({
      textContent: "0 projects",
      classNames: ["my-projects__project-count"],
    });
    const projectList = this.#createProjectList();

    container.append(projectCount, projectList);

    return container;
  }

  #createProjectList() {
    const list = this.#domHandler.createList({
      listType: "ul",
      classNames: ["my-projects__list"],
    });

    return list;
  }

  #createProjectItem(project) {
    if (!project)
      throw new Error(`Invalid project ${JSON.stringify(project)}.`);

    const li = this.#domHandler.createListItem({
      classNames: ["my-projects__item"],
    });
    li.dataset.projectId = project.id;

    const img = this.#domHandler.createImg({
      src: hashIcon,
      classNames: ["project-item__img"],
    });

    const itemTitle = this.#domHandler.createPara({
      textContent: project.name,
      classNames: ["project-item__title"],
    });

    li.append(img, itemTitle);

    return li;
  }
}

export class ProjectItemUIHandler {
  #domHandler = new DOMHandler();
  #todo;
  #DOMElements;
  #taskItemHandler;
  #title;

  constructor(title) {
    this.#title = title;
    this.#todo = new Todo();
    this.#taskItemHandler = new TaskItemHandler();
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

  setUpEventListeners() {
    this.renderProjects();
  }

  render() {
    const { projects, title, taskContainer } = this.#DOMElements;
    projects.append(title, taskContainer);

    return projects;
  }

  renderProjects() {
    const projects = this.#todo.getAllProjectsInOrder();
    console.log(projects);
    const projectList = document.querySelector(".project-list");
    projectList.innerHTML = "";

    projects.forEach((project) => {
      this.renderProjectItem(project);
      console.log(`Rendered project: ${project.name}`);
    });
  }

  // FIXME: Duplicate rendering
  renderProjectItem(project) {
    const projectList = document.querySelector(".project-list");
    const projectItem = this.#createProjectItem(project);
    projectItem.dataset.projectId = project.id;
    projectItem.dataset.button = "project-item";

    projectList.append(projectItem);

    // Dispatch `ProjectUIUpdated` event
    if (document.querySelector(".my-projects")) {
      document.dispatchEvent(new CustomEvent("ProjectUIUpdated"));
    }
  }

  #createProjectItem(project) {
    const projectItem = this.#domHandler.createListItem({
      classNames: ["project-item", "sidebar__btn", "page-button"],
    });
    const projectTitle = this.#domHandler.createPara({
      textContent: `# ${project.name}`,
      classNames: ["project-item__title"],
    });

    projectItem.append(projectTitle);

    return projectItem;
  }

  renderProjectDetail() {
    const projectName = document.querySelector("#projectName");
    const project = new Project({ name: projectName });
    this.renderProjectItem(project);
  }

  renderProject(project) {
    this.#renderProjectTitle(project);
    this.#renderProjectTaskList(project);
  }

  #renderProjectTitle(project) {
    if (!project)
      throw new Error(`Invalid project Id: ${JSON.stringify(project)}`);

    const titleInput = document.querySelector(".title-input");
    titleInput.value = project.name;
  }

  #renderProjectTaskList(project) {
    if (!project)
      throw new Error(`Invalid project Id: ${JSON.stringify(project)}`);

    this.#clearProjectTaskList();

    project.taskList.forEach((task) => {
      this.#taskItemHandler.renderTaskItem(task);
      console.log(`Rendered task ${task.name} from project ${project.name}`);
    });

    console.log(`Project "${project.name}" task list rendered.`);
  }

  #clearProjectTaskList() {
    const tasks = document.querySelectorAll(".task-item");

    tasks.forEach((task) => {
      console.log("Removing task...");
      task.remove();
    });
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
