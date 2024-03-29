import dotenv from 'dotenv';

dotenv.config();

const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PAYMENT_SERVICE_PORT || '',

  COOKIE: {
    SECRET: process.env.COOKIE_SECRET || '',
  },

  MOMENT: {
    TIMEZONE: process.env.MOMENT_TIMEZONE || '',
    LOCALE: process.env.MOMENT_LOCALE || '',
  },

  DATABASES: {
    NOSQL: {
      MONGO_DB: {
        CONNECTION: process.env.MONGODB_CONNECTION || '',
      },
    },
  },
};

export default ENV;
