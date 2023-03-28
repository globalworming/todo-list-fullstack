import { test } from "@playwright/test";
import ToDoList from "./ToDoList";

class Asks {
  constructor(page) {
    this.page = page;
  }

  forCurrentNumberOfTodos = async () =>
    await test.step(`ask for current number of todos`, async () => {
      return await this.page.locator(ToDoList.items).count();
    });
}
module.exports = Asks;
