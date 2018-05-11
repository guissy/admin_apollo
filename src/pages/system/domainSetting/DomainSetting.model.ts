import { message } from 'antd';
import {
  queryDomainData,
  queryLanguagesData,
  queryWebsiteStyleData,
  submitData
} from './DomainSetting.service';
import { Action, EffectsCommandMap, Model, SubscriptionAPI } from 'dva';
import { messageError } from '../../../utils/showMessage';

export interface DomainDetail {
  created: string;
  domain: string;
  first: string;
  id: string;
  type: string;
}

export interface InfoDetail {
  admin_tid: string | null;
  admin_tname: string | null;
  agent_tid: string | null;
  agent_tname: string | null;
  bottom: string;
  created: string;
  domains: Array<DomainDetail>;
  id: string;
  is_ssl: string;
  lang: string;
  logo: string;
  m_tid: string;
  m_tname: string;
  name: string;
  remarks: string | null;
  title: string;
  updated: string;
  www_tid: string;
  www_tname: string;
}

export interface DomainNameSetState {
  domain: string;
  info: InfoDetail;
}

const DomainSettingModel: Model = {
  namespace: 'domainSetting',
  state: {
    domain: '',
    info: {}
  },
  effects: {
    *loadData({ payload }: Action, { select, call, put }: EffectsCommandMap) {
      const result = yield call(queryDomainData, payload);
      if (result.state === 0) {
        yield put({
          type: 'loadDataSuccess',
          payload: { ...result.data }
        });
      }
    },
    *submit({ payload }: Action, { select, call, put }: EffectsCommandMap) {
      const result = yield call(submitData, payload);
      if (result.state === 0) {
        yield put({
          type: 'loadData',
          payload: {}
        });
      } else {
        messageError(result.message);
      }
    }
  },
  reducers: {
    loadDataSuccess(state: DomainNameSetState, { payload }: Action) {
      return {
        ...state,
        ...payload
      };
    }
  }
};

export default DomainSettingModel;
