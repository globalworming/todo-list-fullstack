export default class ToDo {
  constructor(id, description) {
    this.id = id;
    this.description = description.trim();
    this.done = false;
  }
}
