import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { HashRouter } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import { rest } from 'msw';
import TodoList from './TodoList';
import server from './TestServer.test';
import ErrorDisplayBoundary from '../context/ErrorContext';

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

test('where we add todo items', async () => {
  render(todoList);
  const input = screen.getByPlaceholderText('What needs to be done?');
  expect(input).toBeInTheDocument();
  await user.click(input);
  await act(async () => {
    await user.keyboard('feed cat{Enter}');
    await user.keyboard('feed dog{Enter}');
  });
  expect(screen.getByTestId('count')).toHaveTextContent('2 items left');
});

test('where we save a list', async () => {
  server.use(
    rest.post(`${process.env.REACT_APP_GATEWAY}/toDoLists`, (req, res, ctx) => res(ctx.status(200))),
  );
  render(todoList);
  const input = screen.getByPlaceholderText('What needs to be done?');
  expect(input).toBeInTheDocument();
  await user.click(input);
  await act(async () => {
    await user.keyboard('feed cat{Enter}');
    await user.keyboard('feed dog{Enter}');
  });
  await user.click(screen.getByTestId('save-list'));
  await waitFor(() => {
    expect(screen.getByTestId('saved-list')).toBeInTheDocument();
  });
});
