import compression from 'compression';
import cookieParser from 'cookie-parser';
import express from 'express';
import rateLimit from 'express-rate-limit';
import fs from 'fs';
import helmet from 'helmet';
import morgan from 'morgan';
import os from 'os';
import path from 'path';
import apiRouter from './api/api.routes';
import ENV from './config/env';
import util from './config/util';
import VARIABLE from './config/variable';
import { initFolder } from './init.data';

const accessLogFileName = `access_log_${util.formatDate(new Date(), 'YYYYMMDD')}`;
const accessFolderPath = `../${VARIABLE.COMMON.LOG.MAIN_FOLDER}/${VARIABLE.COMMON.LOG.ACCESS_FOLDER}`;

const app = express();

initFolder();

loadLogs();
loadConfigs();
loadRoutes();

export default app;

/** ================================================================================== */
/**
functions
*/

function loadLogs() {
  /** append log to log files */
  const accessLogStream = fs.createWriteStream(
    path.join(__dirname, `${accessFolderPath}/${accessLogFileName}.log`),
    {
      flags: 'a',
    },
  );

  /** HTTP request logger */
  app.use(
    morgan(
      `=================== ${ENV.NODE_ENV} ==================` +
        os.EOL +
        'remote-addr: :remote-addr' +
        os.EOL +
        'remote-user: :remote-user' +
        os.EOL +
        'user-agent: ":user-agent"' +
        os.EOL +
        'date: [:date[clf]]' +
        os.EOL +
        'url: "HTTP/:http-version/:method - :url - :status"' +
        os.EOL +
        'req[header]: :req[header]' +
        os.EOL +
        'res[header]: :res[header]' +
        os.EOL +
        'req[content-length]: :req[content-length]' +
        os.EOL +
        'res[content-length]: :res[content-length]' +
        os.EOL +
        'response-time: :total-time ms',
      {
        stream: accessLogStream,
      },
    ),
  );
}

function loadConfigs() {
  /** secure app by setting various HTTP headers */
  app.use(helmet());

  /** DDoS protection */
  app.use(
    rateLimit({
      windowMs: 5 * 60 * 1000 /** 5 minutes */,
      max: 1000 /** limit each IP to 1000 requests per windowMs */,
      message: VARIABLE.MESSAGES.AUTH.DDOS,
    }),
  );

  /** compress HTTP responses. */
  app.use(compression());

  /** for parsing cookies */
  app.use(cookieParser(ENV.COOKIE.SECRET));

  /** for parsing application/json */
  app.use(express.json());

  /** for parsing application/x-www-form-urlencoded */
  app.use(express.urlencoded({ extended: true }));
}

function loadRoutes() {
  app.use('/api', apiRouter);
}
