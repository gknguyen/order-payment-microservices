import dotenv from 'dotenv';

dotenv.config();

const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.ORDER_SERVICE_PORT || '',
  DELIVERY_TIME: process.env.DELIVERY_TIME || '',

  COOKIE: {
    SECRET: process.env.COOKIE_SECRET || '',
  },

  JWT: {
    SECRET: process.env.JWT_SECRET || '',
    EXPIRES_IN: process.env.JWT_EXPIRES_IN || '',
  },

  CRYPTO: {
    SECRET: process.env.CRYPTO_SECRET || '',
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
