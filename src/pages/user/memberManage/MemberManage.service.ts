import request from '../../../utils/request';
import { stringify } from 'querystring';

// 会员列表
export async function queryTableData(params: object) {
  return request(`/user/list?${stringify(params)}`, {
    method: 'get'
  });
}
// 会员账户状态
export async function doSetUserStatus(params: { ids: string }) {
  return request(`/user/info/setting/${params.ids}`, {
    method: 'put',
    body: JSON.stringify(params)
  });
}
// 会员标签列表
export async function queryTagList() {
  return request(`/user/labels`, {
    method: 'get'
  });
}
// 打标签
export async function doSetUserTags(params: { id: string }) {
  return request(`/user/label.bind/${params.id}`, {
    method: 'put',
    body: JSON.stringify(params)
  });
}
