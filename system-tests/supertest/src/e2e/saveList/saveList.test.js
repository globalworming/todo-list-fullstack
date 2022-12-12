import assert from 'assert';
import request from 'supertest';

describe('saving a todo list', () => {
  it('response with "Bad Request" when list is empty', (done) => {
    request('https://bff-fg5blhx72q-ey.a.run.app')
      .post('/toDoLists')
      .send({
        name: 'some list',
        todoItem: [],
      })
      .set('Accept', 'application/json')
      .expect(400)
      .then((response) => {
        assert(response.body.error === 'EMPTY_LIST', 'list is empty error');
        done();
      });
  });

  it('responds ok when list is created sucessfully', (done) => {
    request('https://bff-fg5blhx72q-ey.a.run.app')
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
      .expect(200)
      .end(done);
  });
});
