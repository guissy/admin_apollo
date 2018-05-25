import request from '../../../utils/request';
import { stringify, parse } from 'querystring';

// 查询闲置账号列表
export async function queryUnusedAccount(params: object) {
  return request(`/user/unused?${stringify(params)}`, {
    method: 'get'
  });
}
