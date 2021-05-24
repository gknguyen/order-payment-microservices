import sequelize from 'sequelize';
import ENV from '../../config/env';

const mysql = new sequelize.Sequelize(ENV.DATABASES.SQL.MYSQL.CONNECTION, {
  logging: false,
  dialectOptions: {
    dateStrings: true,
    typeCast: true,
  },
});

export default mysql;
