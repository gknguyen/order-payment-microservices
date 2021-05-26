import chai from 'chai';
import chaiHttp from 'chai-http';
import STATUS_CODE from 'http-status';
import { OrderStatus } from '../../order-service/src/config/enum';
import MOCK from '../mock.data';

chai.use(chaiHttp);

describe('Integration test - process order to payment', () => {
  const orderName = 'test create integration';
  let TOKEN: string;

  before((done) => {
    const loginUser = {
      username: 'admin',
      password: 'admin',
    };
    chai
      .request(MOCK.URL.ORDER_SERVICE.BASE)
      .post(MOCK.URL.ORDER_SERVICE.API.LOGIN)
      .send(loginUser)
      .end(async (err, res) => {
        if (err) console.error(err);
        /** get JWT */
        TOKEN = await res.body.token;
        done();
      });
  });

  it('process success', (done) => {
    chai
      .request(MOCK.URL.ORDER_SERVICE.BASE)
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
