export class Task {
  #id;
  #name;
  #description;
  #dueDate;
  #priority;
  #isCompleted;

  constructor({ id, name, description, dueDate, priority, isCompleted } = {}) {
    this.#id = id ?? crypto.randomUUID(); // Generate UUID if there isn't one already set
    this.#name = this.#validateName(name);
    this.#description = this.#validateDescription(description);
    this.#dueDate = this.#validateDueDate(new Date(dueDate));
    this.#priority = this.#validatePriority(priority);
    this.#isCompleted = isCompleted ?? false;
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

  get isCompleted() {
    return this.#isCompleted;
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
  // Ensures that only serializable properties are stored
  toJSON() {
    return {
      id: this.#id,
      name: this.#name,
      description: this.#description,
      dueDate: this.#dueDate,
      priority: this.#priority,
      isCompleted: this.#isCompleted,
    };
  }

  // Rehydrate Task instances from plain JSON objects
  static fromJSON(json) {
    return new Task(json);
  }
}

export class Project {
  #id;
  #name;
  #taskList;

  constructor({ id, name, taskList = [] } = {}) {
    this.#id = id ?? crypto.randomUUID();
    this.#name = name;
    this.#taskList = taskList.map(
      (task) => (task instanceof Task ? task : new Task(task)) // Ensure task instances
    );
  }

  clear() {
    this.#taskList = [];
  }

  get id() {
    return this.#id;
  }

  get name() {
    return this.#name;
  }

  set name(newName) {
    this.#name = newName;
  }

  get taskList() {
    return this.#taskList;
  }

  set taskList(newTaskList) {
    this.#taskList = newTaskList;
  }

  // Override toJSON() to preserve methods and private properties
  toJSON() {
    return {
      id: this.#id,
      name: this.#name,
      taskList: this.#taskList.map((task) => task.toJSON), // Convert task instances to plain objects
    };
  }

  static fromJSON(json) {
    return new Project({
      id: json.id,
      name: json.name,
      taskList: json.taskList.map((task) => Task.fromJSON(task)), // Rehydrate task instances
    });
  }
}

export class Todo {
  static instance = null; // Singleton instance

  #currentProject = null;
  #projects = {};

  constructor() {
    if (Todo.instance) {
      return Todo.instance;
    }

    Todo.instance = this;
    this.#loadDefaultProject();
    this.#loadProjectsData();
  }

  #loadDefaultProject() {
    if (!localStorage.getItem("defaultProjectLoaded")) {
      const project = new Project({ name: "My Todo" });
      this.createProject(project);
      this.setCurrentProject(project.id);
      this.#saveCurrentProject();

      // Ensure method only executes once
      localStorage.setItem("defaultProjectLoaded", true);
    }
  }

  addProject(projectId, project) {
    this.#projects[projectId] = project;

    this.#saveProjects();
  }

  removeProject(projectId) {
    delete this.#projects[projectId];

    this.#saveProjects();
  }

  #saveCurrentProject() {
    if (this.#currentProject) {
      localStorage.setItem(
        "currentProject",
        JSON.stringify(this.#currentProject)
      );
    }
  }

  #saveProjects() {
    localStorage.setItem("projects", JSON.stringify(this.#projects));
  }

  #loadProjectsData() {
    const storedProjects = JSON.parse(localStorage.getItem("projects")) ?? {};
    this.#projects = storedProjects;

    const storedCurrentProject = localStorage.getItem("currentProject");
    if (storedCurrentProject) {
      console.log(
        `Stored current project: ${JSON.stringify(storedCurrentProject)}`
      );
      this.#currentProject = Project.fromJSON(JSON.parse(storedCurrentProject));
    }
  }

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

