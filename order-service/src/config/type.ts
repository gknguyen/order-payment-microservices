import mongoose from 'mongoose';

export type HTTPdata = {
  code: number;
  session?: mongoose.ClientSession;
  function: string;
};

export type UserInfo = {
  id: string;
  username: string;
};
