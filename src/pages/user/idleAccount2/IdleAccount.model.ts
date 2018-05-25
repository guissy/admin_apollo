import { Action, EffectsCommandMap, Model } from 'dva';
import { queryUnusedAccount } from './IdleAccount.service';
import { Result, Attributes } from '../../../utils/result';

export interface IdleAccountState {
  data: Array<object>;
  attributes: Attributes;
}

const IdleAccountModel: Model = {
  namespace: 'idleAccount',
  state: {},
  effects: {
    *queryUnusedAccount({ payload }: Action, { select, call, put }: EffectsCommandMap) {
      const result: Result<object> = yield call(queryUnusedAccount, payload);
      if (result.state === 0) {
        yield put({
          type: 'loadDataSuccess',
          payload: {
            data: result.data,
            attributes: result.attributes
          }
        });
      }
      return result;
    }
  },
  reducers: {
    // 更新state
    loadDataSuccess(state: IdleAccountState, { payload }: Action) {
      return {
        ...state,
        ...payload
      };
    }
  }
};
export default IdleAccountModel;
