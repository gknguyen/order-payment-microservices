import express from 'express';
import authRouter, { verifyToken } from './auth/auth.routes';
import orderRouter from './order/order.routes';

const apiRouter = express.Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/order', verifyToken(), orderRouter);

export default apiRouter;
