import request from 'supertest';
import assert from 'assert';

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

export function thenSeeErrorWhenCreatingListWithSameName(randomName) {
  return request('localhost:8080')
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
    });
}
