import axios from 'axios';
import express from 'express';
import STATUS_CODE from 'http-status';
import sequelize from 'sequelize';
import { OrderStatus, PaymentStatus } from '../../config/enum';
import ENV from '../../config/env';
import errorHandler from '../../config/error.handler';
import util from '../../config/util';
import VARIABLE from '../../config/variable';
import mysql from '../../database/mysql/mysql.auth';
import { Order } from '../../database/mysql/mysql.form';
import MYSQL from '../../database/mysql/mysql.main';

const orderRouter = express.Router();

/** get APIs */
orderRouter.get('/checkOrderStatus', checkOrderStatus());

/** post APIs */
orderRouter.post(
  '/createOrder',
  createOrder(),
  processPayment(),
  updateOrder(),
  deliverOrder(),
);

/** put APIs */
orderRouter.put('/cancelOrder', cancelOrder());

export default orderRouter;

/** ================================================================================== */
/**
functions
*/

function checkOrderStatus() {
  const result = { ...VARIABLE.RESULT, function: 'checkOrderStatus()' };
  return errorHandler(result, async (req: express.Request, res: express.Response) => {
    /** get data from request query */
    const orderId: string | null | undefined = req.query.id as string;

    /** check input */
    if (orderId) {
      /** call query to get data */
      const order = await MYSQL.order.findOne({
        attributes: ['id', 'status'],
        where: { id: orderId },
      });

      /** send response to client-side (FE) */
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      if (order) res.status(STATUS_CODE.OK).send(order.status);
      else res.status(STATUS_CODE.NO_CONTENT).send('');
    } else {
      result.code = STATUS_CODE.PRECONDITION_FAILED;
      throw VARIABLE.MESSAGES.HTTP.PARAMS.REQUIRED;
    }
  });
}

function createOrder() {
  const result = { ...VARIABLE.RESULT, function: 'createOrder()' };
  return errorHandler(
    result,
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      /** get data from request body */
      const orderName: string | null | undefined = req.body.name;

      /** transaction for handling error when modify multiple tables in 1 process */
      const transaction =
        (req.body.transaction as sequelize.Transaction) || (await mysql.transaction());
      if (!req.body.transaction) req.body.transaction = transaction;
      if (!result.transaction) result.transaction = transaction;

      /** check input */
      if (orderName) {
        /** call query to create data */
        const order = await MYSQL.order.create(
          {
            name: orderName,
          },
          { transaction: transaction },
        );

        /** continues the execution */
        req.body.order = order;
        next();
      } else {
        result.code = STATUS_CODE.PRECONDITION_FAILED;
        throw VARIABLE.MESSAGES.HTTP.PARAMS.REQUIRED;
      }
    },
  );
}

function processPayment() {
  const result = { ...VARIABLE.RESULT, function: 'processPayment()' };
  return errorHandler(
    result,
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      /** get data in request header */
      const token = req.headers.token as string;

      /** get data from request body */
      const order: Order | null | undefined = req.body.order;

      /** transaction for handling error when modify multiple tables in 1 process */
      const transaction =
        (req.body.transaction as sequelize.Transaction) || (await mysql.transaction());
      if (!req.body.transaction) req.body.transaction = transaction;
      if (!result.transaction) result.transaction = transaction;

      /** check input */
      if (order?.id) {
        /** send request to payment service */
        axios
          .post(
            'http://localhost:5000/api/payment/processOrder',
            { order },
            { headers: { token: token } },
          )
          .then((result) => {
            /** confirmed => continues the execution */
            req.query.id = order.id.toString();
            req.body.paymentStatus = result.data;
            next();
          })
          .catch(async (err) => {
            if (err.response?.status === STATUS_CODE.EXPECTATION_FAILED) {
              /** declined => continues the execution */
              req.query.id = order.id.toString();
              req.body.paymentStatus = err.response.data;
              next();
            } else {
              /** send response to client-side (FE) */
              await transaction.rollback();
              res.setHeader('Content-Type', 'text/plain; charset=utf-8');
              res
                .status(err.response?.status || STATUS_CODE.INTERNAL_SERVER_ERROR)
                .send(err.response?.data || '');
            }
          });
      } else {
        result.code = STATUS_CODE.PRECONDITION_FAILED;
        throw VARIABLE.MESSAGES.HTTP.PARAMS.REQUIRED;
      }
    },
  );
}

function updateOrder() {
  const result = { ...VARIABLE.RESULT, function: 'updateOrder()' };
  return errorHandler(
    result,
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      /** get data from request query */
      const orderId: string | null | undefined = req.query.id as string;

      /** get data from request body */
      const paymentStatus: PaymentStatus | null | undefined = req.body.paymentStatus;

      /** transaction for handling error when modify multiple tables in 1 process */
      const transaction =
        (req.body.transaction as sequelize.Transaction) || (await mysql.transaction());
      if (!req.body.transaction) req.body.transaction = transaction;
      if (!result.transaction) result.transaction = transaction;

      /** check input */
      if (orderId && paymentStatus) {
        /** get order status based on payment status */
        const orderStatus =
          paymentStatus === PaymentStatus.confirmed
            ? OrderStatus.confirmed
            : OrderStatus.cancelled;

        /** call query to update data */
        await MYSQL.order.update(
          {
            status: orderStatus,
          },
          {
            where: { id: orderId },
            transaction: transaction,
          },
        );

        /** send response to client-side (FE) */
        await transaction.commit();
        if (orderStatus === OrderStatus.confirmed)
          res.status(STATUS_CODE.OK).send(orderStatus);
        else res.status(STATUS_CODE.EXPECTATION_FAILED).send(orderStatus);

        /** if the order have been confirmed => continues the execution */
        if (orderStatus === OrderStatus.confirmed) next();
      } else {
        result.code = STATUS_CODE.PRECONDITION_FAILED;
        throw VARIABLE.MESSAGES.HTTP.PARAMS.REQUIRED;
      }
    },
  );
}

function deliverOrder() {
  const result = { ...VARIABLE.RESULT, function: 'deliverOrder()' };
  return errorHandler(result, (req: express.Request) => {
    /** get data from request query */
    const orderId = req.query.id as string;

    /** call query to update data */
    setTimeout(() => {
      MYSQL.order.update(
        {
          status: OrderStatus.delivered,
        },
        {
          where: { id: orderId },
        },
      );
    }, util.convertStringToNumber(ENV.DELIVERY_TIME) /** process run after Xs */);
  });
}

function cancelOrder() {
  const result = { ...VARIABLE.RESULT, function: 'cancelOrder()' };
  return errorHandler(result, (req: express.Request, res: express.Response) => {
    /** get data from request query */
    const orderId: string | null | undefined = req.query.id as string;

    /** check input */
    if (orderId) {
      /** call query to update date */
      MYSQL.order.update(
        {
          status: OrderStatus.cancelled,
        },
        {
          where: { id: orderId },
        },
      );

      /** send response to client-side (FE) */
      res.status(STATUS_CODE.OK).send(OrderStatus.cancelled);
    } else {
      result.code = STATUS_CODE.PRECONDITION_FAILED;
      throw VARIABLE.MESSAGES.HTTP.PARAMS.REQUIRED;
    }
  });
}
