import { Action, EffectsCommandMap, Model } from 'dva';
import {
  queryMemberLabelTableData,
  addMemberLabel,
  editMemberLabel,
  deleteMemberLabel
} from './MemberLabel.service';
import { Result, Attributes } from '../../../utils/result';

export interface MemberLabelState {
  data: Array<object>;
  attributes: Attributes;
}

const MemberLabelModel: Model = {
  namespace: 'memberLabel',
  state: {
    data: [],
    attributes: {}
  },
  effects: {
    // 会员标签列表
    *loadData({ payload }: Action, { select, call, put }: EffectsCommandMap) {
      const result: Result<object> = yield call(queryMemberLabelTableData, payload);
      if (result.data && result.state === 0) {
        yield put({
          type: 'loadDataSuccess',
          payload: {
            data: result.data,
            attributes: result.attributes
          }
        });
      }
    },
    *addMemberLabel({ payload }: Action, { select, call, put }: EffectsCommandMap) {
      const data = yield call(addMemberLabel, payload);
      return data;
    },
    *editMemberLabel({ payload }: Action, { select, call, put }: EffectsCommandMap) {
      const data = yield call(editMemberLabel, payload);
      return data;
    },
    *deleteMemberLabel({ payload }: Action, { select, call, put }: EffectsCommandMap) {
      const data = yield call(deleteMemberLabel, payload);
      return data;
    }
  },
  reducers: {
    loadDataSuccess(state: MemberLabelState, { payload }: Action) {
      return {
        ...state,
        ...payload
      };
    }
  }
};

export default MemberLabelModel;
