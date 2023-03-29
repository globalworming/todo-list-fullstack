import { expect, test } from '@playwright/test';

let Steps = require('../model/Steps');
let Asks = require('../model/Asks');
let Ensure = require('../model/Ensure');
test.describe.configure({ mode: 'serial' });

test.describe('Compliance', async () => {
  let page;
  let steps;
  let asks;
  let ensure;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto(`${process.env.BASE_URL}/`);
    steps = new Steps(page);
    asks = new Asks(page);
    ensure = new Ensure(page);
  });

  test.afterAll(async () => {
    await page.close();
  });

  test.describe('ToDoList', async () => {
    test('Should be able to create ToDos', async ({}) => {
      let length = await asks.forCurrentNumberOfTodos();
      await steps.createFiveTodos();
      await ensure.theCurrentNumberOfTodosIs(length + 5);
    });

    test('Should be able to create task with emojis', async () => {
      const length = await asks.forCurrentNumberOfTodos();
      await steps.createTodo('‎😃');

      //Assertions
      await ensure.theCurrentNumberOfTodosIs(length + 1);
      await ensure.theTaskDescriptionIs(await await asks.forContentOfTask(await asks.forCurrentNumberOfTodos()), '‎😃');
    });

    test('Should be able to edit ToDos', async ({}) => {
      await steps.createTodo('Edit this task');
      const length = await asks.forCurrentNumberOfTodos();

      await steps.doubleClickTodo(await asks.forOneTodo(length));

      await steps.fillTodo(length, 'Edited Task');
      await page.keyboard.press('Enter');

      //Assertions
      await ensure.theTaskDescriptionIs(await (await asks.forOneTodo(length)).textContent(), 'Edited Task');
    });

    test('Should be able to select ToDo', async ({}) => {
      await steps.createTodo('Select this task');
      const length = await asks.forCurrentNumberOfTodos();
      await steps.selectToDo(length);

      //Assertion
      await ensure.theCheckboxIsChecked(length);
    });

    test('Should not be able to add blank ToDos', async ({}) => {
      const length = await asks.forCurrentNumberOfTodos();
      await steps.createTodo('');

      //Assertion
      await expect(await asks.forCurrentNumberOfTodos()).not.toBeGreaterThan(length);
    });

    test('Should be able to delete ToDos', async ({}) => {
      await steps.createTodo('Delete this');
      const length = await asks.forCurrentNumberOfTodos();
      await steps.deleteTodo(1);

      //Assertion
      await ensure.theCurrentNumberOfTodosIs(length - 1);
    });

    test("Should be able to change to 'Active' tab and show tasks", async ({}) => {
      await steps.createTodo('Active Task');

      await steps.changeTasksTab('Active');

      //Assertions
      await ensure.theTaskContains(await asks.forOneTodo(await asks.forCurrentNumberOfTodos()), 'Active Task');
      await ensure.theUrlContains('/active');
    });

    test("Should be able to change to 'Completed' tab and show tasks", async ({}) => {
      await steps.createTodo('Completed Task');
      await steps.selectToDo(await asks.forCurrentNumberOfTodos());

      await steps.changeTasksTab('Completed');

      //Assertions
      await ensure.theTaskContains(await asks.forOneTodo(await asks.forCurrentNumberOfTodos()), 'Completed Task');
      await ensure.theUrlContains('/completed');
    });
  });
});
