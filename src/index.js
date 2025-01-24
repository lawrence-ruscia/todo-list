import "./style.css";
import "./normalize.css";

import { AddTaskHandler } from "./todo-ui";
import { Todo } from "./todo";

const taskUI = new AddTaskHandler().renderModal();
const todoApp = new Todo();
