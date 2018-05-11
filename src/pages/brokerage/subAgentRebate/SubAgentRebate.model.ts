import { message } from 'antd';
import {
  queryTableData,
  querySubordinateBrokerage,
  commis,
  commissionPeriodHttp
} from './SubAgentRebate.service';
import { Action, EffectsCommandMap, Model } from 'dva';
import { Attributes, Result } from '../../../utils/result';
import { showMessageForResult, messageError } from '../../../utils/showMessage';

export interface TableRow {
  commission: string;
  created: string;
  id: string;
  period: string;
  period_name: string;
  settings: Array<number>;
  status: string;
  total: number;
  uid: string;
  uname: string;
  updated: string;
}

export interface SubAgentRebateState {
  tableData: Array<TableRow>;
  attributes: Attributes;
}

const SubAgentRebateModel: Model = {
  namespace: 'subAgentRebate',
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
    *querySubordinateBrokerage({ payload }: Action, { select, call, put }: EffectsCommandMap) {
      const result = yield call(querySubordinateBrokerage, payload);
      return result;
    },
    *commis({ payload }: Action, { select, call, put }: EffectsCommandMap) {
      const result = yield call(commis, payload);
      if (result.state === 0) {
        yield put({
          type: 'loadData',
          payload: {
            page: '1',
            pageSize: '10'
          }
        });
      } else {
        messageError(result.message);
      }
      return result;
    },
    *commissionPeriod({ payload }: Action, { select, call, put }: EffectsCommandMap) {
      return yield call(commissionPeriodHttp, payload);
    }
  },
  reducers: {
    loadDataSuccess(state: SubAgentRebateState, { payload }: Action) {
      return {
        ...state,
        ...payload
      };
    }
  }
};

export default SubAgentRebateModel;
