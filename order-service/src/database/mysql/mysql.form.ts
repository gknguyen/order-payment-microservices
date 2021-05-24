import sequelize from 'sequelize';
import { OrderStatus } from '../../config/enum';

export interface User extends sequelize.Model {
  readonly id: number;
  username: string;
  password: string;
}

export interface Order extends sequelize.Model {
  readonly id: number;
  name: string;
  status: OrderStatus;
}
