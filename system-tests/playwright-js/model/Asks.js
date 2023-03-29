import { test } from '@playwright/test';
import ToDoList from './ToDoList';

class Asks {
  constructor(page) {
    this.page = page;
  }

  forCurrentNumberOfTodos = async () =>
    await test.step(`ask for current number of todos`, async () => {
      return await this.page.locator(ToDoList.items).count();
    });

  forContentOfTask = async (pos) =>
    await test.step(`ask for content of task`, async () => {
      return await this.page.locator(`.todo-list li:nth-child(${pos})`).textContent();
    });

  forOneTodo = async (pos) =>
    await test.step(`Select ${pos} todo`, async () => {
      return await this.page.locator(`.todo-list li:nth-child(${pos})`);
    });
}

module.exports = Asks;
