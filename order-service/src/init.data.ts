import Crypto from 'crypto-js';
import fs from 'fs';
import path from 'path';
import ENV from './config/env';
import VARIABLE from './config/variable';
import MONGO from './database/mongo.main';

export const initFolder = () => {
  const mainLogFolderPath = path.join(__dirname, `../${VARIABLE.COMMON.LOG.MAIN_FOLDER}`);
  const accessLogFolderPath = path.join(
    __dirname,
    `../${VARIABLE.COMMON.LOG.MAIN_FOLDER}/${VARIABLE.COMMON.LOG.ACCESS_FOLDER}`,
  );
  const errorLogFolderPath = path.join(
    __dirname,
    `../${VARIABLE.COMMON.LOG.MAIN_FOLDER}/${VARIABLE.COMMON.LOG.ERROR_FOLDER}`,
  );

  if (!fs.existsSync(mainLogFolderPath)) fs.mkdirSync(mainLogFolderPath);
  if (!fs.existsSync(accessLogFolderPath)) fs.mkdirSync(accessLogFolderPath);
  if (!fs.existsSync(errorLogFolderPath)) fs.mkdirSync(errorLogFolderPath);
};

export const initData = () => {
  MONGO.user.findOneAndUpdate(
    {
      username: 'admin',
    },
    {
      username: 'admin',
      password: Crypto.AES.encrypt('admin', ENV.CRYPTO.SECRET).toString(),
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    },
    (err) => err && console.error(err),
  );
};
