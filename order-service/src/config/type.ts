import sequelize from 'sequelize';

export type HTTPdata = {
  code: number;
  transaction?: sequelize.Transaction;
  function: string;
};

export type UserInfo = {
  id: number;
  username: string;
};
