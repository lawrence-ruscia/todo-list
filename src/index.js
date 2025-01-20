class Task {
  #name;
  #description;
  #dueDate;
  #priority;

  // TODO: Add default values for dueDate (should be the current datetime)
  constructor({ name, description = "", dueDate, priority } = {}) {
    this.#name = name;
    this.#description = description;
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
  name: "My Task",
  description: "This is my first task",
  dueDate: new Date().toString(),
  priority: "P5",
});

console.log(task.priority);
