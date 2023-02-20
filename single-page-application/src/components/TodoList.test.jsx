import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { HashRouter } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import { rest } from 'msw';
import TodoList from './TodoList';
import ErrorDisplayBoundary from '../context/ErrorContext';
import server from '../setupTests';

const user = userEvent.setup();
const todoList = (
  <HashRouter>
    <ErrorDisplayBoundary>
      <TodoList match={{ params: [] }} />
    </ErrorDisplayBoundary>
  </HashRouter>
);

function ensureListNameIs(name) {
  expect(screen.getByText(name)).toBeInTheDocument();
}

async function changeListNameTo(name) {
  await user.click(screen.getByTestId('edit-name'));
  await user.keyboard('{Control>}A{/Control}');
  await user.keyboard(name);
  await user.keyboard('{Enter}');
}

test('where we change the list name', async () => {
  render(todoList);
  ensureListNameIs('todos');
  await changeListNameTo('my list');
  ensureListNameIs('my list');
});

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

test('where we add todo items', async () => {
  render(todoList);
  await addToDos('feed cat', 'feed dog');
  expect(screen.getByTestId('count')).toHaveTextContent('2 items left');
});

test('where we save a list', async () => {
  server.use(
    rest.post(`${process.env.REACT_APP_GATEWAY}/toDoLists`, (req, res, ctx) => res(ctx.status(200))),
  );
  render(todoList);
  await addToDos('feed cat', 'feed dog');
  await user.click(screen.getByTestId('save-list'));
  await waitFor(() => {
    expect(screen.getByTestId('saved-list')).toBeInTheDocument();
  });
});
