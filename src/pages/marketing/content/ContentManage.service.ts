import request from '../../../utils/request';
import { stringify } from 'querystring';

export async function queryTableData(param: object) {
  return request(`/actives.manage?${stringify(param)}`, {
    method: 'get'
  });
}
export async function doStart({ id, ...data }: { id: string }) {
  return request(`/active/manual/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  });
}
export async function doStop({ id, ...data }: { id: string }) {
  return request(`/active/manual/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  });
}
export async function doDelete(param: { id: string; name: string }) {
  return request(`/active/manual/${param.id}?type=1&&name=${param.name}`, {
    method: 'DELETE'
  });
}
export async function getTypes(param: object) {
  return request(`/active/types?${stringify(param)}`, {
    method: 'get'
  });
}
export async function getLanguages(param: object) {
  return request(`/languages`, {
    method: 'get'
  });
}
export async function submitEditData(param: { id: string; data: object }) {
  return request(`/active/manual/${param.id}`, {
    method: 'PUT',
    body: JSON.stringify(param.data)
  });
}
export async function submitAddData(param: object) {
  return request(`/active/manual`, {
    method: 'PUT',
    body: JSON.stringify(param)
  });
}
export async function getEditData(param: { id: string }) {
  console.log(param);
  return request(`/active/manual/${param.id}`, {
    method: 'GET'
  });
}
