import { Action, EffectsCommandMap, Model } from 'dva';
import { queryUserAccountBalance } from './Balance.service';

export interface MemberAccountBalanceState {
  accountBalanceInfo: { children: Array<object> };
  loading: boolean;
}

const MemberAccountBalanceModel: Model = {
  namespace: 'memberAccountBalance',
  state: {
    accountBalanceInfo: {
      children: []
    },
    loading: false
  },
  effects: {
    *loadData({ payload }: Action, { select, call, put }: EffectsCommandMap) {
      yield put({
        type: 'loadDataSuccess',
        payload: {
          loading: true
        }
      });
      const data = yield call(queryUserAccountBalance, payload);
      if (data) {
        yield put({
          type: 'loadDataSuccess',
          payload: {
            accountBalanceInfo: data.data,
            loading: false
          }
        });
      }
    }
  },
  reducers: {
    // 更新state
    loadDataSuccess(state: MemberAccountBalanceState, { payload }: Action) {
      return {
        ...state,
        ...payload
      };
    }
  }
};
export default MemberAccountBalanceModel;
