import { stringify } from 'querystring';
import request from '../../../utils/request';

export async function queryTableData(param: object) {
  return request(`/system/currency`);
}
