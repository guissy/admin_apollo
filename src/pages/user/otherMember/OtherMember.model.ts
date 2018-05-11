import { Action, EffectsCommandMap, Model } from 'dva';
import { queryOtherMember, queryOtherGameList } from './OtherMember.service';
import { Result, Attributes } from '../../../utils/result';

export interface OtherMemberState {
  data: Array<object>;
  attributes: Attributes;
  gameList: Array<object>;
}

const otherMemberModel: Model = {
  namespace: 'otherMember',
  state: {
    data: [],
    attributes: {},
    gameList: []
  },
  effects: {
    *queryOtherMember({ payload }: Action, { select, call, put }: EffectsCommandMap) {
      const result: Result<object> = yield call(queryOtherMember, payload);
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
    *queryOtherGameList({ payload }: Action, { select, call, put }: EffectsCommandMap) {
      const result: Result<object> = yield call(queryOtherGameList, payload);
      if (result.state === 0) {
        yield put({
          type: 'loadDataSuccess',
          payload: {
            gameList: result.data
          }
        });
      }
      return result;
    }
  },
  reducers: {
    // 更新state
    loadDataSuccess(state: OtherMemberState, { payload }: Action) {
      return {
        ...state,
        ...payload
      };
    }
  }
};
export default otherMemberModel;
