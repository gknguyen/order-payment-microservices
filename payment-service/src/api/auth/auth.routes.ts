import express from 'express';
import STATUS_CODE from 'http-status';
import jsonwebtoken from 'jsonwebtoken';
import { PaymentStatus } from '../../config/enum';
import errorHandler from '../../config/error.handler';
import { UserInfo } from '../../config/type';
import VARIABLE from '../../config/variable';
import mongodb from '../../database/mongo.auth';
import { User } from '../../database/mongo.form';

/** ================================================================================== */
/**
functions
*/

export function verifyToken() {
  const result = { ...VARIABLE.RESULT, function: 'verifyToken()' };
  return errorHandler(
    result,
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      /** get data in request header */
      const token = req.headers.token as string;

      /** check token existed or not */
      if (token) {
        /** decode token to get user data */
        const decodedToken = jsonwebtoken.decode(token, { complete: true });
        const userInfo: UserInfo | null | undefined = decodedToken?.payload;

        if (userInfo) {
          /** check token TTL */
          const TTL = Math.round(new Date().getTime() / 1000);

          if (decodedToken && parseInt(decodedToken.payload.exp) > TTL) {
            /** get user data in token is existed in DB */
            const user = await mongodb.db.collection('users').findOne<User>({
              // _id: userInfo.id,
              username: userInfo.username,
            });

            /** continues the execution if pass */
            if (user) next();
            else {
              result.code = STATUS_CODE.UNAUTHORIZED;
              throw PaymentStatus.declined;
            }
          } else {
            result.code = STATUS_CODE.UNAUTHORIZED;
            throw PaymentStatus.declined;
          }
        } else {
          result.code = STATUS_CODE.UNAUTHORIZED;
          throw PaymentStatus.declined;
        }
      } else {
        result.code = STATUS_CODE.UNAUTHORIZED;
        throw PaymentStatus.declined;
      }
    },
  );
}
