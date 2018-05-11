import request from '../../../../utils/request';
import environment from '../../../../utils/environment';
import { stringify, parse } from 'querystring';

// 会员银行卡列表
export async function queryUserBankTableData(params: { id: string }) {
  return request(`/user/info/${params.id}` + '?type=bank', {
    method: 'get'
  });
}

// 新增银行卡
export async function addBankCard(params: object) {
  return request(`/user/info/bank`, {
    method: 'put',
    body: JSON.stringify(params)
  });
}

// 编辑银行卡
export async function editBankCard({ cid, ...obj }: { cid: string }) {
  return request(`/user/info/bank/${cid}`, {
    method: 'put',
    body: JSON.stringify(obj)
  });
}

// 设置银行卡启用停用
export async function doSetBankCardStatus({ cid, ...obj }: { cid: string }) {
  return request(`/user/info/bank/${cid}`, {
    method: 'PATCH',
    body: JSON.stringify(obj)
  });
}

// 银行列表
export async function queryBankList() {
  return request(`/banks`, {
    method: 'get'
  });
}
