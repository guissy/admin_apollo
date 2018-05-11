import request from '../../../utils/request';
import { stringify } from 'querystring';
export async function queryAD(params: object) {
  return request(`/copywriter/carousel?${stringify(params)}`, {
    method: 'GET'
  });
}
export async function addADlist(params: object) {
  return request(`/copywriter/carousel`, {
    method: 'PUT',
    body: JSON.stringify(params)
  });
}
export async function doEdit(params: { id: number; params: object }) {
  return request(`/copywriter/carousel/${params.id}`, {
    method: 'PUT',
    body: JSON.stringify(params.params)
  });
}
export async function changeStatus(params: { id: number; params: object }) {
  return request(`/copywriter/carousel/${params.id}`, {
    method: 'PATCH',
    body: JSON.stringify(params.params)
  });
}
export async function doApply(params: { id: number; params: object }) {
  return request(`/copywriter/carousel/${params.id}`, {
    method: 'PATCH',
    body: JSON.stringify(params.params)
  });
}
export async function doDelete(params: { id: number; pf: string }) {
  return request(`/copywriter/carousel/?${stringify(params)}`, {
    method: 'DELETE'
  });
}
