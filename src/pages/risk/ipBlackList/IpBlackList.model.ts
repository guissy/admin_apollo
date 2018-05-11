import { Action, EffectsCommandMap, Model } from 'dva';
import {
  queryIpBlackList,
  addIpBlack,
  editIpBlack,
  deleteIpBlack,
  editIpBlackStatus
} from './IpBlackList.service';
import { Result, Attributes } from '../../../utils/result';

export interface IpBlackListState {
  data: Array<object>;
  attributes: Attributes;
}

const IpBlackListModel: Model = {
  namespace: 'ipBlackList',
  state: {
    data: [],
    attributes: {
      number: 0,
      size: 0,
      total: 0
    }
  },
  effects: {
    *loadData({ payload }: Action, { select, call, put }: EffectsCommandMap) {
      const result: Result<object> = yield call(queryIpBlackList, payload);
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
    },
    *addIpBlack({ payload }: Action, { select, call, put }: EffectsCommandMap) {
      const data = yield call(addIpBlack, payload);
      return data;
    },
    *editIpBlack({ payload }: Action, { select, call, put }: EffectsCommandMap) {
      const data = yield call(editIpBlack, payload);
      return data;
    },
    *deleteIpBlack({ payload }: Action, { select, call, put }: EffectsCommandMap) {
      const data = yield call(deleteIpBlack, payload);
      return data;
    },
    *editIpBlackStatus({ payload }: Action, { select, call, put }: EffectsCommandMap) {
      const data = yield call(editIpBlackStatus, payload);
      return data;
    }
  },
  reducers: {
    // 更新state
    loadDataSuccess(state: IpBlackListState, { payload }: Action) {
      return {
        ...state,
        ...payload
      };
    }
  }
};

export default IpBlackListModel;
