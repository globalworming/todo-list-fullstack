import { setupServer } from 'msw/node';
import { rest } from 'msw';

process.env.REACT_APP_GATEWAY = 'http://localhost:3000';

const server = setupServer(
  rest.get('/health', (req, res, ctx) => res(ctx.body(JSON.stringify({
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
