import { Action, EffectsCommandMap, Model } from 'dva';
import { queryUserInfo, queryQuestion, saveInformation } from './Information.service';

export interface MemberInformationState {
  userInfoObj: object;
  answerArr: Array<object>;
}

const MemberInformationModel: Model = {
  namespace: 'memberInformation',
  state: {
    userInfoObj: {},
    answerArr: []
  },
  effects: {
    *loadData({ payload }: Action, { select, call, put }: EffectsCommandMap) {
      const data = yield call(queryUserInfo, payload);
      if (data) {
        yield put({
          type: 'loadDataSuccess',
          payload: {
            userInfoObj: data.data
          }
        });
      }
    },
    *loadQuestion({ payload }: Action, { select, call, put }: EffectsCommandMap) {
      const data = yield call(queryQuestion, payload);
      if (data) {
        yield put({
          type: 'loadDataSuccess',
          payload: {
            answerArr: data.data.data
          }
        });
      }
    },
    *saveInformation({ payload }: Action, { select, call, put }: EffectsCommandMap) {
      const data = yield call(saveInformation, payload);
      return data;
    }
  },
  reducers: {
    // 更新state
    loadDataSuccess(state: MemberInformationState, { payload }: Action) {
      return {
        ...state,
        ...payload
      };
    }
  }
};
export default MemberInformationModel;
