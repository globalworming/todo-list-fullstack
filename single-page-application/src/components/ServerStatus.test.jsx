import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import ServerStatus from './ServerStatus';

const server = setupServer(
  rest.get('/health', (req, res, ctx) => res(ctx.status(200))),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('initial render shows no data yet', async () => {
  render(<ServerStatus url="/health" />);

  expect(screen.getByRole('status')).toHaveTextContent('-');
});

test('server ok response shows ok', async () => {
  render(<ServerStatus url="/health" />);

  await waitFor(() => {
    expect(screen.getByRole('status')).toHaveTextContent('ok');
  });
});

test('connection error shows error', async () => {
  server.use(
    rest.get('/health', (req, res, ctx) => res(ctx.status(500))),
  );
  render(<ServerStatus url="/health" />);

  await waitFor(() => {
    expect(screen.getByRole('status')).toHaveTextContent('error');
  });
});
