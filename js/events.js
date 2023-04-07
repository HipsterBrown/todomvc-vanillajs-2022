class TodoEvent extends CustomEvent {
  constructor(name, todo) {
    if (!todo) throw new Error(`Missing todo in "${name}" event`)
    super(name, { bubbles: true, detail: todo })
  }
}
export class DestroyEvent extends TodoEvent {
  constructor(todo) {
    super("destroy", todo)
  }
}

export class ToggleEvent extends TodoEvent {
  constructor(todo) {
    super("toggle", todo)
  }
}

export class UpdateEvent extends TodoEvent {
  constructor(todo) {
    super("update", todo)
  }
}

export class SaveEvent extends CustomEvent {
  constructor() {
    super('save')
  }
}
