import { Model, EffectsCommandMap, Action } from 'dva';
import { queryAgent, changeStatus, doDelete, addAgent, doEdit } from './AgentAccount.service';
import { Attributes } from '../../../utils/result';
export interface AgentAccountState {
  attributes: Attributes;
  data: Array<AgentAccountData>;
  page: number;
  page_size: number;
}

const AgentAccountModel: Model = {
  namespace: 'agentAccount',
  state: {
    data: [],
    attributes: {},
    page_size: 20,
    page: 1
  },
  effects: {
    *query({ payload }: Action, { put, call }: EffectsCommandMap) {
      const result = yield call(queryAgent, payload);
      if (result.data) {
        yield put({
          type: 'querySuccess',
          payload: {
            data: result.data,
            attributes: result.attributes
          }
        });
      }
      return result;
    },
    *doEnable({ payload }: Action, { put, call }: EffectsCommandMap) {
      const data = yield call(changeStatus, payload);
      return data;
    },
    *doAdd({ payload }: Action, { put, call, select }: EffectsCommandMap) {
      const data = yield call(addAgent, payload);
      return data;
    },
    *doEdit({ payload }: Action, { put, call, select }: EffectsCommandMap) {
      const data = yield call(doEdit, payload);
      return data;
    }
  },
  reducers: {
    querySuccess(state: AgentAccountState, { payload }: Action) {
      return { ...state, ...payload };
    },
    addLoading(state: AgentAccountState, { payload }: Action) {
      return { ...state, ...payload };
    }
  }
};

export default AgentAccountModel;
export interface AgentAccountData {
  id: string;
  admin_user: string;
  avatar: string;
  balance: string;
  birth: string;
  channel: string;
  code: string;
  created: string;
  currency: string;
  email: string;
  gender: string;
  ip: string;
  inferiors_link: string;
  inferisors_num: string;
  language: string;
  last_login: string;
  level: string;
  link: string;
  login_ip: string;
  memo: string;
  mobile: string;
  name: string;
  online: string;
  pid: string;
  play_num: string;
  pname: string;
  qq: string;
  skype: string;
  state: string;
  status: string;
  truename: string;
  type: string;
  updated: string;
  user_account: string;
  weixin: string;
}
