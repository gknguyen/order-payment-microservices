const MOCK = {
  ENV: {
    NODE_ENV: 'test',
    PORT: '4200',
    COOKIE_SECRET: 'adsaldasdasds2423fdfsdf',
    JWT_SECRET: 'sdfwwrcxvvbsdfd2342344',
    JWT_EXPIRES_IN: '24h',
    CRYPTO_SECRET: 'adafdasdas6d5asda8',
    MOMENT_TIMEZONE: 'Asia/Ho_Chi_Minh',
    MOMENT_LOCALE: 'en',
    MYSQL_CONNECTION: 'mysql://root:@127.0.0.1:3306/order_payment',
  },
  URL: {
    ORDER_SERVICE: {
      BASE: 'http://localhost:4000',
      API: {
        LOGIN: '/api/auth/login',
        CHECK_ORDER_STATUS: '/api/order/checkOrderStatus',
        CREATE_ORDER: '/api/order/createOrder',
        CANCEL_ORDER: '/api/order/cancelOrder',
      },
    },
    PAYMENT_SERVICE: {
      BASE: 'http://localhost:5000',
      API: {
        PROCESS_ORDER: '/api/payment/processOrder',
      },
    },
  },
  JWT: {
    INVALID: 'adasdasdasdas',
    INCORRECT_DATA:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwLCJ1c2VybmFtZSI6IkVycm9yIiwiaWF0IjoxNjIyMDQ2NDM4LCJleHAiOjE2MjIxMzI4Mzh9.RGV41YYmHcL9KqHc3_lGRn_31GLCK4qsELnk4lt3piw',
    EXPIRED:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsImlhdCI6MTYyMTk2MjIwOSwiZXhwIjoxNjIyMDQ4NjA5fQ.ztAa7vu5PIF22TJk7LALOJRlOpUG5r1Qs4y1SswsXqQ',
  },
};

export default MOCK;
