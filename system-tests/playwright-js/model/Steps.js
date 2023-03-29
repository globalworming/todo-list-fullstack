const { test } = require('@playwright/test');
const ToDoList = require('./ToDoList');

class Steps {
  constructor(page) {
    this.page = page;
  }

  createTodo = async (description) =>
    await test.step('Create todo with description ' + description, async () => {
      await test.step('Filling the task input', async () => {
        await this.page.fill(ToDoList.input, description);
      });
      await test.step("Press 'Enter' to add the new task", async () => {
        await this.page.keyboard.press('Enter');
      });
    });

  createFiveTodos = async () =>
    await test.step('Create five todos', async () => {
      for (let i = 1; i < 6; i++) {
        let description = 'ToDo ' + i;
        await this.createTodo(description);
      }
    });

  deleteTodo = async (pos) => {
    await test.step(`deleting the ${pos} task`, async () => {
      await test.step(`Hover over the element`, async () => {
        let toDo = await this.page.locator(`ul > li:nth-child(${pos}) > div > input`);
        await toDo.hover();
      });
      await test.step(`Click the delete btn of ${pos} task`, async () => {
        let toDestroy = await this.page.locator(`ul > li:nth-child(${pos}) .destroy`);
        await toDestroy.click();
      });
    });
  };

  changeTasksTab = async (tab) => {
    await test.step(`change to ${tab} tab`, async () => {
      switch (tab) {
        case 'Active':
          const active = await this.page.getByText('Active', { exact: true });
          active.click();
          break;

        case 'Completed':
          const complete = await this.page.getByText('Completed', { exact: true });
          complete.click();
          break;
      }
    });
  };

  doubleClickTodo = async (todo) => {
    await test.step('double click on todo', async () => {
      await todo.dblclick();
    });
  };
  changeToDoDescription = async (todo, newDescription) => {
    await test.step('change todo description to ' + newDescription, async () => {
      await this.doubleClickTodo(todo);
      await this.fillTodo(todo, 'Edited Task');
      await this.page.keyboard.press('Enter');
    });
  };

  fillTodo = async (todo, x) => {
    await test.step('fill the todo input', async () => {
      await todo.locator(".edit").fill(x);
    });
  };

  selectToDo = async (pos) =>
    await test.step('click the select btn', async () => {
      await this.page.locator(`ul li:nth-child(${pos}) .toggle`).click();
    });
}

module.exports = Steps;
