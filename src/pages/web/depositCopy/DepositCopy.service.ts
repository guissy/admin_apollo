import request from '../../../utils/request';
import { stringify } from 'querystring';
export async function queryDeposit(params: object) {
  return request(`/copywriter/deposit?${stringify(params)}`, {
    method: 'get'
  });
}
export async function changeStatus(params: { id: number; params: object }) {
  return request(`/copywriter/deposit/${params.id}`, {
    method: 'PATCH',
    body: JSON.stringify(params.params)
  });
}
export async function doApply(params: { id: number; params: object }) {
  return request(`/copywriter/deposit/${params.id}`, {
    method: 'PATCH',
    body: JSON.stringify(params.params)
  });
}
export async function doDelete(params: object) {
  return request(`/copywriter/deposit/?${stringify(params)}`, {
    method: 'DELETE'
  });
}
export async function addDeposit(params: object) {
  return request(`/copywriter/deposit`, {
    method: 'PUT',
    body: JSON.stringify(params)
  });
}
export async function doEdit(params: { id: number; params: object }) {
  return request(`/copywriter/deposit/${params.id}`, {
    method: 'PUT',
    body: JSON.stringify(params.params)
  });
}
