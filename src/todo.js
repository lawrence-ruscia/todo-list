export class Task {
  #id;
  #name;
  #description;
  #dueDate;
  #priority;

  constructor({ name, description, dueDate, priority } = {}) {
    this.#id = crypto.randomUUID(); // Generate UUID
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
      console.warn(`Task with ID ${task.id} already exists.`);
      return;
    }

    // Retrieve and update taskOrder
    const taskOrder = JSON.parse(localStorage.getItem("taskOrder")) ?? [];
    taskOrder.push(task.id);

    // Save task and taskOrder to localStorage
    localStorage.setItem(task.id, JSON.stringify(task));
    localStorage.setItem("taskOrder", JSON.stringify(taskOrder));

    console.log(`Added task: ${task.name}`);
  }

  getTask(taskID) {
    const taskData = JSON.parse(localStorage.getItem(taskID));

    // Rehydrate to preserve Task instance
    const task = new Task({
      name: taskData.name,
      description: taskData.description,
      dueDate: taskData.dueDate,
      priority: taskData.priority,
    });

    console.log(`Retrieved task ${task.name}`);
    return task;
  }

  getAllTasksInOrder() {
    const taskOrder = JSON.parse(localStorage.getItem("taskOrder")) ?? [];
    return taskOrder.map((taskID) => this.getTask(taskID));
  }
}
