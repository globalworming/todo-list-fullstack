const BasePage = require("./Base.page");
const { test } = require("@playwright/test");

class ToDoListPage extends BasePage {
  constructor(page) {
    super(page);

    //selectors
    this.toDoInput = ".new-todo";
    this.selectBtn = ".toggle";

    // locators
    this.toDoList = page.locator(".todo-list li");
    this.toggleAllBtn = page.locator("#toggle-all");
    this.active = page.getByText("Active", { exact: true });
    this.complete = page.getByText("Completed", { exact: true });
    this.deleteBtn = page.locator(".destroy");
  }

  async navigate() {
    await super.navigate("#/");
  }

  async createToDo(input) {
    await test.step("Filling the task input", async () => {
      await this.page.fill(this.toDoInput, input);
    });
    await test.step("Press 'Enter' to add the new task", async () => {
      await this.page.keyboard.press("Enter");
    });
  }

  async deleteToDo(pos) {
    await test.step(`Hover the ${pos} task`, async () => {
      let toDo = await this.page.locator(
        `ul > li:nth-child(${pos}) > div > input`
      );
      await toDo.hover();
    });

    await test.step(`Click the delete btn of ${pos} task`, async () => {
      let toDestroy = await this.page.locator(
        `ul > li:nth-child(${pos}) .destroy`
      );
      await toDestroy.click();
    });
  }

  async toggleAll() {
    await test.step("Click on the Toggle All btn", async () => {
      await this.toggleAllBtn.click();
    });
  }

  async selectToDo(pos) {
    await test.step(`Select the ${pos} task`, async () => {
      await this.page.locator(`ul li:nth-child(${pos}) .toggle`).click();
    });
  }

  async getListLength() {
    return await test.step(`Cheking how many tasks are in the list`, async () => {
      return await this.toDoList.count();
    });
  }

  async getTask(n) {
    return await this.page.locator(`ul > li:nth-child(${n}) > div > label`);
  }

  // async getTaskId(n){
  //     const taskID=page.locator(`ul> li:nth-child(${(n)})`).getAttribute('data-id');
  //     return taskID;
  // }
}

module.exports = ToDoListPage;