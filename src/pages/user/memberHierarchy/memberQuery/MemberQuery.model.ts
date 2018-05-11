import { Action, EffectsCommandMap, Model } from 'dva';
import {
  queryMember,
  queryAllMemberHierarchy,
  lockMembers,
  layeredMembers
} from './MemberQuery.service';
import { Result, Attributes } from '../../../../utils/result';

export interface MemberQueryState {
  data: Array<object>;
  attributes: Attributes;
  levelList: Array<object>;
}

const MemberQueryModel: Model = {
  namespace: 'memberQuery',
  state: {
    data: [],
    attributes: {},
    levelList: []
  },
  effects: {
    *loadData({ payload }: Action, { select, call, put }: EffectsCommandMap) {
      const result: Result<object> = yield call(queryMember, payload);
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
    *queryAllMemberHierarchy({ payload }: Action, { select, call, put }: EffectsCommandMap) {
      const result: Result<object> = yield call(queryAllMemberHierarchy, payload);
      if (result.state === 0) {
        yield put({
          type: 'loadDataSuccess',
          payload: {
            levelList: result.data
          }
        });
      }
      return result;
    },
    *lockMembers({ payload }: Action, { select, call, put }: EffectsCommandMap) {
      const data = yield call(lockMembers, payload);
      return data;
    },
    *layeredMembers({ payload }: Action, { select, call, put }: EffectsCommandMap) {
      const data = yield call(layeredMembers, payload);
      return data;
    }
  },
  reducers: {
    // 更新state
    loadDataSuccess(state: MemberQueryState, { payload }: Action) {
      return {
        ...state,
        ...payload
      };
    }
  }
};
export default MemberQueryModel;
