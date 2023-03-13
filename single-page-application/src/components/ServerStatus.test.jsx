import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { rest } from 'msw';
import ServerStatus from './ServerStatus';
import server from '../setupTests';

const healthUrl = `${process.env.REACT_APP_GATEWAY}/health`;

describe('compliance.Server Status', () => {
  describe('initial state', () => {
    it('shows no data yet', async () => {
      render(<ServerStatus url={healthUrl} />);

      expect(screen.getByRole('status')).toHaveTextContent('-');
    });
  });
  describe('ok response', () => {
    it('shows ok', async () => {
      render(<ServerStatus url={healthUrl} />);

      await waitFor(() => {
        expect(screen.getByRole('status')).toHaveTextContent('ok');
      });
    });
  });

  describe('errors', () => {
    it('connection error shows not connected', async () => {
      server.use(
        rest.get(healthUrl, (req, res, ctx) => res(ctx.status(500))),
      );
      render(<ServerStatus url={healthUrl} />);

      await waitFor(() => {
        expect(screen.getByRole('status')).toHaveTextContent('disconnected');
      });
    });
    it('service error shows error', async () => {
      server.use(
        rest.get(healthUrl, (req, res, ctx) => res(ctx.body(JSON.stringify({
          services: [
            { name: 'bff', serving: true },
            { name: 'todo-service', serving: false },
          ],
        })))),
      );
      render(<ServerStatus url={healthUrl} />);

      await waitFor(() => {
        expect(screen.getByRole('status')).toHaveTextContent('bff ok');
        expect(screen.getByRole('status')).toHaveTextContent('todo-service error');
      });
    });
  });
});
