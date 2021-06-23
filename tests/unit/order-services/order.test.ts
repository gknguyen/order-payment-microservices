import chai from 'chai';
import chaiHttp from 'chai-http';
import STATUS_CODE from 'http-status';
import { OrderStatus } from '../../../order-service/src/config/enum';
import VARIABLE from '../../../order-service/src/config/variable';
import MONGO from '../../../order-service/src/database/mongo.main';
import orderServer from '../../../order-service/src/server';
import MOCK from '../../mock.data';

chai.use(chaiHttp);

describe('Unit test - Order service - process order feature', () => {
  let TOKEN: string;

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
        done();
      });
  });

  describe('/api/order/checkOrderStatus', () => {
    const orderName = 'test check';
    // let orderId: number;
    let orderId: string;

    before((done) => {
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
      it('get data successfully', (done) => {
        chai
          .request(orderServer)
          .get(`${MOCK.URL.ORDER_SERVICE.API.CHECK_ORDER_STATUS}?id=${orderId}`)
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
          .get(MOCK.URL.ORDER_SERVICE.API.CHECK_ORDER_STATUS)
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
          .get(
            `${
              MOCK.URL.ORDER_SERVICE.API.CHECK_ORDER_STATUS
            }?id=${'60d2ac6ba69d7ed3ed5a03e4'}`,
          )
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

  describe('/api/order/createOrder', () => {
    const orderName = 'test create';

    describe('happy cases', () => {
      it('create order successfully', (done) => {
        chai
          .request(orderServer)
          .post(MOCK.URL.ORDER_SERVICE.API.CREATE_ORDER)
          .set('token', TOKEN)
          .send({ name: orderName })
          .end((err, res) => {
            if (err) console.error(err);
            chai.assert.notEqual(res.status, STATUS_CODE.NOT_FOUND);
            chai.assert.equal(typeof res.text, 'string');
            if (res.status === STATUS_CODE.OK)
              chai.assert.equal(res.text, OrderStatus.confirmed);
            else if (res.status === STATUS_CODE.EXPECTATION_FAILED)
              chai.assert.equal(res.text, OrderStatus.cancelled);
            done();
          });
      });
    });

    describe('unhappy cases - missing input', () => {
      it('missing order name', (done) => {
        chai
          .request(orderServer)
          .post(MOCK.URL.ORDER_SERVICE.API.CREATE_ORDER)
          .set('token', TOKEN)
          .send({ name: '' })
          .end((err, res) => {
            if (err) console.error(err);
            chai.assert.equal(res.status, STATUS_CODE.PRECONDITION_FAILED);
            chai.assert.equal(res.text, VARIABLE.MESSAGES.HTTP.PARAMS.REQUIRED);
            done();
          });
      });
    });

    after((done) => {
      MONGO.order.findOneAndDelete({ name: orderName }, undefined, (err) => {
        if (err) console.error(err);
        else done();
      });
    });
  });

  describe('/api/order/cancelOrder', () => {
    const orderName = 'test cancel';
    // let orderId: number;
    let orderId: string;

    before((done) => {
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
      it('cancel order successfully', (done) => {
        chai
          .request(orderServer)
          .put(`${MOCK.URL.ORDER_SERVICE.API.CANCEL_ORDER}?id=${orderId}`)
          .set('token', TOKEN)
          .end((err, res) => {
            if (err) console.error(err);
            chai.assert.equal(res.status, STATUS_CODE.OK);
            chai.assert.equal(res.text, OrderStatus.cancelled);
            done();
          });
      });
    });

    describe('unhappy cases - missing input', () => {
      it('missing order id', (done) => {
        chai
          .request(orderServer)
          .put(MOCK.URL.ORDER_SERVICE.API.CANCEL_ORDER)
          .set('token', TOKEN)
          .end((err, res) => {
            if (err) console.error(err);
            chai.assert.equal(res.status, STATUS_CODE.PRECONDITION_FAILED);
            chai.assert.equal(res.text, VARIABLE.MESSAGES.HTTP.PARAMS.REQUIRED);
            done();
          });
      });
    });

    after((done) => {
      MONGO.order.findOneAndDelete({ name: orderName }, undefined, (err) => {
        if (err) console.error(err);
        else done();
      });
    });
  });
});
