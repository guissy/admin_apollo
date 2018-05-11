import request from '../../../../utils/request';
export async function getMarketInfo(params: { id: string }) {
  return request(`/user/agent/market/${params.id}`, {
    method: 'GET'
  });
}
