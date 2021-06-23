import express from 'express';
import STATUS_CODE from 'http-status';
import jsonwebtoken from 'jsonwebtoken';
import errorHandler from '../../config/error.handler';
import { UserInfo } from '../../config/type';
import VARIABLE from '../../config/variable';
import MONGO from '../../database/mongo.main';
import authService from './auth.services';

const authRouter = express.Router();

/** post APIs */
authRouter.post('/login', login());

export default authRouter;

/** ================================================================================== */
/**
functions
*/

function login() {
  const result = { ...VARIABLE.RESULT, function: 'login()' };
  return errorHandler(result, async (req: express.Request, res: express.Response) => {
    /** get data in request body */
    const loginUsername: string | null | undefined = req.body.username;
    const loginPassword: string | null | undefined = req.body.password;

    /** check input */
    if (loginUsername && loginPassword) {
      /** call query to get user infomation */
      const user = await MONGO.user.findOne(
        {
          username: loginUsername,
        },
        ['username', 'password'],
      );

      /** check if user existed or not */
      if (user) {
        /** check password */
        if (authService.comparePassword(loginPassword, user.password)) {
          /** get JWT */
          const token = authService.getToken(user);

          /** send responses to client-side */
          res.status(STATUS_CODE.OK).send({ token: token });
        } else {
          result.code = STATUS_CODE.UNAUTHORIZED;
          throw VARIABLE.MESSAGES.AUTH.INCORRECT_PASSWORD;
        }
      } else {
        result.code = STATUS_CODE.UNAUTHORIZED;
        throw VARIABLE.MESSAGES.AUTH.USER_NOT_FOUND;
      }
    } else {
      result.code = STATUS_CODE.PRECONDITION_FAILED;
      throw VARIABLE.MESSAGES.HTTP.PARAMS.REQUIRED;
    }
  });
}

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
            const user = await MONGO.user.findOne(
              {
                _id: userInfo.id,
                username: userInfo.username,
              },
              ['username'],
            );

            /** continues the execution if pass */
            if (user) next();
            else {
              result.code = STATUS_CODE.UNAUTHORIZED;
              throw VARIABLE.MESSAGES.TOKEN.DATA_INVALID;
            }
          } else {
            result.code = STATUS_CODE.UNAUTHORIZED;
            throw VARIABLE.MESSAGES.TOKEN.EXPIRED;
          }
        } else {
          result.code = STATUS_CODE.UNAUTHORIZED;
          throw VARIABLE.MESSAGES.TOKEN.PAYLOAD_INVALID;
        }
      } else {
        result.code = STATUS_CODE.UNAUTHORIZED;
        throw VARIABLE.MESSAGES.TOKEN.NOT_FOUND;
      }
    },
  );
}
