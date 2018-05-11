import request from '../../../utils/request';

export async function queryDomainData() {
  return request(`/system/domain?type=2`);
}

export async function queryLanguagesData() {
  return request(`/languages`);
}

export async function queryWebsiteStyleData() {
  return request(`/system/website/style`);
}

export async function submitData(parent: object) {
  return request(`/system/domain`, {
    method: 'PUT',
    body: JSON.stringify(parent)
  });
}
