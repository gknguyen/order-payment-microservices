import mongoose from 'mongoose';
import { OrderStatus } from '../../config/enum';
import VARIABLE from '../../config/variable';
import { Order } from '../mongo.form';

const orderSchema = new mongoose.Schema<Order>({
  name: {
    type: String,
    unique: [true, VARIABLE.MESSAGES.DATABASES.MONGO.ORDER_TABLE.UNIQUE_ORDER],
    required: [true, VARIABLE.MESSAGES.DATABASES.MONGO.ORDER_TABLE.NAME_NOT_NULL],
  },
  status: {
    type: String,
    enum: {
      values: Object.values(OrderStatus),
      message: VARIABLE.MESSAGES.DATABASES.MONGO.ORDER_TABLE.INVALID_STATUS,
    },
    default: OrderStatus.created,
    required: [true, VARIABLE.MESSAGES.DATABASES.MONGO.ORDER_TABLE.STATUS_NOT_NULL],
  },
});

const OrderDocument = mongoose.model<Order>('order', orderSchema);

export default OrderDocument;
