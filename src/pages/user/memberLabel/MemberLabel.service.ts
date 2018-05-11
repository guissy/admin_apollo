import request from '../../../utils/request';
import environment from '../../../utils/environment';
import { stringify, parse } from 'querystring';

// 会员标签列表
export async function queryMemberLabelTableData(params: object) {
  return request(`/user/labels?${stringify(params)}`, {
    method: 'get'
  });
}

// 新增会员标签
export async function addMemberLabel(params: object) {
  return request(`/user/label`, {
    method: 'put',
    body: JSON.stringify(params)
  });
}

// 编辑会员标签
export async function editMemberLabel(params: { id: string }) {
  return request(`/user/label/${params.id}`, {
    method: 'put',
    body: JSON.stringify(params)
  });
}

// 删除会员标签
export async function deleteMemberLabel(params: { id: string }) {
  return request(`/user/label/${params.id}`, {
    method: 'delete'
  });
}
