import request from '../../../../utils/request';
import { stringify } from 'querystring';

export async function queryTableData(param: object) {
  return request(`/active/rebetset/detail?${stringify(param)}`, {
    method: 'get'
  });
}
export async function doRevoke(param: object) {
  return request(`/active/rebetset/revoke`, {
    method: 'put',
    body: JSON.stringify(param)
  });
}
