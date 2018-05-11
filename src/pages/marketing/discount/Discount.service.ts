import request from '../../../utils/request';
import { stringify } from 'querystring';

export async function queryTableData(param: object) {
  return request(`/active/rebetset/records?${stringify(param)}`, {
    method: 'get'
  });
}
