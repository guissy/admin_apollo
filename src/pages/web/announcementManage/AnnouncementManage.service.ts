import request from '../../../utils/request';
import { stringify } from 'querystring';
export async function queryNotice(params: object) {
  return request(`/notices?${stringify(params)}`, {
    method: 'GET'
  });
}
export async function doDelete(params: { id: string }) {
  return request(`/notice/${params.id}`, {
    method: 'DELETE'
  });
}
export async function changeStatus(params: { id: string; params: object }) {
  return request(`/notice/${params.id}`, {
    method: 'PATCH',
    body: JSON.stringify(params.params)
  });
}
export async function doEdit(params: { id: string; params: object }) {
  return request(`/notice/${params.id}`, {
    method: 'PUT',
    body: JSON.stringify(params.params)
  });
}
export async function addNotice(params: object) {
  return request(`/notice`, {
    method: 'PUT',
    body: JSON.stringify(params)
  });
}
export async function doRelease(params: object) {
  return request(`/notices`, {
    method: 'PATCH',
    body: JSON.stringify(params)
  });
}
export async function getUserLevel() {
  return request(`/user/level`, {
    method: 'GET'
  });
}
