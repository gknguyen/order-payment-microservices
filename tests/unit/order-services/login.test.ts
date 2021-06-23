import chai from 'chai';
import chaiHttp from 'chai-http';
import STATUS_CODE from 'http-status';
import VARIABLE from '../../../order-service/src/config/variable';
import MONGO from '../../../order-service/src/database/mongo.main';
import orderServer from '../../../order-service/src/server';
import MOCK from '../../mock.data';

chai.use(chaiHttp);

describe('Unit test - Order service - login feature', () => {
  const orderName = 'test check';

  // let orderId: number;
  let orderId: string;

  describe('/api/auth/login', () => {
    before((done) => {
      /** create mock data in DB */
      MONGO.order.findOneAndUpdate(
        { name: orderName },
        { name: orderName },
        { new: true, upsert: true, setDefaultsOnInsert: true },
        (err, res) => {
          if (err) console.error(err);
          else {
            orderId = res._id;
            done();
          }
        },
      );
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

    it('JWT expired', (done) => {
      chai
        .request(orderServer)
        .get(`${MOCK.URL.ORDER_SERVICE.API.CHECK_ORDER_STATUS}?id=${orderId}`)
        .set('token', MOCK.JWT.EXPIRED)
        .end((err, res) => {
          if (err) console.error(err);
          chai.assert.equal(res.status, STATUS_CODE.UNAUTHORIZED);
          chai.assert.equal(res.text, VARIABLE.MESSAGES.TOKEN.EXPIRED);
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
