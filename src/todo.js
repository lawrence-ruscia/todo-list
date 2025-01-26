export class Task {
  #id;
  #name;
  #description;
  #dueDate;
  #priority;

  constructor({ id, name, description, dueDate, priority } = {}) {
    this.#id = id ?? crypto.randomUUID(); // Generate UUID if there isn't one already set
    this.#name = this.#validateName(name);
    this.#description = this.#validateDescription(description);
    this.#dueDate = this.#validateDueDate(new Date(dueDate));
    this.#priority = this.#validatePriority(priority);
  }

  get id() {
    return this.#id;
  }

  get name() {
    return this.#name;
  }

  get description() {
    return this.#description;
  }

  get dueDate() {
    return this.#dueDate;
  }

  get priority() {
    return this.#priority;
  }

  #validateName(name) {
    if (name === null || name === undefined)
      throw new Error(`Invalid task name: ${name}`);

    if (name === "") throw new Error("Task name is empty");

    return name;
  }

  #validateDescription(description) {
    return description ?? "";
  }

  #validateDueDate(date) {
    if (!date || isNaN(date.getTime())) {
      date = new Date(Date.now());
    }

    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");

    return `${yyyy}-${mm}-${dd}`;
  }

  #validatePriority(priority) {
    const validPriorities = { P1: 1, P2: 2, P3: 3, P4: 4 };

    if (!(priority in validPriorities)) {
      throw new Error(`Invalid priority ${priority}`);
    }

    return priority;
  }

  // Override toJSON() to preserve methods and private properties
  toJSON() {
    return {
      id: this.#id,
      name: this.#name,
      description: this.#description,
      dueDate: this.#dueDate,
      priority: this.#priority,
    };
  }
}

export class Todo {
  addTask(task) {
    if (!task || !task.id || !task.name)
      throw new Error(`Invalid Task ${JSON.stringify(task)}`);

    if (localStorage.getItem(task.id)) {
      console.warn(`Task with task Id ${task.id} already exists.`);
      return;
    }

    // Retrieve and update taskOrder
    const taskOrder = JSON.parse(localStorage.getItem("taskOrder")) ?? [];
    taskOrder.push(task.id);

    // Save task and taskOrder to localStorage
    localStorage.setItem(task.id, JSON.stringify(task));
    localStorage.setItem("taskOrder", JSON.stringify(taskOrder));

    console.log(`Added task: ${task.id}`);
  }

  getTask(taskID) {
    const task = JSON.parse(localStorage.getItem(taskID));

    if (!task || !task.id) {
      throw new Error(`Task with ID ${taskID} not found in localStorage.`);
    }

    console.log(`Retrieved task ${task.name}`);
    return task;
  }

  deleteTask(task) {
    const taskID = task.id;
    if (!taskID) throw new Error(`Invalid Task ID: ${JSON.stringify(taskID)}`);

    if (!localStorage.getItem(taskID)) {
      throw new Error(`Task with id ${taskID} does not exist.`);
    }
    // Retrieve and update taskOrder
    const taskOrder = JSON.parse(localStorage.getItem("taskOrder")) ?? [];
    const taskIndex = taskOrder.indexOf(taskID);

    if (taskIndex === -1) {
      throw new Error(`Task with ID ${taskID} is not in the task order.`);
    }
    // Remove task from localStorage
    localStorage.removeItem(taskID);

    // Remove task ID from taskOrder
    taskOrder.splice(taskIndex, 1);
    localStorage.setItem("taskOrder", JSON.stringify(taskOrder));

    console.log(`Removed task: ${taskID}`);
  }

  getAllTasksInOrder() {
    const taskOrder = JSON.parse(localStorage.getItem("taskOrder")) ?? [];
    return taskOrder.map((taskID) => this.getTask(taskID));
  }

  editTask(taskId, updatedTask) {
    if (!taskId) throw new Error(`Invalid Task ID: ${JSON.stringify(taskId)}`);

    if (!updatedTask || !updatedTask.id || !updatedTask.name)
      throw new Error(`Invalid Task ${JSON.stringify(task)}`);

    if (!localStorage.getItem(taskId)) {
      throw new Error(`Task with id ${taskId} does not exist.`);
    }

    // Rehydrate the updated task while preserving the original task ID
    const modifiedTask = new Task({
      id: taskId,
      name: updatedTask.name,
      description: updatedTask.description,
      dueDate: updatedTask.dueDate,
      priority: updatedTask.priority,
    });

    localStorage.setItem(taskId, JSON.stringify(modifiedTask));
    console.log(`Updated task: ${taskId}`);
  }
}

// TEST
const task1 = new Task({
  name: "myTask",
  priority: "P1",
});

const task2 = new Task({
  name: "newTask",
  priority: "P1",
});

const todo = new Todo();
// todo.addTask(task1);
// console.log(`Task name: ${task1.name}`);

// todo.editTask(task1.id, task2);
