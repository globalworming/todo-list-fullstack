const { test } = require("@playwright/test");
const ToDoList = require("./ToDoList");

class Steps {
  constructor(page) {
    this.page = page;
  }

  createTodo = async (description) =>
    await test.step("Create todo with description " + description, async () => {
      await test.step("Filling the task input", async () => {
        await this.page.fill(ToDoList.input, description);
      });
      await test.step("Press 'Enter' to add the new task", async () => {
        await this.page.keyboard.press("Enter");
      });
    });

  createFiveTodos = async () =>
    await test.step("Create five todos", async () => {
      for (let i = 1; i < 6; i++) {
        let description = "ToDo " + i;
        await this.createTodo(description);
      }
    });
}

module.exports = Steps;
