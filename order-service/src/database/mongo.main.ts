import OrderDocument from './documents/order.document';
import UserDocument from './documents/user.document';

class MongoMain {
  public user = UserDocument;
  public order = OrderDocument;
}

const MONGO = new MongoMain();

export default MONGO;
