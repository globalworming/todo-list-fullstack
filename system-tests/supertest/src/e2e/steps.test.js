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
      assert(response.body.message === 'ALREADY_EXISTS: entity already exists', 'see message name already taken');
    });
}
