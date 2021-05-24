import mysql from 'mysql2';
import ENV from '../../config/env';

const MYSQL = mysql.createConnection(ENV.DATABASES.SQL.MYSQL.CONNECTION);

export default MYSQL;
