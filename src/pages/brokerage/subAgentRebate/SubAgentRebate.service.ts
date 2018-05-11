import request from '../../../utils/request';
import { stringify } from 'querystring';
import { moneyForResult, yuan } from '../../../utils/money';
import { TableRow } from './SubAgentRebate.model';

export async function queryTableData(param: object) {
  return request(`/commission/commis?${stringify(param)}`, {
    method: 'get'
  }).then(
    moneyForResult<TableRow[]>({
      data: {
        $for: {
          total: yuan, // 分转元
          settings: {
            $apply: (obj: object) => Object.values(obj), // 对象值转数组
            $for: yuan // 分转元(数组)
          }
        }
      }
    })
  );
}

export async function querySubordinateBrokerage(param: object) {
  return request(`/commission/chain?${stringify(param)}`, {
    method: 'get'
  });
}

export async function commis(param: object) {
  return request(`/commission/commis`, {
    method: 'PATCH',
    body: JSON.stringify(param)
  });
}

export async function commissionPeriodHttp() {
  return request(`/commission/period`);
}
