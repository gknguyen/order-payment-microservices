import mongoose from 'mongoose';
import { OrderStatus } from '../config/enum';

export interface User extends mongoose.Document {
  readonly _id: string;
  username: string;
  password: string;
}

export interface Order extends mongoose.Document {
  readonly _id: string;
  name: string;
  status: OrderStatus;
}
