const supertest = require('supertest');
const { app, port } = require('../server');
const route = require('./../src/routes/route');

// Do not chanche test order !!!!
// Test order is very important !!!
describe('server.test.js', function() {
  this.timeout(10000);

  let server;
  let request;
  const register = route.api + route.register;
  const login = route.api + route.login;
  const profile = route.api + route.profile;

  before(done => {
    server = app.listen(port, () => {
      console.log(`Listening on http://localhost:${port}`);
      request = supertest.agent(server);
      done();
    });
  });

  after(done => {
    server.close(() => {
      console.log('Server Closed');
      done();
    });
  });

  it('Should error 404', done => {
    request
      .get('/qwertz')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(404, done);
  });

  /*it(`[${register}] Should answer`, done => {
    request
      .post(register)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        password: '1'
      })
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200, done);
  });

  it(`[${login}] Should answer`, done => {
    request
      .post(login)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({})
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200, done);
  });

  it(`[${profile}] Should answer`, done => {
    request
      .get(profile)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({})
      .expect('Content-Type', 'text/plain; charset=utf-8')
      .expect(401, done);
  });*/
});
