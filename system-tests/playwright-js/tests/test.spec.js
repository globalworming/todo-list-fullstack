import { expect, test } from '@playwright/test';

let Steps = require('../model/Steps');
let Asks = require('../model/Asks');
let Ensure = require('../model/Ensure');

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
      await steps.createTodo('‎😃');
      const currentNumberOfToDos = await asks.forCurrentNumberOfTodos();
      const lastsTodosDescription = await asks.forContentOfTask(currentNumberOfToDos);
      await ensure.theTaskDescriptionIs(lastsTodosDescription, '‎😃');
    });

    test('Should be able to edit ToDos', async ({}) => {
      await steps.createTodo('Edit this task');
      const todo = await asks.forLastToDo();
      await steps.changeToDoDescription(todo, "Edited Task")
      await ensure.theDescriptionIs(todo, 'Edited Task');
    });

    test('Should be able to select ToDo', async ({}) => {
      await steps.createTodo('Select this task');
      const length = await asks.forCurrentNumberOfTodos();
      await steps.selectToDo(length);
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
      await ensure.theTaskContains(await asks.forTodoAt(await asks.forCurrentNumberOfTodos()), 'Active Task');
      await ensure.theUrlContains('/active');
    });

    test("Should be able to change to 'Completed' tab and show tasks", async ({}) => {
      await steps.createTodo('Completed Task');
      await steps.selectToDo(await asks.forCurrentNumberOfTodos());

      await steps.changeTasksTab('Completed');

      //Assertions
      await ensure.theTaskContains(await asks.forTodoAt(await asks.forCurrentNumberOfTodos()), 'Completed Task');
      await ensure.theUrlContains('/completed');
    });
  });
});
