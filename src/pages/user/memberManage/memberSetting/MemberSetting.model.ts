import { Action, EffectsCommandMap, Model } from 'dva';
import {
  queryUserSetInfo,
  permissionsSet,
  statusSet,
  removeBind,
  kickedOutOnline
} from './MemberSetting.service';

export interface MemberSettingState {
  memberSetInfo: {
    refuse_transfer: object;
    state: string;
    is_mtoken_bind: string;
    online: number;
    refuse_withdraw: string;
    refuse_sale: string;
    refuse_rebate: string;
    role: string;
  };
  loading: boolean;
}

const MemberSettingModel: Model = {
  namespace: 'memberSetting',
  state: {
    memberSetInfo: {
      refuse_transfer: {}
    },
    loading: false
  },
  effects: {
    *loadData({ payload }: Action, { select, call, put }: EffectsCommandMap) {
      yield put({
        type: 'saveData',
        payload: {
          loading: true
        }
      });
      const data = yield call(queryUserSetInfo, payload);
      if (data) {
        yield put({
          type: 'saveData',
          payload: {
            memberSetInfo: data.data,
            loading: false
          }
        });
      }
    },
    *permissionsSet({ payload }: Action, { select, call, put }: EffectsCommandMap) {
      yield put({
        type: 'saveData',
        payload: {
          loading: true
        }
      });
      const data = yield call(permissionsSet, payload);
      return data.data && data.state === 0;
    },
    *statusSet({ payload }: Action, { select, call, put }: EffectsCommandMap) {
      yield put({
        type: 'saveData',
        payload: {
          loading: true
        }
      });
      const data = yield call(statusSet, payload);
      return data.data && data.state === 0;
    },
    *removeBind({ payload }: Action, { select, call, put }: EffectsCommandMap) {
      yield put({
        type: 'saveData',
        payload: {
          loading: true
        }
      });
      const data = yield call(removeBind, payload);
      return data.data && data.state === 0;
    },
    *kickedOutOnline({ payload }: Action, { select, call, put }: EffectsCommandMap) {
      yield put({
        type: 'saveData',
        payload: {
          loading: true
        }
      });
      const data = yield call(kickedOutOnline, payload);
      return data.data && data.state === 0;
    }
  },
  reducers: {
    // 更新state
    saveData(state: MemberSettingState, { payload }: Action) {
      return {
        ...state,
        ...payload
      };
    }
  }
};
export default MemberSettingModel;
