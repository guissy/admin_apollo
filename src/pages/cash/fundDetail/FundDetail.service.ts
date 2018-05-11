import request from '../../../utils/request';
import { stringify } from 'querystring';
import { moneyForResult, yuan } from '../../../utils/money';
import { TableRow } from './FundDetail.model';

export async function queryTableData(param: object) {
  return request(`/funds/flow?${stringify(param)}`, {
    method: 'GET'
  }).then(
    moneyForResult<TableRow[]>({
      data: {
        $for: {
          deal_money: yuan, // 分转元
          balance: yuan // 分转元
        }
      },
      attributes: {
        page_money_sum: yuan,
        total_money_sum: yuan
      }
    })
  );
}

export async function queryFundsFlowsHttp() {
  return request(`/funds/flows`);
}
