import { Action, EffectsCommandMap, Model } from 'dva';
import {
  queryTableData,
  doSetUserStatus,
  queryTagList,
  doSetUserTags
} from './MemberManage.service';
import { Result, Attributes } from '../../../utils/result';

export interface MemberManageState {
  tagList: Array<object>;
  data: Array<object>;
  attributes: Attributes;
}

const MemberManageModel: Model = {
  namespace: 'memberManage',
  state: {
    tagList: [],
    data: [],
    attributes: {}
  },
  effects: {
    *queryTableData({ payload }: Action, { select, call, put }: EffectsCommandMap) {
      const result: Result<object> = yield call(queryTableData, payload);
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
    // 设置账号状态
    *doSetUserStatus({ payload }: Action, { select, call, put }: EffectsCommandMap) {
      const result: Result<object> = yield call(doSetUserStatus, payload);
      return result;
    },
    // 标签列表
    *loadTagList({ payload }: Action, { select, call, put }: EffectsCommandMap) {
      const result: Result<object> = yield call(queryTagList, payload);
      if (result.state === 0) {
        yield put({
          type: 'loadDataSuccess',
          payload: {
            tagList: result.data
          }
        });
      }
      return result;
    },
    // 打标签,取消标签
    *doSetUserTags({ payload }: Action, { select, call, put }: EffectsCommandMap) {
      const result: Result<object> = yield call(doSetUserTags, payload);
      return result;
    }
  },
  reducers: {
    loadDataSuccess(state: MemberManageState, { payload }: Action) {
      return {
        ...state,
        ...payload
      };
    }
  }
};
export default MemberManageModel;
