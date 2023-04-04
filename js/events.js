export class DestroyEvent extends CustomEvent {
  constructor(todo) {
    if (!todo) throw new Error('Missing todo in DestroyEvent')
    super("destroy", { bubbles: true, detail: todo })
  }
}

export class ToggleEvent extends CustomEvent {
  constructor(todo) {
    if (!todo) throw new Error('Missing todo in ToggleEvent')
    super('toggle', { bubbles: true, detail: todo })
  }
}

export class UpdateEvent extends CustomEvent {
  constructor(todo) {
    if (!todo) throw new Error('Missing todo in ToggleEvent')
    super('update', { bubbles: true, detail: todo })
  }
}

export class SaveEvent extends CustomEvent {
  constructor() {
    super('save')
  }
}
