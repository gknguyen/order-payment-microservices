import Crypto from 'crypto-js';
import jsonwebtoken from 'jsonwebtoken';
import ENV from '../../config/env';
import { UserInfo } from '../../config/type';
import { User } from '../../database/mongo.form';

class AuthService {
  public getToken = (user: User) =>
    jsonwebtoken.sign(
      {
        id: user._id,
        username: user.username,
      } as UserInfo,
      ENV.JWT.SECRET,
      {
        expiresIn: ENV.JWT.EXPIRES_IN,
      },
    );

  public comparePassword = (loginPass: string, userEncodedPass: string) => {
    const dencodedPass = Crypto.AES.decrypt(userEncodedPass, ENV.CRYPTO.SECRET);
    if (dencodedPass.toString(Crypto.enc.Utf8) === loginPass) return true;
    else return false;
  };
}

const authService = new AuthService();

export default authService;
