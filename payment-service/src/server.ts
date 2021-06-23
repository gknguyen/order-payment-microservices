import debug from 'debug';
import http from 'http';
import ENV from './config/env';
import mongodb from './database/mongo.auth';
import app from './middleware';

const server = http.createServer(app);
const logger = debug('server');

/**
 * connect to Database
 * */
mongodb.on('error', (err) =>
  logger(`Unable to connect to the database: ${err.toString()}`),
);
mongodb.once('open', () => {
  logger(`Connected to database: ${ENV.DATABASES.NOSQL.MONGO_DB.CONNECTION}`);
});

/**
 * start server
 * */
server.listen(ENV.PORT);
server.on('error', onError);
server.on('listening', onListening);

export default server;

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
