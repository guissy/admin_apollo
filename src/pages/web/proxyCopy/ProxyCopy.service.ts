import request from '../../../utils/request';
import { stringify } from 'querystring';
export async function queryProxy(params: object) {
  return request(`/copywriter/proxy?${stringify(params)}`, {
    method: 'GET'
  });
}
export async function changeStatus(params: { id: number; params: object }) {
  return request(`/copywriter/proxy/${params.id}`, {
    method: 'PATCH',
    body: JSON.stringify(params.params)
  });
}
export async function doApply(params: { id: number; params: object }) {
  return request(`/copywriter/proxy/${params.id}`, {
    method: 'PATCH',
    body: JSON.stringify(params.params)
  });
}
export async function doDelete(params: { id: number }) {
  return request(`/copywriter/proxy/${params.id}`, {
    method: 'DELETE'
  });
}
export async function doAdd(params: object) {
  return request(`/copywriter/proxy`, {
    method: 'PUT',
    body: JSON.stringify(params)
  });
}
export async function doEdit(params: { id: number; params: object }) {
  return request(`/copywriter/proxy/${params.id}`, {
    method: 'PUT',
    body: JSON.stringify(params.params)
  });
}
