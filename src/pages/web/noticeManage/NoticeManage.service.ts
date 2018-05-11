import request from '../../../utils/request';
import { stringify } from 'querystring';
export async function queryNotice(params: object) {
  return request(`/message/show?${stringify(params)}`, {
    method: 'GET'
  });
}
export async function doDelete(params: { ids: string }) {
  return request(`/messages/?ids=${params.ids}`, {
    method: 'DELETE'
  });
}
export async function addNotice(params: object) {
  return request(`/message/new`, {
    method: 'PUT',
    body: JSON.stringify(params)
  });
}
export async function doRelease(params: object) {
  return request(`/messages`, {
    method: 'PATCH',
    body: JSON.stringify(params)
  });
}
