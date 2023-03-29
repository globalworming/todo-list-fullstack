import { expect, test } from '@playwright/test';
import ToDoList from './ToDoList';

class Ensure {
  constructor(page) {
    this.page = page;
  }

  theCurrentNumberOfTodosIs = async (i) =>
    await test.step('ensure the number of todos is ' + i, async () => {
      await expect(this.page.locator(ToDoList.items)).toHaveCount(i);
    });

  theTaskDescriptionIs = async (cont, des) =>
    await test.step('ensure the task description is ' + des, async () => {
      await expect(cont).toEqual(des);
    });
  theCheckboxIsChecked = async (pos) => {
    await expect(this.page.locator(`li:nth-child(${pos}) .toggle `)).toBeChecked();
  };

  theTaskContains = async (element, x) => {
    await test.step(`ensure the task contains ${x}`, async () => {
      await expect(element).toContainText(x);
    });
  };

  theUrlContains = async (x) => {
    await test.step(`ensure the URL is ${x}`, async () => {
      await this.page.waitForNavigation();
      await expect(this.page.url()).toContain(x);
    });
  };
}

module.exports = Ensure;
