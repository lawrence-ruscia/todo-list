import "./style.css";
import "./normalize.css";

import { TodoUIHandler } from "./todo-ui";
import { Todo } from "./todo";

const todoUI = new TodoUIHandler().render();
const todo = new Todo();
