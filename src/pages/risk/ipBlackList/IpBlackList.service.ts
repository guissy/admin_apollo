import request from '../../../utils/request';
import environment from '../../../utils/environment';
import { stringify, parse } from 'querystring';

// ip黑名单列表
// tslint:disable-next-line:no-any
export async function queryIpBlackList(params: any) {
  return request(`/system/ipblacks?${stringify(params)}`, {
    method: 'get'
  });
}

// 新增ip
export async function addIpBlack(params: object) {
  return request(`/system/ipblacks`, {
    method: 'put',
    body: JSON.stringify(params)
  });
}

// 编辑ip
export async function editIpBlack({ id, ...obj }: { id: string }) {
  return request(`/system/ipblacks/${id}`, {
    method: 'put',
    body: JSON.stringify(obj)
  });
}

// 允许和限制id
export async function editIpBlackStatus(params: object) {
  return request(`/system/ipblacks`, {
    method: 'PATCH',
    body: JSON.stringify(params)
  });
}

// 删除id
export async function deleteIpBlack(params: object) {
  return request(`/system/ipblacks?${stringify(params)}`, {
    method: 'delete'
  });
}
