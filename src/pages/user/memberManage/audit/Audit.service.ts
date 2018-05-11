import request from '../../../../utils/request';
import environment from '../../../../utils/environment';
import { stringify, parse } from 'querystring';

export async function queryUserAccountAudit(params: { id: string; obj: object }) {
  return request(`/user/info/${params.id}?${stringify(params.obj)}`, {
    method: 'get'
  });
}
