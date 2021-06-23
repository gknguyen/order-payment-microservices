import express from 'express';
import faker from 'faker';
import STATUS_CODE from 'http-status';
import { PaymentStatus } from '../../config/enum';
import errorHandler from '../../config/error.handler';
import VARIABLE from '../../config/variable';
import { Order } from '../../database/mongo.form';

const paymentRouter = express.Router();

paymentRouter.post('/processOrder', processOrder());

export default paymentRouter;

/** ================================================================================== */
/**
functions
*/

function processOrder() {
  const result = { ...VARIABLE.RESULT, function: 'processOrder()' };
  return errorHandler(result, (req: express.Request, res: express.Response) => {
    /** get data from request body */
    const order: Order | null | undefined = req.body.order;

    /** check input */
    if (order?._id && order?.name && order?.status) {
      /** send response to client-side (FE) */
      if (faker.datatype.number() % 2 === 0)
        res.status(STATUS_CODE.OK).send(PaymentStatus.confirmed);
      else res.status(STATUS_CODE.EXPECTATION_FAILED).send(PaymentStatus.declined);
    } else {
      result.code = STATUS_CODE.PRECONDITION_FAILED;
      throw PaymentStatus.declined;
    }
  });
}
