import request from '../../../utils/request';
import environment from '../../../utils/environment';

export async function queryResourceManageData() {
  return request(`${environment.imgHost}/api`);
}

// tslint:disable-next-line:no-any
export async function openFolder(param: any) {
  return request(`${environment.imgHost}/api${param}`);
}

// tslint:disable-next-line:no-any
export async function deleteFile(param: any) {
  return request(`${environment.imgHost}/api${param}`, {
    method: 'DELETE'
  });
}

// tslint:disable-next-line:no-any
export async function rename(param: any) {
  let body = {
    post_type: 'rname',
    nname: param.name
  };
  return request(`${environment.imgHost}/api${param.url}`, {
    method: 'POST',
    body: JSON.stringify(body)
  });
}

// tslint:disable-next-line:no-any
export async function addDir(param: any) {
  let body = {
    post_type: 'createdir',
    folder: param.name
  };
  return request(`${environment.imgHost}/api${param.url}`, {
    method: 'POST',
    body: JSON.stringify(body)
  });
}
