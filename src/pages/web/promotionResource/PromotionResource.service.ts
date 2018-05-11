import request from '../../../utils/request';
import { stringify } from 'querystring';
export async function queryResources(params: object) {
  return request(`/commission/ad?${stringify(params)}`, {
    method: 'GET'
  });
}
export async function changeStatus(params: { id: string; params: object }) {
  return request(`/commission/ad/${params.id}`, {
    method: 'PATCH',
    body: JSON.stringify(params.params)
  });
}
export async function doDelete(params: { id: string }) {
  return request(`/commission/ad/${params.id}`, {
    method: 'DELETE'
  });
}
export async function doApply(params: { id: string; params: object }) {
  return request(`/commission/ad/${params.id}`, {
    method: 'PATCH',
    body: JSON.stringify(params.params)
  });
}
export async function doEdit(params: { id: string; params: object }) {
  return request(`/commission/ad/${params.id}`, {
    method: 'PUT',
    body: JSON.stringify(params.params)
  });
}
export async function addResources(params: object) {
  return request(`/commission/ad`, {
    method: 'PUT',
    body: JSON.stringify(params)
  });
}
export async function getAllGames() {
  return request(`/games/all`, {
    method: 'GET'
  });
}
