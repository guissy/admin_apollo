import request from '../../utils/request';

// 今日活跃用户 新增用户等
export async function queryToday() {
  return request(`/stat/today`, { method: 'Get' });
}

// 游戏对比统计方法 7天跟30天统计
export async function queryChannel() {
  return request(`/stat/channel/7`, { method: 'Get' });
}

// 游戏下单数、金额、盈亏统计 7天跟30天统计
export async function queryGames(params: object) {
  return request(`/stat/games`, {
    method: 'Get',
    body: JSON.stringify(params)
  });
}

// 会员统计 7天跟30天统计
// tslint:disable-next-line:no-any
export async function queryMember(params: any) {
  return request(`/stat/channel`, {
    method: 'Get',
    body: JSON.stringify(params)
  });
}

// 总报表 7天跟30天统计
// tslint:disable-next-line:no-any
export async function queryAmount(params: any) {
  return request(`/stat/channel`, {
    method: 'Get',
    body: JSON.stringify(params)
  });
}
