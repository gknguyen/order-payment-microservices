import mongoose from 'mongoose';
import VARIABLE from '../../config/variable';
import { User } from '../mongo.form';

const userSchema = new mongoose.Schema<User>({
  username: {
    type: String,
    unique: [true, VARIABLE.MESSAGES.DATABASES.MONGO.USER_TABLE.UNIQUE_USERNAME],
    required: [true, VARIABLE.MESSAGES.DATABASES.MONGO.USER_TABLE.USERNAME_NOT_NULL],
  },
  password: {
    type: String,
    required: [true, VARIABLE.MESSAGES.DATABASES.MONGO.USER_TABLE.PASSWORD_NOT_NULL],
  },
});

const UserDocument = mongoose.model<User>('user', userSchema);

export default UserDocument;
