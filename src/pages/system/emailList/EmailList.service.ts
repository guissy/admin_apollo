import { stringify } from 'querystring';
import request from '../../../utils/request';

export async function queryTableData(param: object) {
  return request(`/system/emails?${stringify(param)}`);
}

export async function deleteRowData(param: object) {
  return request(`/system/emails?${stringify(param)}`, {
    method: 'DELETE'
  });
}

export async function sendEmail(param: object) {
  return request(`/system/email.send`, {
    method: 'POST',
    body: JSON.stringify(param)
  });
}

export async function userLevels() {
  return request(`/user/levels`);
}

export async function addEmail(param: object) {
  return request(`/system/email`, {
    method: 'PUT',
    body: JSON.stringify(param)
  });
}
