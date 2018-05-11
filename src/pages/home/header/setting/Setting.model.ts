import { Action, EffectsCommandMap, SubscriptionAPI } from 'dva';
import environment from '../../../../utils/environment';

const initial = {
  nav: window.localStorage.getItem(environment.nav) || 'left', // 导航
  lang: window.localStorage.getItem(environment.lang) || 'zh_CN', // 语言
  theme: window.localStorage.getItem(environment.theme) || 'classic', // 主题
  sound_message: JSON.parse(window.localStorage.getItem(environment.sound_message) || 'false'), // 消息提示
  sound_deposit: JSON.parse(window.localStorage.getItem(environment.sound_deposit) || 'false'), // 入款提示
  sound_withdraw: JSON.parse(window.localStorage.getItem(environment.sound_withdraw) || 'false') // 出款提示
};

const setStorage = (values = initial) => {
  environment.locale = values.lang;
  window.localStorage.setItem(environment.nav, values.nav);
  window.localStorage.setItem(environment.lang, values.lang);
  window.localStorage.setItem(environment.theme, values.theme);
  window.localStorage.setItem(environment.sound_message, `${values.sound_message}`);
  window.localStorage.setItem(environment.sound_deposit, `${values.sound_deposit}`);
  window.localStorage.setItem(environment.sound_withdraw, `${values.sound_withdraw}`);
};

export default {
  namespace: 'setting',
  state: {
    nav: initial.nav,
    lang: initial.lang,
    theme: initial.theme,
    sound_message: initial.sound_message,
    sound_deposit: initial.sound_deposit,
    sound_withdraw: initial.sound_withdraw
  },
  subscriptions: {
    setup({ dispatch }: SubscriptionAPI) {
      setStorage();
    }
  },
  effects: {
    *setting({ payload }: Action, { put }: EffectsCommandMap) {
      setStorage(payload);
      yield put({ type: 'globalSetting', payload: { ...payload } });
      yield put({ type: 'header/switchCollapsed', payload: { collapsed: false } });
    }
  },
  reducers: {
    globalSetting(state: SettingState, action: Action) {
      return { ...state, ...action.payload };
    }
  }
};

export interface SettingState {
  nav: string;
  lang: string;
  theme: string;
  sound_message: boolean;
  sound_deposit: boolean;
  sound_withdraw: boolean;
}
