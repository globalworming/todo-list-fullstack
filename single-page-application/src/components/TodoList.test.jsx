import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { HashRouter } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import { rest } from 'msw';
import { v4 as uuid } from 'uuid';
import TodoList from './TodoList';
import TodoListModel from '../model/ToDoList';
import ErrorDisplayBoundary from '../context/ErrorContext';
import server from '../setupTests';
import ToDo from '../model/ToDo';
import ShowsErrorFromContext from './ShowsErrorFromContext';
import ToDoListBoundary from '../context/ToDoListContext';

const user = userEvent.setup();
const todoList = (
  <HashRouter>
    <ErrorDisplayBoundary>
      <ShowsErrorFromContext />
      <ToDoListBoundary>
        <TodoList match={{ params: [] }} />
      </ToDoListBoundary>
    </ErrorDisplayBoundary>
  </HashRouter>
);

function expectListNameToBe(name) {
  expect(screen.getByText(name)).toBeInTheDocument();
}

function expectTheErrorContentToBe(text) {
  expect(screen.getByRole('alert')).toHaveTextContent(text);
}

async function changeListNameTo(name) {
  await user.click(screen.getByTestId('edit-name'));
  await user.keyboard('{Control>}A{/Control}');
  await user.keyboard(name);
  await user.keyboard('{Enter}');
}

async function addToDos(...items) {
  const input = screen.getByPlaceholderText('What needs to be done?');
  expect(input).toBeInTheDocument();
  await user.click(input);
  await act(async () => {
    for (const item of items) {
      await user.keyboard(`${item}{Enter}`);
    }
  });
}

describe('compliance.ToDo List', () => {
  describe('List Name', () => {
    it('can be changed', async () => {
      render(todoList);
      expectListNameToBe('todos');
      await changeListNameTo('my list');
      expectListNameToBe('my list');
    });
  });
  describe('ToDo Items', () => {
    it('can be added', async () => {
      render(todoList);
      await addToDos('feed cat', 'feed dog');
      expect(screen.getByTestId('count')).toHaveTextContent('2 items left');
    });
  });
  describe('Save List', () => {
    it('shows error when no items', async () => {
      render(todoList);
      await user.click(screen.getByTestId('save-list'));
      await waitFor(() => {
        expectTheErrorContentToBe('toDo list has no items.');
      });
    });

    // FIXME name
    it('can be added', async () => {
      server.use(
        rest.post(`${process.env.REACT_APP_GATEWAY}/toDoLists`, async (req, res, ctx) => {
          const json = await req.json();
          if (json.name !== 'todos') {
            return res(ctx.status(500), ctx.json({ message: 'bad request, wrong name' }));
          }
          if (json.toDos[0].description !== 'feed cat') {
            return res(ctx.status(500), ctx.json({ message: 'bad request, wrong description' }));
          }
          return res(ctx.status(200));
        }),
      );
      render(todoList);
      await addToDos('feed cat', 'feed dog');
      await user.click(screen.getByTestId('save-list'));
      await waitFor(() => {
        expect(screen.getByTestId('saved-list')).toBeInTheDocument();
      });
    });
  });
  describe('Load List', () => {
    it('ToDo Items can be loaded by name', async () => {
      server.use(
        rest.get(`${process.env.REACT_APP_GATEWAY}/toDoLists/my%20list`, (req, res, ctx) => res(ctx.status(200), ctx.json(
          new TodoListModel('my list', [new ToDo(uuid(), 'feed whale'), new ToDo(uuid(), 'feed dog')]),
        ))),
      );
      render(todoList);

      await act(async () => {
        await user.click(screen.getByTestId('load-list'));
        await user.keyboard('my list');
        await user.keyboard('{Enter}');
      });

      await waitFor(() => {
        expectListNameToBe('my list');
        expect(screen.getByTestId('count')).toHaveTextContent('2 items left');
        expect(screen.getByText('feed whale')).toBeInTheDocument();
      });
    });

    it('displays an error when no such list exists', async () => {
      server.use(
        rest.get(`${process.env.REACT_APP_GATEWAY}/toDoLists/does%20not%20exist`, (req, res, ctx) => res(ctx.status(400), ctx.json(
          { type: 'StatusRuntimeException', message: 'NOT_FOUND: no such list' },
        ))),
      );
      render(todoList);

      await act(async () => {
        await user.click(screen.getByTestId('load-list'));
        await user.keyboard('does not exist');
        await user.keyboard('{Enter}');
      });

      await waitFor(() => {
        expectTheErrorContentToBe('No list of that name found.');
      });
    });
  });
});
