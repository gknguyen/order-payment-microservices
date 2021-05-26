import common from '../variables/common.json';
import messages from '../variables/messages.json';
import queries from '../variables/queries.json';
import { HTTPdata } from './type';

const VARIABLE = {
  RESULT: {
    code: 0,
    transaction: undefined,
    function: '',
  } as HTTPdata,

  COMMON: common,

  MESSAGES: messages,

  QUERIES: queries,
};

export default VARIABLE;
