/*
  1. Todo list с массивом даных todos: []
  2. Реализуем параметр done у объекта todo
  3. Удаляем todo через метод filter
  4. Добавим время выполнения задачи
  5. Сортировка asc, desc
  6. Общее время открытых задач с помощью reduce
  7. Объекты keys, values, entries
  8. Прототипы
  9. this и методы объектов
  10. Переписываем todolist на классы
*/

let todos = [];

export class LStorage {
  getTodos() {
    const todos = localStorage.getItem("todos");
    const parsedTodos = JSON.parse(todos);
    return parsedTodos;
  }

  setTodos(todos) {
    const todosString = JSON.stringify(todos);
    localStorage.setItem("todos", todosString);
  }
}

export class TodoList {
  constructor(storage, item) {
    this.storage = storage;
    this.todos = this.storage.getTodos() || [];
    this.item = item;
  }

  addToEventPool = () => {
    this.render();
    this.item.todoForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const todoText = this.item.todoTextInput.value;
      const todoTime = this.item.todoTimeInput.value;
      const trimmedText = todoText.trim();
      const todo = {
        id: Date.now(),
        text: trimmedText,
        done: false,
        time: todoTime,
      };
      if (trimmedText) {
        this.todos.push(todo);
        this.item.todoTextInput.value = "";
        this.item.todoTimeInput.value = "";
        this.item.todoTextInput.focus();
      }
      this.render();
    });
  };

  render = () => {
    const todosNodes = this.todos.map(this.createTodo);

    this.item.todoList.innerHTML = "";

    const todoList = this.item.todoList;
    todosNodes.forEach(function (todoNode) {
      todoList.appendChild(todoNode);
    });

    const timeSumNonCompletedTodos = this.todos.reduce(function (acc, curr, idx) {
      if (!curr.done) {
        acc += Number(curr.time);
      }

      return acc;
    }, 0);

    this.storage.setTodos(this.todos);

    this.item.timeValue.textContent = timeSumNonCompletedTodos;
  };

  todoItemListener = (event) => {
    const current = event.target;
    const parentNode = current.closest("li");
    const isDeleteButton = event.target.closest(".todo__remove-button");
    const isDoneButton = event.target.closest(".todo__done-button");
    const parentNodeId = parentNode.id;

    if (isDeleteButton) {
      this.todos = this.todos.filter((todo) => {
        return todo.id !== Number(parentNodeId);
      });

      this.render();
    } else if (isDoneButton) {
      this.todos.forEach((todo) => {
        if (todo.id === Number(parentNodeId)) {
          todo.done = !todo.done;
        }
      });

      this.render();
    }
  };

  createTodo = (todo) => {
    const liElement = this.item.getliElement();

    liElement.id = todo.id;
    liElement.classList.add("todo__item");

    if (todo.done) {
      liElement.classList.add("done");
    }

    const todoTemplate = `
      <span class="todo__item-text">${todo.text}</span>
      ${todo.time ? `<span class="todo__item-time">${todo.time}</span>` : ""}
      <div class="todo__controls">
        <button class="todo__done-button">Выполнено</button>
        <button class="todo__remove-button">Удалить</button>
      </div>
    `;

    liElement.innerHTML = todoTemplate;

    liElement.addEventListener("click", this.todoItemListener);

    return liElement;
  };
}

export class TodoItem {
  constructor() {
    this.sortByDoneButton = document.querySelector(".todo__sort-button.done");
    this.sortByTimeButton = document.querySelector(".todo__sort-button.time");
    this.todoTextInput = document.querySelector(".todo__text-input");
    this.todoTimeInput = document.querySelector(".todo__time-input");
    this.todoList = document.querySelector(".todo__list");
    this.todoForm = document.querySelector(".todo__form");
    this.timeValue = document.querySelector(".todo__time-value");
  }
  getliElement() {
    const liElement = document.createElement("li");
    return liElement;
  }

}

export class SortedList {
  constructor(todoslist, item) {
    this.todoslist = todoslist;
    this.sortType = null;
    this.item = item;
    this.SORT_TYPES = {
      asc: "asc",
      desc: "desc",
    };

  }

  sortByKey = (key) => {
    let todos = this.todoslist.todos;
    if (!this.sortType || this.sortType === this.SORT_TYPES.desc) {
      todos.sort(function (a, b) {
        return Number(a[key]) - Number(b[key]);
      });

      this.sortType = this.SORT_TYPES.asc;
    } else {
      todos.sort(function (a, b) {
        return Number(b[key]) - Number(a[key]);
      });

      this.sortType = this.SORT_TYPES.desc;
    }
    this.todoslist.render();
  }

  sortByDef = () => {
    const sortByKey = this.sortByKey;
    const sortByTimeButton = this.item.sortByTimeButton;
    const sortByDoneButton = this.item.sortByDoneButton;
    sortByTimeButton.addEventListener("click", function () {
      sortByKey.call({ todoslist: this.todoslist }, 'time');
    });
    sortByDoneButton.addEventListener("click", function () {
      sortByKey.call({ todoslist: this.todoslist }, 'done');
    });
  }
}