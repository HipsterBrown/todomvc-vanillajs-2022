import { DestroyEvent, ToggleEvent, UpdateEvent } from "./events.js";
import { escapeForHTML } from "./helpers.js";

const template = document.createElement("template");
template.innerHTML = `
  <link rel="stylesheet" href="node_modules/todomvc-common/base.css">
  <link rel="stylesheet" href="node_modules/todomvc-app-css/index.css">

  <style>
    :host {
      display: block;
      position: relative;
      font-size: 24px;
      border-bottom: 1px solid #ededed;
    }

    .editing {
      border-bottom: none;
      padding: 0;
    }

    :host(.editing) .edit {
      display: block;
      width: calc(100% - 43px);
      padding: 12px 16px;
      margin: 0 0 0 43px;
    }

    :host(.editing) .view {
      display: none;
    }

    .toggle {
      text-align: center;
      width: 40px;
      /* auto, since non-WebKit browsers doesn't support input styling */
      height: auto;
      position: absolute;
      top: 0;
      bottom: 0;
      margin: auto 0;
      border: none; /* Mobile Safari */
      -webkit-appearance: none;
      appearance: none;
    }

    .toggle {
      opacity: 0;
    }

    .toggle + label {
      background-image: url('data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%22-10%20-18%20100%20135%22%3E%3Ccircle%20cx%3D%2250%22%20cy%3D%2250%22%20r%3D%2250%22%20fill%3D%22none%22%20stroke%3D%22%23949494%22%20stroke-width%3D%223%22/%3E%3C/svg%3E');
      background-repeat: no-repeat;
      background-position: center left;
    }

    .toggle:checked + label {
      background-image: url('data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%22-10%20-18%20100%20135%22%3E%3Ccircle%20cx%3D%2250%22%20cy%3D%2250%22%20r%3D%2250%22%20fill%3D%22none%22%20stroke%3D%22%2359A193%22%20stroke-width%3D%223%22%2F%3E%3Cpath%20fill%3D%22%233EA390%22%20d%3D%22M72%2025L42%2071%2027%2056l-4%204%2020%2020%2034-52z%22%2F%3E%3C%2Fsvg%3E');
    }

    label {
      word-break: break-all;
      padding: 15px 15px 15px 60px;
      display: block;
      line-height: 1.2;
      transition: color 0.4s;
      font-weight: 400;
      color: #484848;
    }

    .completed label {
      color: #949494;
      text-decoration: line-through;
    }

    .destroy {
      display: none;
      position: absolute;
      top: 0;
      right: 10px;
      bottom: 0;
      width: 40px;
      height: 40px;
      margin: auto 0;
      font-size: 30px;
      color: #949494;
      transition: color 0.2s ease-out;
    }

    .destroy:hover,
    .destroy:focus {
      color: #C18585;
    }

    .destroy:after {
      content: '×';
      display: block;
      height: 100%;
      line-height: 1.1;
    }

    :host(:hover) .destroy {
      display: block;
    }

    .edit {
      display: none;
    }
  </style>
  
  <div class="view">
    <input class="toggle" type="checkbox">
    <label></label>
    <button class="destroy" aria-label="remove todo" type="button"></button>
  </div>
  <input class="edit">
`;

export class TodoItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  title = "";
  completed = false;

  connectedCallback() {
    this.role = "list-item";

    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.shadowRoot
      .querySelector(".destroy")
      .addEventListener("click", () => this.remove());
    this.shadowRoot
      .querySelector(".toggle")
      .addEventListener("click", () => this.toggle());
    this.shadowRoot
      .querySelector("label")
      .addEventListener("dblclick", () => this.editing());
    this.shadowRoot
      .querySelector(".edit")
      .addEventListener("keyup", (event) => {
        if (event.key === "Enter") this.update(event.target.value);
      });
    this.shadowRoot.querySelector(".edit").addEventListener("blur", (event) => {
      this.update(event.target.value);
    });

    this.shadowRoot.querySelector("label").textContent = escapeForHTML(
      this.title
    );
    this.shadowRoot.querySelector(".edit").value = escapeForHTML(this.title);
    if (this.completed) {
      this.classList.add("completed");
      this.shadowRoot.querySelector(".toggle").checked = this.completed;
    }
  }

  remove() {
    this.dispatchEvent(
      new DestroyEvent(this.todo)
    );
  }

  toggle() {
    this.dispatchEvent(
      new ToggleEvent(this.todo)
    );
  }

  editing() {
    this.classList.add("editing");
    this.shadowRoot.querySelector(".edit").focus();
  }

  update(value) {
    this.dispatchEvent(
      new UpdateEvent({ ...this.todo, title: value })
    );
    this.shadowRoot.querySelector(".edit").value = value;
  }

  get todo() {
    return {
      id: this.id,
      completed: this.completed,
      title: this.title,
    };
  }
}

customElements.define("todo-item", TodoItem);
