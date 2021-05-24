import sequelize from 'sequelize';
import { OrderStatus } from '../../../config/enum';
import VARIABLE from '../../../config/variable';
import mysql from '../mysql.auth';
import { Order } from '../mysql.form';

const OrderModel = mysql.define<Order>(
  'order',
  {
    id: {
      type: sequelize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: sequelize.DataTypes.STRING,
      allowNull: false,
      unique: {
        name: 'order_name',
        msg: VARIABLE.MESSAGES.DATABASES.MYSQL.ORDER_TABLE.UNIQUE_ORDER,
      },
      validate: {
        notNull: {
          msg: VARIABLE.MESSAGES.DATABASES.MYSQL.ORDER_TABLE.NAME_NOT_NULL,
        },
        notEmpty: {
          msg: VARIABLE.MESSAGES.DATABASES.MYSQL.ORDER_TABLE.NAME_NOT_NULL,
        },
      },
    },
    status: {
      type: sequelize.DataTypes.ENUM,
      values: Object.values(OrderStatus),
      defaultValue: OrderStatus.created,
      allowNull: false,
      validate: {
        notNull: {
          msg: VARIABLE.MESSAGES.DATABASES.MYSQL.ORDER_TABLE.STATUS_NOT_NULL,
        },
        notEmpty: {
          msg: VARIABLE.MESSAGES.DATABASES.MYSQL.ORDER_TABLE.STATUS_NOT_NULL,
        },
        isIn: {
          args: [Object.values(OrderStatus)],
          msg: VARIABLE.MESSAGES.DATABASES.MYSQL.ORDER_TABLE.INVALID_STATUS,
        },
      },
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'createDateTime',
    updatedAt: 'editDateTime',
  },
);

export default OrderModel;
