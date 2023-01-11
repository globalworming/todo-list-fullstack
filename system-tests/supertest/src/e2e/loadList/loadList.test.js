import assert from 'assert';
import request from 'supertest';
import { createExampleList } from '../saveList/saveList.test';

describe('loading a todo list', () => {
  it('where list loads successfully', async (done) => {
    const name = `name${Date.now()}`;
    await createExampleList(name);
    await request('localhost:8080')
      .get(`/toDoLists/${name}`)
      .expect(200, {
        name,
        toDos: [{
          description: 'Feed Cat',
        }],
      });
    done();
  });

  it('where list does not exist', async (done) => {
    await request('localhost:8080')
      .get('/toDoLists/this-does-not-exist')
      .expect(400);
    done();
  });
});
