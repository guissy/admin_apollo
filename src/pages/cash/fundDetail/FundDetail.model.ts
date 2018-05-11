import { message } from 'antd';
import { queryTableData, queryFundsFlowsHttp } from './FundDetail.service';
import { Action, EffectsCommandMap, Model } from 'dva';
import { Attributes, Result } from '../../../utils/result';
import { showMessageForResult, messageError } from '../../../utils/showMessage';

export interface TableRow {
  balance: string;
  coupon_money: string;
  created: string;
  deal_category: string;
  deal_money: string;
  deal_number: string;
  deal_type: string;
  deal_type_name: number;
  id: string;
  memo: string;
  username: string;
}

export interface FundDetailTableAttributes extends Attributes {
  page_money_sum: string;
  total_money_sum: string;
}

export interface FundDetailState {
  tableData: Array<TableRow>;
  attributes: FundDetailTableAttributes;
}

const FundDetailModel: Model = {
  namespace: 'fundDetail',
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
    *queryFundsFlows({ payload }: Action, { select, call, put }: EffectsCommandMap) {
      return yield call(queryFundsFlowsHttp, payload);
    }
  },
  reducers: {
    loadDataSuccess(state: FundDetailState, { payload }: Action) {
      return {
        ...state,
        ...payload
      };
    }
  }
};

export default FundDetailModel;
