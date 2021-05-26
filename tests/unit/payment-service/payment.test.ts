import chai from 'chai';
import chaiHttp from 'chai-http';
import STATUS_CODE from 'http-status';
import MYSQL from '../../../order-service/src/database/mysql/mysql.main';
import orderServer from '../../../order-service/src/server';
import { PaymentStatus } from '../../../payment-service/src/config/enum';
import { Order } from '../../../payment-service/src/database/mysql/mysql.form';
import paymentServer from '../../../payment-service/src/server';
import MOCK from '../../mock.data';

chai.use(chaiHttp);

describe('Unit test - Payment service - process payment feature', () => {
  const orderName = 'test check';
  let TOKEN: string;
  let order: Order;

  before((done) => {
    const loginUser = {
      username: 'admin',
      password: 'admin',
    };
    chai
      .request(orderServer)
      .post(MOCK.URL.ORDER_SERVICE.API.LOGIN)
      .send(loginUser)
      .end(async (err, res) => {
        if (err) console.error(err);
        /** get JWT */
        TOKEN = await res.body.token;

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
  });

  describe('/api/payment/processOrder', () => {
    describe('happy cases', () => {
      it('process successfully', (done) => {
        chai
          .request(paymentServer)
          .post(MOCK.URL.PAYMENT_SERVICE.API.PROCESS_ORDER)
          .set('token', TOKEN)
          .send({ order: order })
          .end((err, res) => {
            if (err) console.error(err);
            chai.assert.notEqual(res.status, STATUS_CODE.NOT_FOUND);
            chai.assert.equal(typeof res.text, 'string');
            if (res.status === STATUS_CODE.OK)
              chai.assert.equal(res.text, PaymentStatus.confirmed);
            else if (res.status === STATUS_CODE.EXPECTATION_FAILED)
              chai.assert.equal(res.text, PaymentStatus.declined);
            done();
          });
      });
    });

    describe('unhappy cases - missing input', () => {
      it('missing order', (done) => {
        chai
          .request(paymentServer)
          .post(MOCK.URL.PAYMENT_SERVICE.API.PROCESS_ORDER)
          .set('token', TOKEN)
          .send({ order: null })
          .end((err, res) => {
            if (err) console.error(err);
            chai.assert.equal(res.status, STATUS_CODE.PRECONDITION_FAILED);
            chai.assert.equal(res.text, PaymentStatus.declined);
            done();
          });
      });
    });
  });
});
