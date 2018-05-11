import { Action, EffectsCommandMap, Model } from 'dva';
import {
  getBaseInfo,
  resetLoginPassword,
  resetWithdrawalsPassword,
  saveBaseInfo
} from './AgentInformation.service';

export interface AgentInformationState {
  agentBaseInfo: AgentInformationData;
}

export default {
  namespace: 'agentBase',
  state: {
    agentBaseInfo: {}
  },
  effects: {
    *getBaseInfo({ payload }: Action, { put, call }: EffectsCommandMap) {
      const result = yield call(getBaseInfo, payload);
      if (result.data) {
        yield put({
          type: 'getBaseSuccess',
          payload: {
            agentBaseInfo: result.data
          }
        });
      }
      return result;
    },
    *doSaveInfo({ payload }: Action, { put, call }: EffectsCommandMap) {
      const data = yield call(saveBaseInfo, payload);
      return data;
    },
    *doResetLogin({ payload }: Action, { put, call }: EffectsCommandMap) {
      const data = yield call(resetLoginPassword, payload);
      return data;
    },
    *doResetWithdrawals({ payload }: Action, { put, call, select }: EffectsCommandMap) {
      const data = yield call(resetWithdrawalsPassword, payload);
      return data;
    }
  },
  reducers: {
    getBaseSuccess(state: AgentInformationState, { payload }: Action) {
      return { ...state, ...payload };
    }
  }
};
export interface AgentInformationData {
  id?: string;
  region_id?: string;
  wallet_id?: string;
  pid?: string;
  currency?: string;
  name?: string;
  gender?: string;
  pid_join?: string;
  type?: string;
  birth?: string;
  truename?: string;
  code?: string;
  link?: string;
  inferiors_link?: string;
  inferisors_num?: string;
  country_id?: string;
  province_id?: string;
  city_id?: string;
  language_id?: string;
  level?: string;
  email?: string;
  telphone_code?: string;
  mobile?: string;
  qq?: string;
  weixin?: string;
  skype?: string;
  last_login?: string;
  login_ip?: string;
  channel?: string;
  status?: string;
  memo?: string;
  created?: string;
  updated?: string;
  ctype?: string;
  register_ip?: string;
  up_agent_name?: string;
  play_num?: string;
  bkge?: Array<object>;
  language?: string;
  higher_level?: string;
  country?: string;
  province?: string;
  city?: string;
}
