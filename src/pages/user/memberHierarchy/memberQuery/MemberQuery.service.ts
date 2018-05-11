// tslint:disable-next-line:file-name-ok
import request from '../../../../utils/request';
// tslint:disable-next-line:env-ref
import environment from '../../../../utils/environment';
import { moneyForResult, yuan } from '../../../../utils/money';
import { stringify, parse } from 'querystring';

// 会员层级查询用户
export async function queryMember(params: object) {
  return request(`/user/level/group?${stringify(params)}`, {
    method: 'get'
  });
}

// 查询当前层级列表
export async function queryAllMemberHierarchy() {
  return request(`/user/levels`, {
    method: 'get'
  });
}

// 锁定
export async function lockMembers(params: object) {
  return request(`/user/level/lock`, {
    method: 'PATCH',
    body: JSON.stringify(params)
  });
}

// 分层
export async function layeredMembers(params: object) {
  return request(`/user/info/level`, {
    method: 'PATCH',
    body: JSON.stringify(params)
  });
}
