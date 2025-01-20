class Task {
  #name;
  #description;
  #dueDate;
  #priority;

  // TODO: Add default values for dueDate (should be the current datetime)
  constructor({ name, description, dueDate, priority } = {}) {
    this.#name = this.#validateName(name);
    this.#description = this.#validateDescription(description);
    this.#dueDate = dueDate;
    this.#priority = this.#validatePriority(priority);
  }

  get name() {
    return this.#name;
  }

  get description() {
    return this.#description;
  }

  // TODO: Use date-fns for better formatting
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

  #validatePriority(priority) {
    const validPriorities = { P1: 1, P2: 2, P3: 3, P4: 4 };

    if (!(priority in validPriorities)) {
      throw new Error(`Invalid priority ${priority}`);
    }

    return validPriorities[priority];
  }
}

// TEST
const task = new Task({
  name: "task",
  description: undefined,
  dueDate: new Date().toString(),
  priority: "P3",
});

console.log(task.description);
