import app from './middleware';
import http from 'http';
import debug from 'debug';
import ENV from './config/env';
import MYSQL from './database/mysql/mysql.auth';

const server = http.createServer(app);
const logger = debug('server');

/**
 * connect to Database
 * */
MYSQL.connect((err) => {
  if (err) logger(`Unable to connect to the database: ${err.toString()}`);
  else logger(`Connected to database: ${ENV.DATABASES.SQL.MYSQL.CONNECTION}`);
});

/**
 * start server
 * */
server.listen(ENV.PORT);
server.on('error', onError);
server.on('listening', onListening);

/** ================================================================================== */
/**
functions
*/

function onListening() {
  const addr = server.address();
  const bind = addr
    ? typeof addr === 'string'
      ? `pipe ${addr}`
      : `port ${addr.port}`
    : '';
  logger(`Listening on ${bind} - ${ENV.NODE_ENV}`);
}

function onError(error: { syscall: string; code: string }) {
  if (error.syscall !== 'listen') throw error;

  const bind = typeof ENV.PORT === 'string' ? `Pipe ${ENV.PORT}` : `Port ${ENV.PORT}`;

  /** handle specific listen errors with friendly messages */
  switch (error.code) {
    case 'EACCES':
      throw new Error(`${bind} requires elevated privileges`);
    case 'EADDRINUSE':
      throw new Error(`${bind} is already in use`);
    default:
      throw error;
  }
}
