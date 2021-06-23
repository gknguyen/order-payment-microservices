import chai from 'chai';
import chaiHttp from 'chai-http';
import STATUS_CODE from 'http-status';
import MONGO from '../../../order-service/src/database/mongo.main';
import { PaymentStatus } from '../../../payment-service/src/config/enum';
import { Order } from '../../../payment-service/src/database/mongoDB/mongo.form';
import paymentServer from '../../../payment-service/src/server';
import MOCK from '../../mock.data';

chai.use(chaiHttp);

describe('Unit test - Payment service - verify JWT feature', () => {
  const orderName = 'test check';
  let order: Order;

  before((done) => {
    MONGO.order.findOneAndUpdate(
      { name: orderName },
      { name: orderName },
      { new: true, upsert: true, setDefaultsOnInsert: true },
      (err, res) => {
        if (err) console.error(err);
        else {
          order = res;
          done();
        }
      },
    );
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

  it('JWT expired', (done) => {
    chai
      .request(paymentServer)
      .get(MOCK.URL.PAYMENT_SERVICE.API.PROCESS_ORDER)
      .set('token', MOCK.JWT.EXPIRED)
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