    // Add to currentProject
    this.addTaskToCurrentProject(task);
  }

  getTask(taskID) {
    const task = JSON.parse(localStorage.getItem(taskID));

    if (!task || !task.id) {
      throw new Error(`Task with ID ${taskID} was not found in localStorage.`);
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
    // remove from project tasklist
    this.removeFromProjectTaskList(task);

    // Remove task from localStorage
    localStorage.removeItem(taskID);

    // Remove task ID from taskOrder
    taskOrder.splice(taskIndex, 1);
    localStorage.setItem("taskOrder", JSON.stringify(taskOrder));

    console.log(`Removed task: ${taskID}`);
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
      isCompleted: updatedTask.isCompleted,
    });

    localStorage.setItem(taskId, JSON.stringify(modifiedTask));

    // update from project tasklist
    this.updateFromProjectTaskList(taskId, modifiedTask);

    console.log(`Updated task: ${taskId}`);
  }

  getAllTasksInOrder() {
    const taskOrder = JSON.parse(localStorage.getItem("taskOrder")) ?? [];
    return taskOrder.map((taskID) => this.getTask(taskID));
  }

  getAllProjectsInOrder() {
    const projectsOrder =
      JSON.parse(localStorage.getItem("projectOrder")) ?? [];
    return projectsOrder.map((projectId) => this.getProject(projectId));
  }

  createProject(project) {
    if (!project || !project.id || !project.name)
      throw new Error(`Invalid Project ${JSON.stringify(project)}`);

    if (localStorage.getItem(project.id))
      throw new Error(`Project ${project.name} already exists`);

    const projectOrder = JSON.parse(localStorage.getItem("projectOrder")) ?? [];
    projectOrder.push(project.id);

    console.table(project);

    // Convert task instances to plain objects
    const serializedProject = {
      id: project.id,
      name: project.name,
      taskList: project.taskList.map((task) => task.toJSON()),
    };

    this.#saveProjectToLocalStorage(project.id, serializedProject);
    localStorage.setItem("projectOrder", JSON.stringify(projectOrder));

    // Add to projects object
    this.addProject(project.id, serializedProject);
    console.log(`Added project: ${this.#projects[project.id].name}`);
  }

  getProject(projectId) {
    const rawProjectData = JSON.parse(localStorage.getItem(projectId));
    if (!rawProjectData)
      throw new Error(
        `Project with ID ${projectId} was not found in localStorage`
      );

    const rehydratedProject = {
      id: rawProjectData.id,
      name: rawProjectData.name,
      taskList:
        rawProjectData.taskList.length > 0
          ? rawProjectData.taskList.map((task) => Task.fromJSON(task))
          : [],
    };

    return Project.fromJSON(rehydratedProject);
  }

  #saveProjectToLocalStorage(projectId, project) {
    localStorage.setItem(projectId, JSON.stringify(project));
  }

  updateProjectName(projectId, updatedProject) {
    if (!projectId) throw new Error(`Invalid project Id: ${projectId}`);
    if (!updatedProject)
      throw new Error(
        `Invalid project name: ${JSON.stringify(updatedProject)}`
      );

    console.log(JSON.stringify(updatedProject));

    // // update project in `projects` and `localStorage`
    this.addProject(projectId, updatedProject);
    this.#saveProjectToLocalStorage(projectId, updatedProject);
  }

  deleteProject(projectId) {
    if (!projectId) throw new Error(`Invalid project id: ${projectId}`);

    const taskList = this.getProject(projectId).taskList;
    if (taskList) {
      console.log("Removing tasks...");
      taskList.forEach((task) => {
        this.deleteTask(task);
      });
    }

    // Remove from `localStorage`
    localStorage.removeItem(projectId);

    // Remove from `projectsOrder`
    const projectOrder = JSON.parse(localStorage.getItem("projectOrder")) ?? [];
    const projectsOrderIndex = projectOrder.indexOf(projectId);

    if (projectsOrderIndex !== -1) {
      projectOrder.splice(projectsOrderIndex, 1);
      localStorage.setItem("projectOrder", JSON.stringify(projectOrder));
    }

    // Remove from `projects`
    this.removeProject(projectId);

    console.log(`Removed project ${projectId}`);
  }

  setCurrentProject(projectId) {
    const projects = JSON.parse(localStorage.getItem("projects"));

    if (!projects[projectId]) {
      console.error("Projects list:", this.#projects);
      throw new Error(`Project with id ${projectId} does not exist.`);
    }

    this.#currentProject = this.#projects[projectId];
    this.#saveCurrentProject();
    console.log(`Current project: ${this.getCurrentProject().name} `);
  }

  getCurrentProject() {
    if (!this.#currentProject) throw new Error("No selected project.");

    return this.#currentProject;
  }

  addTaskToCurrentProject(task) {
    if (!task) throw new Error(`Invalid task: ${JSON.stringify(task)}`);

    // HACK: Directly accessing taskList from project
    const currentProject = this.getCurrentProject();
    currentProject.taskList.push(task);

    // Update project's taskList from localStorage
    localStorage.setItem(
      this.#currentProject.id,
      JSON.stringify(currentProject)
    );

    // Update "projects" from localStorage
    this.addProject(this.#currentProject.id, currentProject);

    // Update "currentProject" from localStorage
    this.#saveCurrentProject();

    // Update on the project itself on localStorage
    this.#saveProjectToLocalStorage(this.#currentProject.id, currentProject);
  }

  removeFromProjectTaskList(task) {
    if (!task) throw new Error(`Invalid task: ${JSON.stringify(task)}`);

    const currentProject = this.getCurrentProject();

    const taskIndex = currentProject.taskList.findIndex(
      (t) => t.id === task.id
    );

    if (taskIndex === -1)
      throw new Error(`Task with ID ${task.id} does not exist.`);

    currentProject.taskList.splice(taskIndex, 1);
    console.log(`Removed task ${task.id} from project ${currentProject.name}`);

    localStorage.setItem(
      this.#currentProject.id,
      JSON.stringify(currentProject)
    );

    this.#saveProjects();

    this.#saveCurrentProject();
  }

  updateFromProjectTaskList(taskId, updatedTask) {
    if (!updatedTask)
      throw new Error(`Invalid task: ${JSON.stringify(updatedTask)}`);

    const currentProject = this.getCurrentProject();

    const taskIndex = currentProject.taskList.findIndex((t) => t.id === taskId);

    if (taskIndex === -1)
      throw new Error(`Task with ID ${taskId} does not exist.`);

    // Remove previous task
    currentProject.taskList.splice(taskIndex, 1);

    // Replace with updatedTask
    currentProject.taskList.splice(taskIndex, 0, updatedTask);

    console.log(`Updated task ${taskId} from project ${currentProject.name}`);

    localStorage.setItem(
      this.#currentProject.id,
      JSON.stringify(currentProject)
    );

    this.#saveProjects();

    this.#saveCurrentProject();
  }
}

// TEST
const task1 = new Task({
  name: "myTask",
  priority: "P1",
});

const task2 = new Task({
  name: "newTask",
  priority: "P2",
});

const todo = new Todo();
// todo.addTask(task1);
// todo.addTask(task2);

// const project = new Project({ name: "New project" });
// const project2 = new Project({ name: "Project 2" });
// // project.appendTask(task1, task2);
// todo.createProject(project);
// todo.updateProjectName(project.id, "ULOL");
// todo.createProject(project2);
// Todo.setCurrentProject(project.id);
// console.log(`Selected project is ${Todo.getCurrentProject().name}`);

// Todo.setCurrentProject(project2.id);
// console.log(`Selected project is ${Todo.getCurrentProject().name}`);

// const restoredProject = todo.getProject(project.id);
// console.table(restoredProject);
