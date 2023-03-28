import { expect, test } from "@playwright/test";

let ToDoListPage = require("../model/toDoList.page");
test.describe.configure({ mode: "serial" });

test.describe("Compliance", async () => {
  let page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    ToDoListPage = new ToDoListPage(page);
    await ToDoListPage.navigate("#/");
  });

  test.afterAll(async () => {
    await page.close();
  });

  test.describe("ToDoList", async () => {
    test("Should be able to create ToDos", async ({}) => {
      let length = await ToDoListPage.getListLength();
      await test.step("Create five new tasks", async () => {
        for (let i = 1; i < 6; i++) {
          await ToDoListPage.createToDo("ToDo " + i);
        }
      });
      await test.step("Check if the task were added successfully", async () => {
        await expect(ToDoListPage.toDoList).toHaveCount(length + 5);
      });
    });

    test("Should be able to create task with emojis", async () => {
      const length = await ToDoListPage.getListLength();
      await ToDoListPage.createToDo("‎😃");

      test.step("", async () => {
        await expect(await ToDoListPage.getListLength()).toBeGreaterThan(
          length
        );
      });
    });

    test("Should be able to edit ToDos", async ({}) => {
      await test.step("", async () => {
        await ToDoListPage.createToDo("Just a task");
      });
      const task = await ToDoListPage.getTask(
        await ToDoListPage.getListLength()
      );

      await test.step("Double click to edit", async () => {
        await task.dblclick();
      });
      await test.step("Fill the new task name", async () => {
        await page.fill(
          `.todo-list >li:nth-child(${await ToDoListPage.getListLength()}) .edit`,
          "Edited task"
        );
        await page.keyboard.press("Enter");
      });
      const editedtask = await ToDoListPage.getTask(
        await ToDoListPage.getListLength()
      );

      await test.step("Verify if the task was edited successfully", async () => {
        //Assertions
        expect(await editedtask.textContent()).toBe("Edited task");
      });
    });

    test("Should be able to select ToDo", async ({}) => {
      await ToDoListPage.createToDo("Selected Task 1");
      await ToDoListPage.selectToDo(await ToDoListPage.getListLength());
      await test.step("Check the task checkbox", async () => {
        await expect(
          page.locator(
            `li:nth-child(${await ToDoListPage.getListLength()}) .toggle `
          )
        ).toBeChecked();
      });
    });

    // !!DOESN'T HAVE "select all" btn
    /* test('Should be able to select ALL ToDos', async ({  }) => {
            await ToDoListPage.createToDo('Toggle 1')
            await ToDoListPage.createToDo('Toggle 2')
            await ToDoListPage.toggleAll()
            let checkboxes= page.locator(".toggle")
            let checked=true;
            for (let i=0; i<=ToDoListPage.getListLength();i++){
             if (!checkboxes[i].checked) checked=false;
            }
            await expect(checked).toBeTruthy();
           });*/

    test("Should not be able to add blank ToDos", async ({}) => {
      const length = await ToDoListPage.getListLength();
      await ToDoListPage.createToDo("");
      test.step("Check if the blank ToDo was added", async () => {
        await expect(await ToDoListPage.getListLength()).not.toBeGreaterThan(
          length
        );
      });
    });

    test("Should be able to delete ToDos", async ({}) => {
      const length = await ToDoListPage.getListLength();
      await ToDoListPage.deleteToDo(1);
      await test.step("Check if the task was deleted successfully", async () => {
        await expect(ToDoListPage.toDoList).toHaveCount(length - 1);
      });
    });

    test("Should be able to change to 'Active' tab and show tasks", async ({}) => {
      await test.step("Create the Task", async () => {
        await ToDoListPage.createToDo("Active Task");
      });

      await test.step('Change to "Active" tab', async () => {
        await ToDoListPage.active.click();
      });

      //Assertions
      await test.step("Verify the task", async () => {
        await expect(
          await ToDoListPage.getTask(await ToDoListPage.getListLength())
        ).toContainText("Active Task");
      });
      await test.step('Verify that is the "Active" tab', async () => {
        await expect(page.url()).toContain("/active");
      });
    });

    test("Should be able to change to 'Completed' tab and show tasks", async ({}) => {
      await test.step("Create the Task", async () => {
        await ToDoListPage.createToDo("Completed Task");
      });

      const completedTask = await ToDoListPage.getTask(
        await ToDoListPage.getListLength()
      );
      console.log(
        "The complete task is: " + (await completedTask.textContent())
      );

      await test.step('Select the task to move to "Completed" tab', async () => {
        await ToDoListPage.selectToDo(await ToDoListPage.getListLength());
      });
      await test.step('Change to "Completed" tab', async () => {
        await ToDoListPage.complete.click();
      });
      //Assertions
      await test.step("Verify the task", async () => {
        await expect(
          await ToDoListPage.getTask(await ToDoListPage.getListLength())
        ).toContainText("Completed Task");
      });
      await test.step('Verify that is the "Completed" tab', async () => {
        await expect(page.url()).toContain("/completed", { timeout: 2000 });
      });
    });
  });
});
