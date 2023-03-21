import request from 'supertest';
import assert from 'assert';
import { createExampleList } from '../../steps.test';

describe('compliance.ToDo List', () => {
  describe('loading', () => {
    it('where list loads successfully', async () => {
      const name = `name${Date.now()}`;
      await createExampleList(name);
      await request(process.env.HOST)
        .get(`/toDoLists/${name}`)
        .expect(200)
        .then((response) => {
          assert(response.body.name === name);
          assert(response.body.toDos[0].description === 'Feed Cat');
        });
    });

    it('where list does not exist', async () => {
      await request(process.env.HOST)
        .get('/toDoLists/this-does-not-exist')
        .expect(400);
    });
  });
});
