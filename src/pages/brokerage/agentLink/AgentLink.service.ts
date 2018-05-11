import { IntlData } from './../../../locale/zh_CN';
import request from '../../../utils/request';
import { stringify } from 'querystring';

export async function queryTableData() {
  return request(`/commission/links`);
}

export async function transformStatus(param: TransformStatus) {
  return request(`/commission/link/${param.id}`, {
    method: 'PATCH',
    body: JSON.stringify(param)
  });
}

export async function add(param: object) {
  return request(`/commission/link`, {
    method: 'PUT',
    body: JSON.stringify(param)
  });
}

export async function edit(param: EditParam) {
  return request(`/commission/link/${param.id}`, {
    method: 'PUT',
    body: JSON.stringify(param)
  });
}

export async function deleteLink(param: DeleteLinkParam) {
  return request(`/commission/link/${param.id}`, {
    method: 'DELETE'
  });
}

interface TransformStatus {
  id: number;
  status: string;
}

interface EditParam {
  comment: string;
  domain: string;
  id: string;
  status: string;
}

interface DeleteLinkParam {
  id: string;
}
