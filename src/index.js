class Task {
  #name;
  #description;
  #dueDate;
  #priority;

  // TODO: Add default values for dueDate (should be the current datetime) and priority (should be from P1 - P4)
  constructor({ name, description = "", dueDate, priority } = {}) {
    this.#name = name;
    this.#description = description;
    this.#dueDate = dueDate;
    this.#priority = priority;
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
}

// TEST
const task = new Task({
  name: "My Task",
  description: "This is my first task",
  dueDate: new Date().toString(),
  priority: "P1",
});

console.log(task.name);
console.log(task.description);
console.log(task.dueDate);
console.log(task.priority);
