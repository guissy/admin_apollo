import { stringify } from 'querystring';
import request from '../../../utils/request';

export async function queryData(param: object) {
  return request(`/system/email.settings`);
}

export async function saveSetting(param: object) {
  return request(`/system/email.settings`, {
    method: 'PUT',
    body: JSON.stringify(param)
  });
}
