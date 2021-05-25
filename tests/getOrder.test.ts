import chai from 'chai';
import chaiHttp from 'chai-http';
import STATUS_CODE from 'http-status';
import { OrderStatus } from '../order-service/src/config/enum';
import VARIABLE from '../order-service/src/config/variable';
import MYSQL from '../order-service/src/database/mysql/mysql.main';
import orderServer from '../order-service/src/server';
import MOCK from './mock.data';

chai.use(chaiHttp);

describe('/api/order/checkOrderStatus', () => {
  const orderName = 'test check';

  let orderId: number;
  let TOKEN: string;

  before((done) => {
    const loginUser = {
      username: 'admin',
      password: 'admin',
    };
    chai
      .request(orderServer)
      .post(MOCK.URL.LOGIN)
      .send(loginUser)
      .end(async (err, res) => {
        if (err) console.error(err);

        /** get JWT */
        TOKEN = await res.body.token;

        /** create mock data in DB */
        const dataList = await MYSQL.order.findOrCreate({
          where: { name: orderName },
          defaults: { name: orderName },
        });
        orderId = dataList[0].id;

        done();
      });
  });

  describe('happy cases', () => {
    it('get data successfully', (done) => {
      chai
        .request(orderServer)
        .get(`${MOCK.URL.CHECK_ORDER_STATUS}?id=${orderId}`)
        .set('token', TOKEN)
        .end((err, res) => {
          if (err) console.error(err);
          chai.assert.equal(res.status, STATUS_CODE.OK);
          chai.assert.equal(typeof res.text, 'string');
          chai.assert.equal(res.text, OrderStatus.created);
          done();
        });
    });
  });

  describe('unhappy cases - missing input', () => {
    it('missing id', (done) => {
      chai
        .request(orderServer)
        .get(MOCK.URL.CHECK_ORDER_STATUS)
        .set('token', TOKEN)
        .end((err, res) => {
          if (err) console.error(err);
          chai.assert.equal(res.status, STATUS_CODE.PRECONDITION_FAILED);
          chai.assert.equal(res.text, VARIABLE.MESSAGES.HTTP.PARAMS.REQUIRED);
          done();
        });
    });
  });

  describe('unhappy cases - invalid input', () => {
    it('invalid id', (done) => {
      chai
        .request(orderServer)
        .get(`${MOCK.URL.CHECK_ORDER_STATUS}?id=${1000000}`)
        .set('token', TOKEN)
        .end((err, res) => {
          if (err) console.error(err);
          chai.assert.equal(res.status, STATUS_CODE.NO_CONTENT);
          chai.assert.equal(res.text, '');
          done();
        });
    });
  });
});
