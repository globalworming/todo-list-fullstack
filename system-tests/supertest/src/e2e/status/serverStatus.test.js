import assert from 'assert';
import request from 'supertest';

describe('checking backend health', () => {
  it('responds with ok', (done) => {
    request('http://localhost:8080')
      .get('/health')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        assert(response.body.services.find((it) => it.name === 'bff').serving, 'service bff ok');
        assert(response.body.services.find((it) => it.name === 'todo').serving, 'service todo ok');
        done();
      });
  });
});
