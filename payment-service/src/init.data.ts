import fs from 'fs';
import path from 'path';
import VARIABLE from './config/variable';

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
