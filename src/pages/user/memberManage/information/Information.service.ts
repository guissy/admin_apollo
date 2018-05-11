import request from '../../../../utils/request';
import environment from '../../../../utils/environment';
import { stringify, parse } from 'querystring';

// tslint:disable-next-line:no-any
export async function queryUserInfo(params: { id: string }) {
  return request(`/user/info/${params.id}` + '?type=base', {
    method: 'get'
  });
}

export async function queryQuestion() {
  return request(`/user/info/question`, {
    method: 'get'
  });
}

export async function saveInformation(params: { id: string; obj: object }) {
  return request(`/user/info/base/${params.id}`, {
    method: 'PATCH',
    body: JSON.stringify(params.obj)
  });
}
