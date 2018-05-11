import { Action, EffectsCommandMap, Model } from 'dva';
import {
  queryUserBankTableData,
  addBankCard,
  editBankCard,
  doSetBankCardStatus,
  queryBankList
} from './BankDetail.service';

export interface BankCardState {
  tableData: Array<object>;
  isLoading: boolean;
  bankList: Array<object>;
}

const BankCardModel: Model = {
  namespace: 'bankCard',
  state: {
    tableData: [],
    isLoading: true,
    bankList: []
  },
  effects: {
    // 银行列表
    *loadBankList({ payload }: Action, { select, call, put }: EffectsCommandMap) {
      const data = yield call(queryBankList, payload);
      if (data) {
        yield put({
          type: 'loadDataSuccess',
          payload: {
            bankList: data.data
          }
        });
      }
    },
    // 用户银行卡列表
    *loadData({ payload }: Action, { select, call, put }: EffectsCommandMap) {
      yield put({
        type: 'addLoading',
        payload: {
          isLoading: true
        }
      });
      const data = yield call(queryUserBankTableData, payload);
      if (data) {
        yield put({
          type: 'loadDataSuccess',
          payload: {
            tableData: data.data,
            isLoading: false
          }
        });
      }
    },
    // 新增银行卡
    *addBankCard({ payload }: Action, { select, call, put }: EffectsCommandMap) {
      const data = yield call(addBankCard, payload);
      return data;
    },
    // 编辑银行卡
    *editBankCard({ payload }: Action, { select, call, put }: EffectsCommandMap) {
      const data = yield call(editBankCard, payload);
      return data;
    },
    // 设置银行卡状态
    *doSetBankCardStatus({ payload }: Action, { select, call, put }: EffectsCommandMap) {
      const data = yield call(doSetBankCardStatus, payload);
      return data;
    }
  },
  reducers: {
    loadDataSuccess(state: BankCardState, { payload }: Action) {
      return {
        ...state,
        ...payload
      };
    }
  }
};

export default BankCardModel;
