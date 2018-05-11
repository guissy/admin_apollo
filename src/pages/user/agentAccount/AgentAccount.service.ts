import request from '../../../utils/request';
import { stringify } from 'querystring';
export async function queryAgent(params: object) {
  return request(`/user/agent?${stringify(params)}`, {
    method: 'GET'
  });
}
export async function changeStatus(params: object) {
  return request(`/user/agent`, {
    method: 'PATCH',
    body: JSON.stringify(params)
  });
}
export async function doDelete(params: { id: number }) {
  return request(`/user/agent/${params.id}`, {
    method: 'DELETE'
  });
}
export async function addAgent(params: object) {
  return request(`/user/agent`, {
    method: 'PUT',
    body: JSON.stringify(params)
  });
}
export async function doEdit(params: { id: number; params: object }) {
  return request(`/user/agent${params.id}`, {
    method: 'PUT',
    body: JSON.stringify(params.params)
  });
}
