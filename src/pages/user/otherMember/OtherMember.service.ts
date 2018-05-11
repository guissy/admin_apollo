import request from '../../../utils/request';
import { stringify, parse } from 'querystring';

// 查询第三方会员
export async function queryOtherMember(params: object) {
  return request(`/user/game.3th/members?${stringify(params)}`, {
    method: 'get'
  });
}

// 第三方游戏列表
export async function queryOtherGameList() {
  return request(`/games`, {
    method: 'get'
  });
}
