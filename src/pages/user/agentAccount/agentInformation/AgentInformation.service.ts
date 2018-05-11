import request from '../../../../utils/request';
export async function getBaseInfo(params: { id: string }) {
  return request(`/user/agent/base/${params.id}`, {
    method: 'GET'
  });
}
export async function saveBaseInfo(params: { id: string; obj: object }) {
  return request(`/user/agent/message/${params.id}`, {
    method: 'PATCH',
    body: JSON.stringify(params.obj)
  });
}
export async function resetLoginPassword(params: { id: string; obj: object }) {
  return request(`/user/info/base/${params.id}`, {
    method: 'PATCH',
    body: JSON.stringify(params.obj)
  });
}
export async function resetWithdrawalsPassword(params: { id: string; obj: object }) {
  return request(`/user/info/base/${params.id}`, {
    method: 'PATCH',
    body: JSON.stringify(params.obj)
  });
}
