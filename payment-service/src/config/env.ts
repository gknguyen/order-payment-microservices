import dotenv from 'dotenv';

dotenv.config();

const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || '4000',

  COOKIE: {
    SECRET: process.env.COOKIE_SECRET || '',
  },

  MOMENT: {
    TIMEZONE: process.env.MOMENT_TIMEZONE || '',
    LOCALE: process.env.MOMENT_LOCALE || '',
  },

  DATABASES: {
    SQL: {
      MYSQL: {
        CONNECTION: process.env.MYSQL_CONNECTION || '',
      },
    },
  },
};

export default ENV;
