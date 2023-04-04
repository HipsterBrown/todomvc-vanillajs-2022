import { getURLHash } from "./helpers.js";
import { TodoStore } from "./store.js";
import "./todo-item.js";

class App extends HTMLElement {
  $ = {
    input: document.querySelector(".new-todo"),
    list: document.querySelector(".todo-list"),
    count: document.querySelector(".todo-count strong"),
    footer: document.querySelector(".footer"),
    toggleAll: document.querySelector(".toggle-all"),
    main: document.querySelector(".main"),
    clear: document.querySelector(".clear-completed"),
    filters: document.querySelector(".filters"),
  };
  filter = getURLHash();

  constructor() {
    super();
    this.store = new TodoStore("todo-vanillajs-2022");
  }

  connectedCallback() {
    this.#attachListeners();
    this.render();
  }

  #attachListeners() {
    this.store.addEventListener("save", this.render.bind(this));
    window.addEventListener("hashchange", () => {
      this.filter = getURLHash();
      this.render();
    });
    this.$.input.addEventListener("keyup", (event) => {
      if (event.key === "Enter") {
        this.addTodo(event.target.value);
        this.$.input.value = "";
      }
    });
    this.$.toggleAll.addEventListener("click", () => {
      this.store.toggleAll();
    });
    this.$.clear.addEventListener("click", () => {
      this.store.clearCompleted();
    });
    this.$.list.addEventListener("destroy", (event) => {
      this.store.remove(event.detail);
    });
    this.$.list.addEventListener("update", (event) => {
      this.store.update(event.detail);
    });
    this.$.list.addEventListener("toggle", (event) => {
      this.store.toggle(event.detail);
    });
  }

  addTodo(todo) {
    this.store.add({ title: todo, completed: false, id: `id_${Date.now()}` });
  }

  createTodoItem(todo) {
    const todoItem = document.createElement("todo-item");
    todoItem.completed = todo.completed;
    todoItem.title = todo.title;
    todoItem.id = todo.id;

    return todoItem;
  }

  render() {
    const todosCount = this.store.all().length;
    this.$.filters
      .querySelectorAll("a")
      .forEach((el) => el.classList.remove("selected"));
    this.$.filters
      .querySelector(`[href="#/${this.filter}"]`)
      .classList.add("selected");
    this.$.list.innerHTML = "";
    this.store.all(this.filter).forEach((todo) => {
      this.$.list.appendChild(this.createTodoItem(todo));
    });
    this.$.footer.style.display = todosCount ? "block" : "none";
    this.$.main.style.display = todosCount ? "block" : "none";
    this.$.clear.style.display = this.store.hasCompleted() ? "block" : "none";
    this.$.toggleAll.checked = todosCount && this.store.isAllCompleted();
    this.$.count.innerHTML = this.store.all("active").length;
  }
}

customElements.define("todo-app", App);

