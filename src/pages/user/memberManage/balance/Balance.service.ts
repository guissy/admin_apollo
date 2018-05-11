import request from '../../../../utils/request';
import environment from '../../../../utils/environment';
import { stringify, parse } from 'querystring';

// tslint:disable-next-line:no-any
export async function queryUserAccountBalance(params: any) {
  return request(`/user/info/${params.id}?${stringify(params.params)}`, {
    method: 'get'
  });
}
