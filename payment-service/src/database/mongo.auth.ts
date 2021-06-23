import mongoose from 'mongoose';
import ENV from '../config/env';

mongoose.connect(ENV.DATABASES.NOSQL.MONGO_DB.CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const mongodb = mongoose.connection;

export default mongodb;
