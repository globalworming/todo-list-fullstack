// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import { setupServer } from 'msw/node';
// eslint-disable-next-line import/no-extraneous-dependencies
import { rest } from 'msw';

process.env.REACT_APP_GATEWAY = 'http://localhost:3000';

const server = setupServer(
  rest.get(`${process.env.REACT_APP_GATEWAY}/health`, (req, res, ctx) => res(ctx.body(JSON.stringify({
    services: [
      { name: 'bff', serving: false },
      { name: 'todo-service', serving: true },
    ],
  })))),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

export default server;
