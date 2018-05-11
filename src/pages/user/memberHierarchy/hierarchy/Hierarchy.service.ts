import request from '../../../../utils/request';
import { stringify, parse } from 'querystring';
import { Result } from '../../../../utils/result';

// 查询层级列表
export async function queryMemberHierarchy(params: object) {
  return request(`/user/levels?${stringify(params)}`, {
    method: 'get'
  });
}

// 查询全部层级
export async function queryAllMemberHierarchy() {
  return request(`/user/level/`, {
    method: 'get'
  });
}

// 新增层级
export async function addMemberHierarchy(params: object) {
  return request(`/user/level/`, {
    method: 'put',
    body: JSON.stringify(params)
  });
}
// 编辑层级
export async function editMemberHierarchy({ id, ...obj }: { id: string }) {
  return request(`/user/level/` + id, {
    method: 'put',
    body: JSON.stringify(obj)
  });
}
// 删除层级
export async function deleteMemberHierarchy(params: { id: string }) {
  return request(`/user/level/` + params.id, {
    method: 'delete'
  });
}
// 层级回归
export async function restoreMemberHierarchy(params: { id: string }) {
  return request(`/user/level/restore`, {
    method: 'PATCH',
    body: JSON.stringify(params)
  });
}
// 分层
export async function layerdMemberHierarchy(params: object) {
  return request(`/user/level/layer`, {
    method: 'PATCH',
    body: JSON.stringify(params)
  });
}
// 层级设定
export async function queryMemberHierarchySet(params: { id: string }) {
  return request(`/user/level/set/` + params.id, {
    method: 'get'
  }).then((result: Result<object>) => {
    if (result.state === 0) {
      result.data[0].onlines = JSON.parse(result.data[0].onlines);
    }
    return result;
  });
}
export async function setMemberHierarchy({ id, ...obj }: { id: string }) {
  return request(`/user/level/set/` + id, {
    method: 'put',
    body: JSON.stringify(obj)
  });
}
