import "./style.css";
import "./normalize.css";

import { TaskUIHandler } from "./todo-ui";
import { Todo } from "./todo";

const taskUI = new TaskUIHandler().render();
const todo = new Todo();
