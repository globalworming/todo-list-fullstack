import assert from 'assert';
import request from 'supertest';

describe('saving a todo list', () => {
  it('responds with "Bad Request" when list is empty', (done) => {
    request('https://bff-fg5blhx72q-ey.a.run.app')
      .post('/toDoLists')
      .send({
        name: 'some list',
        todoItem: [],
      })
      .set('Accept', 'application/json')
      .expect(400)
      .then((response) => {
        assert(response.body.error === "EMPTY_LIST",'list is empty error');
        //assert(response.body.services.find((it) => it.name === 'todo').serving, 'service todo ok');
        done();
    });
  });

    it('responds ok when list is created successfully', (done) => {
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
            //.expect('Content-Type', /json/)
            .expect(200)
        done();
    });
});

it('responds not ok when list already exists', (done) => {
    request('https://bff-fg5blhx72q-ey.a.run.app')
        .post('/toDoLists')
        .send({
            name: 'name already',
            todoItem: [],
        })
        .set('Accept', 'application/json')
        //.expect('Content-Type', /json/)
        .expect(400)
        .then((response) => {
            assert(response.body.error === 'NAME_LIST_ALREADY_TAKEN','see message name already taken');
            //assert(response.body.services.find((it) => it.name === 'todo').serving, 'service todo ok');
        .end(done);

        });
});


//{
//   "message":"error",
//   "code":1,
//   "type": "EMPTY_LIST_NOT_ALLOWED",
//   "fields" : [
//
//        "item": "error_empty";
//
//   ],
//}
