import request from 'supertest';
import assert from 'assert';

export async function createExampleList(name) {
  await request(process.env.HOST)
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
  return request(process.env.HOST)
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
      assert(response.body.errors[0].error === 'alreadyexists', 'name already taken');
    });
}
