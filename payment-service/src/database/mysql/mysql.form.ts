import { OrderStatus } from '../../config/enum';

export interface User {
  readonly id: number;
  username: string;
  password: string;
}

export interface Order {
  readonly id: number;
  name: string;
  status: OrderStatus;
}
