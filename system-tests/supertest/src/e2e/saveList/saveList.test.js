import assert from 'assert';
import request from 'supertest';
import { createExampleList, thenSeeErrorWhenCreatingListWithSameName } from '../../steps.test';

describe('compliance.ToDo List', () => {
  describe('saving', () => {
    it('responds with "Bad Request" when list is empty', (done) => {
      request(process.env.HOST)
        .post('/toDoLists')
        .send({
          name: 'some list',
          toDos: [],
        })
        .set('Accept', 'application/json')
        .expect(400)
        .then((response) => {
          assert(response.body.message === 'error validating ToDoList');
          assert(response.body.errors[0].path === '$.toDos');
          done();
        });
    });

    it('responds ok when list is created successfully', (done) => {
      request(process.env.HOST)
        .post('/toDoLists')
        .send({
          name: `some list ${Date.now()}`,
          toDos: [
            {
              description: 'feed the cat',
            },
          ],
        })
        .set('Accept', 'application/json')
      // .expect('Content-Type', /json/)
        .expect(200)
        .end(done);
    });

    it('responds not ok when list already exists', async () => {
      const randomName = `some name ${Date.now()}`;
      await createExampleList(randomName);
      await thenSeeErrorWhenCreatingListWithSameName(randomName);
    });
  });
});

// {
//   "message":"error",
//   "code":1,
//   "type": "EMPTY_LIST_NOT_ALLOWED",
//   "fields" : [
//
//        "item": "error_empty";
//
//   ],
// }
