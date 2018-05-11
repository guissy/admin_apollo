import request from '../../../utils/request';
import { stringify } from 'querystring';
export async function queryADhome(params: object) {
  return request(`/copywriter/desc?${stringify(params)}`, {
    method: 'GET'
  });
}
export async function changeStatus(params: { id: number; params: object }) {
  return request(`/copywriter/desc/${params.id}`, {
    method: 'PATCH',
    body: JSON.stringify(params.params)
  });
}
export async function doDelete(params: { id: number }) {
  return request(`/copywriter/desc/${params.id}`, {
    method: 'DELETE'
  });
}
export async function doApply(params: { id: number; params: object }) {
  return request(`/copywriter/desc/${params.id}`, {
    method: 'PATCH',
    body: JSON.stringify(params.params)
  });
}
export async function doEdit(params: { id: number; params: object }) {
  return request(`/copywriter/desc/${params.id}`, {
    method: 'PUT',
    body: JSON.stringify(params.params)
  });
}
export async function addHome(params: object) {
  return request(`/copywriter/desc`, {
    method: 'PUT',
    body: JSON.stringify(params)
  });
}
