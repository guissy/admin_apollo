import request from '../../../utils/request';
import { stringify, parse } from 'querystring';

// 查询代理审核列表
export async function queryAgentAudit(params: object) {
  return request(`/user/agent/reviews?${stringify(params)}`, {
    method: 'get'
  });
}

// 审核操作 status 1通过 2拒绝
export async function operateAgentAudit({ id, ...obj }: { id: string }) {
  return request(`/user/agent/handle/` + id, {
    method: 'PATCH',
    body: JSON.stringify(obj)
  });
}
