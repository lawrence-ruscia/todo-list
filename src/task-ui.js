import editIcon from "./assets/icons/edit-icon.svg";
import { DOMHandler } from "./dom-handler";
import { PopoverHandler } from "./popover-ui";
import { Todo, Task } from "./todo";
export class TaskItemHandler {
  #DOMElements = {
    taskContainer: document.querySelector(".task-container"),
    modal: document.querySelector(".task-item__modal"),
    modalDetails: document.querySelector(".modal__details"),
    itemForm: document.querySelector("#item-form"),
    titleInput: document.querySelector(".item-form__title"),
    checkbox: document.querySelector(".checkbox__input"),
    saveBtn: document.querySelector(".item-form__save"),
    descriptionInput: document.querySelector(".item-form__description"),
    dueDateInput: document.querySelector(".item-form__date"),
    priorityInput: document.querySelector(".item-form__priority"),
  };
  #todo;
  #domHandler;

  constructor() {
    this.#todo = new Todo();
    this.#domHandler = new DOMHandler();
  }

  setUpEventListeners() {
    this.renderTasks();
    this.#handleItemClick();
    this.#handleModal();
    this.#renderItemDetails();
    this.#handleSaveClick();
    this.#handleCheckboxChange();
  }

  renderTasks() {
    const tasks = this.#todo.getAllTasksInOrder();
    console.log(tasks);

    const taskItems = document.querySelectorAll(".task-item");
    let i = taskItems.length;
    while (i--) {
      taskItems[i].remove();
    }

    tasks.forEach((task) => {
      this.renderTaskItem(task);
      console.log(`Rendered task: ${task.name}`);
    });
  }

  renderTaskItem(task) {
    const taskContainer = document.querySelector(".task-container");
    const taskItem = this.#createTaskItem(task);
    taskContainer.insertBefore(taskItem, taskContainer.lastElementChild);
  }

  #createTaskItem(task) {
    const taskItem = this.#domHandler.createListItem({
      classNames: ["task-item"],
    });

    // Assign data attr for later retrieval
    taskItem.dataset.taskId = task.id;

    const details = this.#createTaskDetails(task);
    const options = this.#createTaskOptions();

    taskItem.append(details, options);

    return taskItem;
  }

  #createTaskDetails({ name, isCompleted }) {
    const details = this.#domHandler.createDiv({
      classNames: ["task__details"],
    });
    const label = this.#domHandler.createLabel({
      classNames: ["checkbox"],
    });
    const input = this.#domHandler.createInput({
      type: "checkbox",
      checked: isCompleted,
      classNames: ["checkbox__input"],
    });
    const box = this.#domHandler.createSpan({
      classNames: ["checkbox__box"],
    });
    const title = this.#domHandler.createPara({
      textContent: name,
      classNames: ["task__title"],
    });

    label.append(input, box);
    details.append(label, title);

    return details;
  }

  #createTaskOptions() {
    const options = this.#domHandler.createDiv({
      classNames: ["task__options"],
    });

    const editButton = this.#domHandler.createButton({
      classNames: ["task__edit"],
    });
    const icon = this.#domHandler.createImg({
      src: editIcon,
      classNames: ["task-btn-img", "btn-icon"],
    });

    editButton.append(icon);
    options.append(editButton);

    return options;
  }

  #handleItemClick() {
    const taskContainer = this.#DOMElements.taskContainer;
    const modal = this.#DOMElements.modal;

    taskContainer.addEventListener("click", (e) => {
      const taskItem = e.target;
      if (taskItem.classList.contains("task-item")) {
        modal.showModal();
      }
    });
  }

  #handleModal() {
    // Handle close btn click
    const handleCloseBtn = (() => {
      document
        .querySelector(".modal__close-btn")
        .addEventListener("click", () => {
          this.#DOMElements.modal.close();
        });
    })();

    const handleFormDetailActions = (() => {
      const form = this.#DOMElements.itemForm;
      const actions = document.querySelector(".item-form__actions");
      const text = document.querySelector(".item-form__text");
      const modal = this.#DOMElements.modal;

      form.addEventListener("focusin", (e) => {
        const input = e.target;
        if (input.tagName === "INPUT") {
          actions.style.display = "flex";
          text.classList.add("item-form__text--focus");
        }
      });

      form.addEventListener("click", (e) => {
        const button = e.target;

        if (button.classList.contains("item-form__cancel")) {
          actions.style.display = "none";
          text.classList.remove("item-form__text--focus");
        }

        if (button.classList.contains("item-form__save")) {
          if (!form.checkValidity()) {
            form.reportValidity(); // Show validation errors
            return;
          }

          // Form is valid, proceed with saving
          actions.style.display = "none";
          text.classList.remove("item-form__text--focus");
        }
      });

      form.addEventListener("submit", (e) => {
        if (!form.checkValidity()) {
          form.reportValidity(); // Show browser validation messages
          e.preventDefault(); // Stop form submission
          return;
        }

        // Form is valid, proceed with saving
        actions.style.display = "none";
        text.classList.remove("item-form__text--focus");
        modal.close();
      });
    })();

    const handleInput = (() => {
      const titleInput = this.#DOMElements.titleInput;
      const saveBtn = this.#DOMElements.saveBtn;
      titleInput.addEventListener("input", (e) => {
        const target = e.target;
        saveBtn.disabled = !target.value.length;
      });
    })();
  }

  #handleCheckboxChange() {
    this.#DOMElements.taskContainer.addEventListener("change", (e) => {
      const target = e.target;

      if (target.closest(".checkbox__input")) {
        const taskItem = target.closest(".task-item");

        if (taskItem) {
          console.log("Target found");
          const taskId = taskItem.dataset.taskId;
          const taskData = this.#todo.getTask(taskId);
          const checkboxInput = taskItem.querySelector(".checkbox__input");

          const updatedTask = new Task({
            name: taskData.name,
            description: taskData.description,
            dueDate: taskData.dueDate,
            priority: taskData.priority,
            isCompleted: checkboxInput.checked,
          });

          checkboxInput.checked = false;

          // Update task in localStorage
          this.#todo.editTask(taskId, updatedTask);

          // Update task details in the DOM
          this.#updateTaskItem(taskId, updatedTask);
          console.log(`Task ${taskId} has been updated.`);
        }
      }
    });
  }

  #renderItemDetails() {
    const container = this.#DOMElements.taskContainer;
    container.addEventListener("click", (e) => {
      const taskItem = e.target;

      // Determine which task item div was clicked
      if (taskItem.classList.contains("task-item")) {
        // Get task ID and retrieve task obj
        const taskId = taskItem.dataset.taskId;
        console.log(`Task selected: ${taskId}`);
        const task = this.#todo.getTask(taskId);

        if (!task) return; // Prevent errors

        // Render task data on input fields
        const titleInput = this.#DOMElements.titleInput;
        const descriptionInput = this.#DOMElements.descriptionInput;
        const dueDateInput = this.#DOMElements.dueDateInput;
        const priorityInput = this.#DOMElements.priorityInput;

        const checkBoxInput = this.#DOMElements.checkbox;

        titleInput.value = task.name;
        descriptionInput.value = task.description;
        dueDateInput.value = task.dueDate;
        priorityInput.value = task.priority;
        checkBoxInput.checked = task.isCompleted;

        this.#handleDeleteClick(task);

        // Store task ID in the form's dataset to identify task
        this.#DOMElements.itemForm.dataset.taskId = taskId;
      }
    });
  }

  #handleSaveClick() {
    const form = this.#DOMElements.itemForm;

    form.addEventListener("submit", (e) => {
      // Retrieve task ID from the form's dataset
      const taskId = form.dataset.taskId;

      // Get updated input values
      const titleInput = this.#DOMElements.titleInput;
      const descriptionInput = this.#DOMElements.descriptionInput;
      const dueDateInput = this.#DOMElements.dueDateInput;
      const priorityInput = this.#DOMElements.priorityInput;
      const checkboxInput = this.#DOMElements.checkbox;

      const updatedTask = new Task({
        name: titleInput.value,
        description: descriptionInput.value,
        dueDate: dueDateInput.value,
        priority: priorityInput.value,
        isCompleted: checkboxInput.checked,
      });

      checkboxInput.checked = false;

      // Update task in localStorage
      this.#todo.editTask(taskId, updatedTask);

      // Update task details in the DOM
      this.#updateTaskItem(taskId, updatedTask);
      console.log(`Task ${taskId} has been updated.`);
    });
  }

  #handleDeleteClick(task) {
    const deleteBtn = document.querySelector(".options__delete");

    const newDeleteBtn = deleteBtn.cloneNode(true);
    deleteBtn.parentNode.replaceChild(newDeleteBtn, deleteBtn);

    newDeleteBtn.addEventListener("click", (e) => {
      // Delete from DOM
      this.#deleteTaskItem(task.id);

      // Delete from localStorage
      this.#todo.deleteTask(task);

      this.#DOMElements.modal.close();
    });
  }

  #deleteTaskItem(taskId) {
    const taskItems = document.querySelectorAll(".task-item");

    taskItems.forEach((taskItem) => {
      if (taskItem.dataset.taskId === taskId) {
        taskItem.remove();
      }
    });
  }

  #updateTaskItem(taskId, updatedTask) {
    const taskItems = document.querySelectorAll(".task-item");

    taskItems.forEach((taskItem) => {
      // Locate which task item matches the given ID
      if (taskItem.dataset.taskId === taskId) {
        // Modify the task title text content
        console.log("Task Item Located!");
        taskItem.querySelector(".task__title").textContent = updatedTask.name;
        taskItem.querySelector(".checkbox__input").checked =
          updatedTask.isCompleted;
      }
    });
  }
}
