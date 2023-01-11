import assert from 'assert';
import request from 'supertest';

export async function createExampleList(name) {
  await request('localhost:8080')
    .post('/toDoLists')
    .send({
      name,
      toDos: [{
        description: 'Feed Cat',
      }],
    })
    .set('Accept', 'application/json');
}

function thenSeeErrorWhenCreatingListWithSameName(randomName, done) {
  request('localhost:8080')
    .post('/toDoLists')
    .send({
      name: randomName,
      toDos: [{
        description: 'Feed Cat',
      }],
    })
    .set('Accept', 'application/json')
  // .expect('Content-Type', /json/)
    .expect(400)
    .then((response) => {
      assert(response.body.error === 'NAME_LIST_ALREADY_TAKEN', 'see message name already taken');
      done();
    });
}

describe('saving a todo list', () => {
  it('responds with "Bad Request" when list is empty', (done) => {
    request('localhost:8080')
      .post('/toDoLists')
      .send({
        name: 'some list',
        todoItem: [],
      })
      .set('Accept', 'application/json')
      .expect(400)
      .then((response) => {
        assert(response.body.error === 'EMPTY_LIST', 'list is empty error');
        // assert(response.body.services.find((it) => it.name === 'todo').serving, 'service todo ok');
        done();
      });
  });

  it('responds ok when list is created successfully', (done) => {
    request('localhost:8080')
      .post('/toDoLists')
      .send({
        name: 'some list',
        todoItem: [
          {
            description: 'feed the cat',
          },
        ],
      })
      .set('Accept', 'application/json')
    // .expect('Content-Type', /json/)
      .expect(200);
    done();
  });

  it('responds not ok when list already exists', async (done) => {
    const randomName = `some name ${Date.now()}`;
    await createExampleList(randomName);
    thenSeeErrorWhenCreatingListWithSameName(randomName, done);
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
