import { message, Select } from 'antd';
import { queryData, saveSetting } from './EmailSetting.service';
import { Action, EffectsCommandMap, Model, SubscriptionAPI } from 'dva';
import { messageError } from '../../../utils/showMessage';

export interface EmailSettingState {
  is_ssl: string;
  mailaddress: string;
  mailhost: string;
  mailname: string;
  mailpass: string;
  mailport: string;
  verification: string;
}

const EmailSettingModel: Model = {
  namespace: 'emailSetting',
  state: {
    is_ssl: '',
    mailaddress: '',
    mailhost: '',
    mailname: '',
    mailpass: '',
    mailport: '',
    verification: ''
  },
  effects: {
    *loadData({ payload }: Action, { select, call, put }: EffectsCommandMap) {
      const result = yield call(queryData, payload);
      if (result.state === 0) {
        yield put({
          type: 'loadDataSuccess',
          payload: {
            data: result.data
          }
        });
      } else {
        messageError(result.message);
      }
    },
    *saveSetting({ payload }: Action, { select, call, put }: EffectsCommandMap) {
      // tslint:disable-next-line:no-any
      const emailSettingState = yield select((stateList: any) => stateList.emailSetting);
      const result = yield call(saveSetting, Object.assign(emailSettingState, payload));
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
    loadDataSuccess(state: EmailSettingState, { payload }: Action) {
      return {
        ...state,
        ...payload.data
      };
    }
  }
};

export default EmailSettingModel;
