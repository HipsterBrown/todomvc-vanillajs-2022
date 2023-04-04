import { SaveEvent } from "./events";

export class TodoStore extends EventTarget {
  constructor(localStorageKey) {
    super();
    this.localStorageKey = localStorageKey;
    this.todos = JSON.parse(
      window.localStorage.getItem(localStorageKey) || "[]"
    );
  }
  #save() {
    window.localStorage.setItem(
      this.localStorageKey,
      JSON.stringify(this.todos)
    );
    this.dispatchEvent(new SaveEvent());
  }
  // GETTER methods
  all(viewFilter) {
    if (viewFilter === "active") {
      return this.todos.filter((todo) => !todo.completed);
    }
    if (viewFilter === "completed") {
      return this.todos.filter((todo) => todo.completed);
    }
    return this.todos;
  }
  hasCompleted() {
    return this.todos.some((todo) => todo.completed);
  }
  isAllCompleted() {
    return this.todos.every((todo) => todo.completed);
  }
  // MUTATE methods
  add(todo) {
    this.todos.push({
      title: todo.title,
      completed: false,
      id: "id_" + Date.now(),
    });
    this.#save();
  }
  remove({ id }) {
    this.todos = this.todos.filter((todo) => todo.id !== id);
    this.#save();
  }
  toggle({ id }) {
    this.todos = this.todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    this.#save();
  }
  clearCompleted() {
    this.todos = this.todos.filter((todo) => !todo.completed);
    this.#save();
  }
  update(todo) {
    this.todos = this.todos.map((t) => (t.id === todo.id ? todo : t));
    this.#save();
  }
  toggleAll() {
    if (this.hasCompleted()) {
      if (this.isAllCompleted()) {
        this.todos = this.todos.map((todo) => ({ ...todo, completed: false }));
      } else {
        this.todos = this.todos.map((todo) => ({ ...todo, completed: true }));
      }
    } else {
      this.todos = this.todos.map((todo) => ({ ...todo, completed: true }));
    }
    this.#save();
  }
}

