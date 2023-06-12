import assert from 'assert';
import request from 'supertest';

describe('compliance.Auth', () => {
  describe('mock auth flow', () => {
    it('redirects to ', (done) => {
      request(process.env.HOST)
        .get('/auth?mockUserId=tammy')
        .set('Accept', 'application/json')
        .expect(308)
        .then((response) => {
          assert(response.headers.location === 'http://localhost:3000/?code=tammy_code');
          done();
        });
    });

    it('exchanges code for access token ', (done) => {
      request(process.env.HOST)
        .post('/auth')
        .send({
          accessCode: 'tammy_code',
        })
        .set('Accept', 'application/json')
        .expect(200)
        .then((response) => {
          assert(response.body.accessToken === 'tammy_token');
          done();
        });
    });

    it('gives user info', (done) => {
      request(process.env.HOST)
        .get('/me')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer tammy_token')
        .expect(200)
        .then((response) => {
          assert(response.body.name === 'tammy');
          assert(response.body.id === 'tammy_id');
          done();
        });
    });
  });
});
