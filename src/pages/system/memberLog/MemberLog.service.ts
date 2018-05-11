import request from '../../../utils/request';
import { stringify } from 'querystring';

export async function queryTableData(param: object) {
  return request(`/system/log/user.operation?${stringify(param)}`);
}
