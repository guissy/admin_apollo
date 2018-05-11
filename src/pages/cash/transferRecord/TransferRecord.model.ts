import { message } from 'antd';
import { queryTableData, queryWalletTypes } from './TransferRecord.service';
import { Action, EffectsCommandMap, Model } from 'dva';
import { Attributes, Result } from '../../../utils/result';
import { showMessageForResult } from '../../../utils/showMessage';

export interface TableRow {
  amount: string;
  created: string;
  id: string;
  in_id: string;
  in_name: string;
  memo: string;
  no: string;
  op_name: number;
  out_id: string;
  out_name: string;
  status: string;
  type: string;
  user_id: string;
  username: string;
}

export interface WalletTypesItem {
  id: number;
  name: string;
}

export interface TransferRecordState {
  tableData: Array<TableRow>;
  attributes: Attributes;
}

const TransferRecordModel: Model = {
  namespace: 'transferRecord',
  state: {
    tableData: [],
    attributes: {}
  },
  effects: {
    *loadData({ payload }: Action, { select, call, put }: EffectsCommandMap) {
      const result: Result<TableRow[]> = yield call(queryTableData, payload);
      if (result.state === 0) {
        yield put({
          type: 'loadDataSuccess',
          payload: {
            tableData: result.data,
            attributes: result.attributes
          }
        });
      }
      showMessageForResult(result);
      return result;
    },
    *queryWalletTypes({ payload }: Action, { select, call, put }: EffectsCommandMap) {
      return yield call(queryWalletTypes, payload);
    }
  },
  reducers: {
    loadDataSuccess(state: TransferRecordState, { payload }: Action) {
      return {
        ...state,
        ...payload
      };
    }
  }
};

export default TransferRecordModel;
