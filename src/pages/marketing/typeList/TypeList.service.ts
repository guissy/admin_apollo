import request from '../../../utils/request';
import { stringify } from 'querystring';

export async function queryTableData(param: object) {
  return request(`/active/types?${stringify(param)}`, {
    method: 'get'
  });
}
export async function deleteActive({ id }: { id: string }) {
  return request(`/active/type/${id}`, {
    method: 'delete'
  });
}
export async function addActive(param: object) {
  return request(`/active/type`, {
    method: 'put',
    body: JSON.stringify(param)
  });
}
export async function editActive(param: Param) {
  return request(`/active/type/${param.id}`, {
    method: 'put',
    body: JSON.stringify(param.data)
  });
}
interface Param {
  id: string;
  data: object;
}
