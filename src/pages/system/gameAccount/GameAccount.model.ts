import { queryTableData } from './GameAccount.service';
import { Action, EffectsCommandMap, Model } from 'dva';

export interface GameAccountState {
  tableData: Array<object>;
  isLoading: boolean;
}

const GameAccountModel: Model = {
  namespace: 'gameAccount',
  state: {
    tableData: []
  },
  effects: {
    *loadData({ payload }: Action, { select, call, put }: EffectsCommandMap) {
      const data = yield call(queryTableData, payload);
      if (data.state === 0) {
        yield put({
          type: 'loadDataSuccess',
          payload: {
            tableData: data.data
          }
        });
      }
    }
  },
  reducers: {
    loadDataSuccess(state: GameAccountState, { payload }: Action) {
      return {
        ...state,
        ...payload
      };
    }
  }
};

export default GameAccountModel;
