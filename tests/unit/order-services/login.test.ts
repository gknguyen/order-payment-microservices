import chai from 'chai';
import chaiHttp from 'chai-http';
import STATUS_CODE from 'http-status';
import VARIABLE from '../../../order-service/src/config/variable';
import MYSQL from '../../../order-service/src/database/mysql/mysql.main';
import orderServer from '../../../order-service/src/server';
import MOCK from '../../mock.data';

chai.use(chaiHttp);

describe('Unit test - Order service - login feature', () => {
  const orderName = 'test check';

  let orderId: number;

  describe('/api/auth/login', () => {
    before((done) => {
      // ENV.NODE_ENV = MOCK.ENV.NODE_ENV;
      // ENV.PORT = MOCK.ENV.PORT;
      // ENV.COOKIE.SECRET = MOCK.ENV.COOKIE_SECRET;
      // ENV.CRYPTO.SECRET = MOCK.ENV.CRYPTO_SECRET;
      // ENV.JWT.SECRET = MOCK.ENV.JWT_SECRET;
      // ENV.JWT.EXPIRES_IN = MOCK.ENV.JWT_EXPIRES_IN;
      // ENV.MOMENT.LOCALE = MOCK.ENV.MOMENT_LOCALE;
      // ENV.MOMENT.TIMEZONE = MOCK.ENV.MOMENT_TIMEZONE;
      // ENV.DATABASES.SQL.MYSQL.CONNECTION = MOCK.ENV.MYSQL_CONNECTION;

      /** create mock data in DB */
      MYSQL.order
        .findOrCreate({
          where: { name: orderName },
          defaults: { name: orderName },
        })
        .then((dataList) => {
          orderId = dataList[0].id;
          done();
        })
        .catch((err) => console.error(err));
    });

    describe('happy cases', () => {
      it('login successfully', (done) => {
        const loginUser = {
          username: 'admin',
          password: 'admin',
        };
        chai
          .request(orderServer)
          .post(MOCK.URL.ORDER_SERVICE.API.LOGIN)
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
          .post(MOCK.URL.ORDER_SERVICE.API.LOGIN)
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
          .post(MOCK.URL.ORDER_SERVICE.API.LOGIN)
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
          .post(MOCK.URL.ORDER_SERVICE.API.LOGIN)
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
          .post(MOCK.URL.ORDER_SERVICE.API.LOGIN)
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
          .post(MOCK.URL.ORDER_SERVICE.API.LOGIN)
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

  describe('test JWT', () => {
    it('JWT not found', (done) => {
      chai
        .request(orderServer)
        .get(`${MOCK.URL.ORDER_SERVICE.API.CHECK_ORDER_STATUS}?id=${orderId}`)
        .set('token', '')
        .end((err, res) => {
          if (err) console.error(err);
          chai.assert.equal(res.status, STATUS_CODE.UNAUTHORIZED);
          chai.assert.equal(res.text, VARIABLE.MESSAGES.TOKEN.NOT_FOUND);
          done();
        });
    });

    it('invalid JWT', (done) => {
      chai
        .request(orderServer)
        .get(`${MOCK.URL.ORDER_SERVICE.API.CHECK_ORDER_STATUS}?id=${orderId}`)
        .set('token', MOCK.JWT.INVALID)
        .end((err, res) => {
          if (err) console.error(err);
          chai.assert.equal(res.status, STATUS_CODE.UNAUTHORIZED);
          chai.assert.equal(res.text, VARIABLE.MESSAGES.TOKEN.PAYLOAD_INVALID);
          done();
        });
    });

    it('JWT contains incorrect data', (done) => {
      chai
        .request(orderServer)
        .get(`${MOCK.URL.ORDER_SERVICE.API.CHECK_ORDER_STATUS}?id=${orderId}`)
        .set('token', MOCK.JWT.INCORRECT_DATA)
        .end((err, res) => {
          if (err) console.error(err);
          chai.assert.equal(res.status, STATUS_CODE.UNAUTHORIZED);
          chai.assert.equal(res.text, VARIABLE.MESSAGES.TOKEN.DATA_INVALID);
          done();
        });
    });
  });
});
