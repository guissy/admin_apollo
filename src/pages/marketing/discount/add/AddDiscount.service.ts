import request from '../../../../utils/request';
import { stringify } from 'querystring';

export async function getLevel(param: object) {
  return request(`/user/level`, {
    method: 'get'
  });
}
export async function getGames(param: object) {
  return request(`/games`, {
    method: 'get'
  });
}
