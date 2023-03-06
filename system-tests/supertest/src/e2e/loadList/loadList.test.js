import request from 'supertest';
import assert from 'assert';
import { createExampleList } from '../../steps.test';

describe('loading a todo list', () => {
  it('where list loads successfully', async () => {
    const name = `name${Date.now()}`;
    await createExampleList(name);
    await request('localhost:8080')
      .get(`/toDoLists/${name}`)
      .expect(200)
      .then((response) => {
        assert(response.body.name === name);
        assert(response.body.toDos[0].description === 'Feed Cat');
      });
  });

  it('where list does not exist', async () => {
    await request('localhost:8080')
      .get('/toDoLists/this-does-not-exist')
      .expect(400);
  });
});
