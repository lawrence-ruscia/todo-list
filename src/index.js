class Task {
  #id;
  #name;
  #description;
  #dueDate;
  #priority;

  constructor({ name, description, dueDate, priority } = {}) {
    this.#id = crypto.randomUUID(); // Generate UUID
    this.#name = this.#validateName(name);
    this.#description = this.#validateDescription(description);
    this.#dueDate = this.#validateDueDate(dueDate);
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
    return date ?? new Date();
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

class Todo {
  // TODO: Add check for already existing tasks
  addTask(task) {
    if (typeof task !== "object" || task === null)
      throw new Error(`Invalid Task ${JSON.stringify(task)}`);

    localStorage.setItem(task.id, JSON.stringify(task));
    console.log(`Added task: ${task.name}`);
  }

  getTask() {}
}

// TEST
const task = new Task({
  name: "myTask",
  description: undefined,
  dueDate: new Date("2022-05-21"),
  priority: "P3",
});

const todo = new Todo();

todo.addTask(task);
