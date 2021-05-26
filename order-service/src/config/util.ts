import moment from 'moment-timezone';
import ENV from './env';

class Util {
  public formatDate(
    theDateTime?: Date | string | number,
    format = 'DD/MM/YYYY h:mm:ss a',
  ) {
    if (theDateTime)
      return moment(moment.utc(theDateTime))
        .tz(ENV.MOMENT.TIMEZONE)
        .locale(ENV.MOMENT.LOCALE)
        .format(format);
    else return '';
  }

  public convertStringToNumber(str?: string) {
    if (str) return parseFloat(str);
    else return 0;
  }
}

const util = new Util();

export default util;
