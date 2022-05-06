import { addEvent, escapeForHTML, getURLHash } from "./helpers.js";
import { TodoStore } from "./store.js";

class App {
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
		this.store = new TodoStore("todo-vanillajs-2022");
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
		this.render();
	}

	addTodo(todo) {
		this.store.add({ title: todo, completed: false, id: `id_${Date.now()}` });
	}

	removeTodo(todo) {
		this.store.remove(todo);
	}

	toggleTodo(todo) {
		this.store.toggle(todo);
	}

	editingTodo(_todo, li) {
		li.classList.add("editing");
		li.querySelector(".edit").focus();
	}

	updateTodo(todo, li) {
		this.store.update(todo);
		li.querySelector(".edit").value = todo.title;
	}

	createTodoItem(todo) {
		const li = document.createElement("li");
		if (todo.completed) {
			li.classList.add("completed");
		}

		li.innerHTML = `
      <div class="view">
        <input class="toggle" type="checkbox" ${
					todo.completed ? "checked" : ""
				}>
        <label>${escapeForHTML(todo.title)}</label>
        <button class="destroy" aria-label="remove todo"></button>
      </div>
      <input class="edit" value="${escapeForHTML(todo.title)}">
    `;

		addEvent(li, ".destroy", "click", () => this.removeTodo(todo, li));
		addEvent(li, ".toggle", "click", () => this.toggleTodo(todo, li));
		addEvent(li, "label", "dblclick", () => this.editingTodo(todo, li));
		addEvent(li, ".edit", "keyup", (event) => {
			if (event.key === "Enter")
				this.updateTodo({ ...todo, title: event.target.value }, li);
		});
		addEvent(li, ".edit", "blur", (event) =>
			this.updateTodo({ ...todo, title: event.target.value }, li)
		);

		return li;
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

new App();

