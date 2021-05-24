import express from 'express';
import { verifyToken } from './auth/auth.routes';
import paymentRouter from './payment/payment.routes';

const apiRouter = express.Router();

apiRouter.use('/payment', verifyToken(), paymentRouter);

export default apiRouter;
