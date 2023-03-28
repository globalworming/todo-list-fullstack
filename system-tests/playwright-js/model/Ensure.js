import { expect, test } from "@playwright/test";
import ToDoList from "./ToDoList";

class Ensure {
  constructor(page) {
    this.page = page;
  }

  theCurrentNumberOfTodosIs = async (i) =>
    await test.step("ensure the number of todos is " + i, async () => {
      await expect(this.page.locator(ToDoList.items)).toHaveCount(i);
    });
}

module.exports = Ensure;
