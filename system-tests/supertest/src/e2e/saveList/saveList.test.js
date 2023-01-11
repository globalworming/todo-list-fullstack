import assert from 'assert';
import request from 'supertest';
import { createExampleList, thenSeeErrorWhenCreatingListWithSameName } from '../steps.test';

describe('saving a todo list', () => {
  it('responds with "Bad Request" when list is empty', (done) => {
    request('localhost:8080')
      .post('/toDoLists')
      .send({
        name: 'some list',
        toDos: [],
      })
      .set('Accept', 'application/json')
      .expect(400)
      .then((response) => {
        assert(response.body.message === 'error validating ToDoList');
        done();
      });
  });

  it('responds ok when list is created successfully', (done) => {
    request('localhost:8080')
      .post('/toDoLists')
      .send({
        name: 'some list',
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

  it('responds not ok when list already exists', async (done) => {
    const randomName = `some name ${Date.now()}`;
    await createExampleList(randomName);
    thenSeeErrorWhenCreatingListWithSameName(randomName)
      .then(done);
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
