import OrderModel from './tables/order.model';
import UserModel from './tables/user.model';

class MYSQLMain {
  public user = UserModel;
  public order = OrderModel;
}

const MYSQL = new MYSQLMain();

export default MYSQL;
