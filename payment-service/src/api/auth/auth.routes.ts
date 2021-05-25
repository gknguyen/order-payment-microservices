import express from 'express';
import STATUS_CODE from 'http-status';
import jsonwebtoken from 'jsonwebtoken';
import errorHandler from '../../config/error.handler';
import { UserInfo } from '../../config/type';
import VARIABLE from '../../config/variable';
import MYSQL from '../../database/mysql/mysql.auth';
import mysql from 'mysql2';
import { PaymentStatus } from '../../config/enum';

/** ================================================================================== */
/**
functions
*/

export function verifyToken() {
  const result = { ...VARIABLE.RESULT, function: 'verifyToken()' };
  return errorHandler(
    result,
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
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
            MYSQL.query(
              VARIABLE.QUERIES.GET_USER_DATA,
              [userInfo.id, userInfo.username],
              (err, results) => {
                if (err) throw err;
                else {
                  const rowDataList = results as mysql.RowDataPacket[];
                  if (rowDataList && rowDataList.length > 0) next();
                  else {
                    result.code = STATUS_CODE.UNAUTHORIZED;
                    throw PaymentStatus.declined;
                  }
                }
              },
            );
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
