import Crypto from 'crypto-js';
import fs from 'fs';
import path from 'path';
import ENV from './config/env';
import VARIABLE from './config/variable';
import MYSQL from './database/mysql/mysql.main';

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
  MYSQL.user.findOrCreate({
    where: {
      username: 'admin',
    },
    defaults: {
      username: 'admin',
      password: Crypto.AES.encrypt('admin', ENV.CRYPTO.SECRET).toString(),
    },
  });
};
