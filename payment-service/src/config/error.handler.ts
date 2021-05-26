import express from 'express';
import fs from 'fs';
import STATUS_CODE from 'http-status';
import jsonwebtoken from 'jsonwebtoken';
import os from 'os';
import path from 'path';
import { HTTPdata, UserInfo } from './type';
import util from './util';
import VARIABLE from './variable';

const errorLogFileName = `error_log_${util.formatDate(new Date(), 'YYYYMMDD')}`;
const errorFolderPath = `../../${VARIABLE.COMMON.LOG.MAIN_FOLDER}/${VARIABLE.COMMON.LOG.ERROR_FOLDER}`;

const errorHandler =
  (
    result: HTTPdata,
    fn: (req: express.Request, res: express.Response, next: express.NextFunction) => void,
  ) =>
  (req: express.Request, res: express.Response, next: express.NextFunction) =>
    Promise.resolve()
      .then(() => fn(req, res, next))
      .catch((error: Error) => {
        /** get data from headers */
        const token = req.headers.token as string;
        const userInfo = jsonwebtoken.decode(token) as UserInfo;

        let errorMessage = error.toString();
        errorMessage = errorMessage.replace(
          'SequelizeValidationError: notNull Violation: ',
          '',
        );
        console.error(`errorHandler: ${errorMessage}`);
        console.error(
          `jaMoment: ${util.formatDate(new Date())} at function ${result.function}`,
        );

        /** add error to file errorLog.txt */
        fs.appendFile(
          path.join(__dirname, `${errorFolderPath}/${errorLogFileName}.log`),
          `========================================================` +
            os.EOL +
            `date: ${util.formatDate(new Date())}` +
            os.EOL +
            `API: ${req.baseUrl}${req.path}` +
            os.EOL +
            `error: ${errorMessage}` +
            os.EOL +
            `username: ${userInfo?.username || ''}` +
            os.EOL +
            `function: ${result.function}` +
            os.EOL,
          (err) => err && console.error(err),
        );

        /** send response to client-side (FE) */
        res.status(result.code || STATUS_CODE.INTERNAL_SERVER_ERROR).send(errorMessage);
      });

export default errorHandler;
