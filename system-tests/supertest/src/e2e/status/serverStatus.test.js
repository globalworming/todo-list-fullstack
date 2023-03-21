import assert from 'assert';
import request from 'supertest';

describe('compliance.Server Status', () => {
  describe('checking backend health', () => {
    it('responds with ok', (done) => {
      request(process.env.HOST)
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
});
