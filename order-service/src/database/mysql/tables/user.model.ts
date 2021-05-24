import mysql from '../mysql.auth';
import { User } from '../mysql.form';
import sequelize from 'sequelize';
import VARIABLE from '../../../config/variable';

const UserModel = mysql.define<User>(
  'user',
  {
    id: {
      type: sequelize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: sequelize.DataTypes.STRING,
      allowNull: false,
      unique: {
        name: 'user_name',
        msg: VARIABLE.MESSAGES.DATABASES.MYSQL.USER_TABLE.UNIQUE_USERNAME,
      },
      validate: {
        notNull: {
          msg: VARIABLE.MESSAGES.DATABASES.MYSQL.USER_TABLE.USERNAME_NOT_NULL,
        },
        notEmpty: {
          msg: VARIABLE.MESSAGES.DATABASES.MYSQL.USER_TABLE.USERNAME_NOT_NULL,
        },
      },
    },
    password: {
      type: sequelize.DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: VARIABLE.MESSAGES.DATABASES.MYSQL.USER_TABLE.PASSWORD_NOT_NULL,
        },
        notEmpty: {
          msg: VARIABLE.MESSAGES.DATABASES.MYSQL.USER_TABLE.PASSWORD_NOT_NULL,
        },
      },
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  },
);

export default UserModel;
