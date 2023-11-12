import { LStorage } from "./src/js/todo.js";

import { TodoItem } from "./src/js/todo.js";
import { TodoList } from "./src/js/todo.js";
import { SortedList } from "./src/js/todo.js";

import { PrintData } from "./src/js/tab_data.js";


const storage = new LStorage();

const item = new TodoItem();
const itemList = new TodoList(storage, item);
const sortedList = new SortedList(itemList, item);

const data = new PrintData();

itemList.addToEventPool();
sortedList.sortByDef();
data.printToLog();