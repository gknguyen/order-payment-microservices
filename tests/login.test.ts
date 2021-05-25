import chai from 'chai';
import chaiHttp from 'chai-http';
import STATUS_CODE from 'http-status';
import VARIABLE from '../order-service/src/config/variable';
import orderServer from '../order-service/src/server';
import MOCK from './mock.data';

chai.use(chaiHttp);

describe('/api/auth/login', () => {
  describe('happy cases', () => {
    it('login successfully', (done) => {
      const loginUser = {
        username: 'admin',
        password: 'admin',
      };
      chai
        .request(orderServer)
        .post(MOCK.URL.LOGIN)
        .send(loginUser)
        .end((err, res) => {
          if (err) console.error(err);
          chai.assert.equal(res.status, STATUS_CODE.OK);
          chai.assert.equal(typeof res.body, 'object');
          chai.assert.equal(typeof res.body.token, 'string');
          done();
        });
    });
  });

  describe('unhappy cases - missing input', () => {
    it('missing username', (done) => {
      const loginUser = {
        username: null,
        password: 'admin',
      };
      chai
        .request(orderServer)
        .post(MOCK.URL.LOGIN)
        .send(loginUser)
        .end((err, res) => {
          if (err) console.error(err);
          chai.assert.equal(res.status, STATUS_CODE.PRECONDITION_FAILED);
          chai.assert.equal(res.text, VARIABLE.MESSAGES.HTTP.PARAMS.REQUIRED);
          done();
        });
    });

    it('missing password', (done) => {
      const loginUser = {
        username: 'admin',
        password: null,
      };
      chai
        .request(orderServer)
        .post(MOCK.URL.LOGIN)
        .send(loginUser)
        .end((err, res) => {
          if (err) console.error(err);
          chai.assert.equal(res.status, STATUS_CODE.PRECONDITION_FAILED);
          chai.assert.equal(res.text, VARIABLE.MESSAGES.HTTP.PARAMS.REQUIRED);
          done();
        });
    });

    it('missing both', (done) => {
      const loginUser = {
        username: null,
        password: null,
      };
      chai
        .request(orderServer)
        .post(MOCK.URL.LOGIN)
        .send(loginUser)
        .end((err, res) => {
          if (err) console.error(err);
          chai.assert.equal(res.status, STATUS_CODE.PRECONDITION_FAILED);
          chai.assert.equal(res.text, VARIABLE.MESSAGES.HTTP.PARAMS.REQUIRED);
          done();
        });
    });
  });

  describe('unhappy cases - unauthorized', () => {
    it('user not found', (done) => {
      const loginUser = {
        username: 'asdasdsadasd',
        password: 'admin',
      };
      chai
        .request(orderServer)
        .post(MOCK.URL.LOGIN)
        .send(loginUser)
        .end((err, res) => {
          if (err) console.error(err);
          chai.assert.equal(res.status, STATUS_CODE.UNAUTHORIZED);
          chai.assert.equal(res.text, VARIABLE.MESSAGES.AUTH.USER_NOT_FOUND);
          done();
        });
    });

    it('incorrect password', (done) => {
      const loginUser = {
        username: 'admin',
        password: 'asdasdsadasd',
      };
      chai
        .request(orderServer)
        .post(MOCK.URL.LOGIN)
        .send(loginUser)
        .end((err, res) => {
          if (err) console.error(err);
          chai.assert.equal(res.status, STATUS_CODE.UNAUTHORIZED);
          chai.assert.equal(res.text, VARIABLE.MESSAGES.AUTH.INCORRECT_PASSWORD);
          done();
        });
    });
  });
});
