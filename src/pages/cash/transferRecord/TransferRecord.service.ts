import request from '../../../utils/request';
import { stringify } from 'querystring';
import { moneyForResult, yuan } from '../../../utils/money';
import { TableRow } from './TransferRecord.model';

export async function queryTableData(param: object) {
  return request(`/cash/record/transfer?${stringify(param)}`, {
    method: 'GET'
  }).then(
    moneyForResult<TableRow[]>({
      data: {
        $for: {
          deal_money: yuan, // 分转元
          balance: yuan // 分转元
        }
      }
    })
  );
}

export async function queryWalletTypes() {
  return request(`/wallet/types`);
}
