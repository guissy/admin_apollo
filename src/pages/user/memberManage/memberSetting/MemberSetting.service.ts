import request from '../../../../utils/request';
import environment from '../../../../utils/environment';
import { stringify, parse } from 'querystring';

export async function queryUserSetInfo(params: { id: string }) {
  return request(`/user/info/setting/${params.id}`, {
    method: 'get'
  });
}

export async function permissionsSet(params: { ids: string; auth: string; status: string }) {
  return request(`/user/info/setting.prohibition/${params.ids}`, {
    method: 'PATCH',
    body: JSON.stringify(params)
  });
}

export async function statusSet(params: { ids: string; state: number }) {
  return request(`/user/info/setting/${params.ids}`, {
    method: 'put',
    body: JSON.stringify(params)
  });
}

export async function removeBind(params: { uid: string; role: number }) {
  return request(`/admin/login.unbind`, {
    method: 'post',
    body: JSON.stringify(params)
  });
}

export async function kickedOutOnline(params: { ids: string; online: string }) {
  return request(`/user/info/setting//${params.ids}`, {
    method: 'PATCH',
    body: JSON.stringify(params)
  });
}
