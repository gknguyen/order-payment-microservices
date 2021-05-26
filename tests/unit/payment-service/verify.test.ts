import chai from 'chai';
import chaiHttp from 'chai-http';
import STATUS_CODE from 'http-status';
import MYSQL from '../../../order-service/src/database/mysql/mysql.main';
import { PaymentStatus } from '../../../payment-service/src/config/enum';
import { Order } from '../../../payment-service/src/database/mysql/mysql.form';
import paymentServer from '../../../payment-service/src/server';
import MOCK from '../../mock.data';

chai.use(chaiHttp);

describe('Unit test - Payment service - verify JWT feature', () => {
  const orderName = 'test check';
  let order: Order;

  before((done) => {
    MYSQL.order
      .findOrCreate({
        where: { name: orderName },
        defaults: { name: orderName },
      })
      .then((dataList) => {
        order = dataList[0];
        done();
      })
      .catch((err) => console.error(err));
  });

  it('JWT not found', (done) => {
    chai
      .request(paymentServer)
      .post(MOCK.URL.PAYMENT_SERVICE.API.PROCESS_ORDER)
      .set('token', '')
      .send({ order: order })
      .end((err, res) => {
        if (err) console.error(err);
        chai.assert.equal(res.status, STATUS_CODE.UNAUTHORIZED);
        chai.assert.equal(res.text, PaymentStatus.declined);
        done();
      });
  });

  it('invalid JWT', (done) => {
    chai
      .request(paymentServer)
      .post(MOCK.URL.PAYMENT_SERVICE.API.PROCESS_ORDER)
      .set('token', MOCK.JWT.INVALID)
      .end((err, res) => {
        if (err) console.error(err);
        chai.assert.equal(res.status, STATUS_CODE.UNAUTHORIZED);
        chai.assert.equal(res.text, PaymentStatus.declined);
        done();
      });
  });

  it('JWT contains incorrect data', (done) => {
    chai
      .request(paymentServer)
      .get(MOCK.URL.PAYMENT_SERVICE.API.PROCESS_ORDER)
      .set('token', MOCK.JWT.INCORRECT_DATA)
      .end((err, res) => {
        if (err) console.error(err);
        chai.assert.equal(res.status, STATUS_CODE.UNAUTHORIZED);
        chai.assert.equal(res.text, PaymentStatus.declined);
        done();
      });
  });
});
