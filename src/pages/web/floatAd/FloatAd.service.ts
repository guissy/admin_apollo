import request from '../../../utils/request';
import { stringify } from 'querystring';
export async function queryCk(params: object) {
  return request(`/copywriter/float?${stringify(params)}`, {
    method: 'GET'
  });
}
export async function addCkManage(params: object) {
  return request(`/copywriter/float`, {
    method: 'PUT',
    body: JSON.stringify(params)
  });
}
export async function doEdit(params: { id: number; params: object }) {
  return request(`/copywriter/float/${params.id}`, {
    method: 'PUT',
    body: JSON.stringify(params.params)
  });
}
export async function changeStatus(params: { id: number; params: object }) {
  return request(`/copywriter/float/${params.id}`, {
    method: 'PATCH',
    body: JSON.stringify(params.params)
  });
}
export async function doApply(params: { id: number; params: object }) {
  return request(`/copywriter/float/${params.id}`, {
    method: 'PATCH',
    body: JSON.stringify(params.params)
  });
}
export async function doDelete(params: object) {
  return request(`/copywriter/float/?${stringify(params)}`, {
    method: 'DELETE'
  });
}
