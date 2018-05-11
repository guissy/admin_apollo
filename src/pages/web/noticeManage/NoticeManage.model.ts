import { Model, EffectsCommandMap, Action } from 'dva';
import { queryNotice, doDelete, doRelease, addNotice } from './NoticeManage.service';
import { Attributes } from '../../../utils/result';
export interface NoticeState {
  attributes: Attributes;
  data: NoticeData;
}
export interface NoticeData {
  admin_name: string;
  admin_uid: string;
  content: string;
  created: string;
  id: string;
  recipient: string;
  send_type: string;
  status: string;
  title: string;
  type: string;
  updated: string;
  user_id: string;
  username?: null | string;
}
const NoticeManageModel: Model = {
  namespace: 'noticeManage',
  state: {
    attributes: {},
    data: []
  },
  effects: {
    *query({ payload }: Action, { load }: EffectsCommandMap) {
      return yield load(queryNotice, payload);
    },
    *doAdd({ payload }: Action, { put, call }: EffectsCommandMap) {
      return yield call(addNotice, payload);
    },
    *doDelete({ payload }: Action, { put, call }: EffectsCommandMap) {
      return yield call(doDelete, payload);
    },
    *doRelease({ payload }: Action, { put, call }: EffectsCommandMap) {
      return yield call(doRelease, payload);
    }
  },
  reducers: {
    querySuccess(state: NoticeState, { payload }: Action) {
      return { ...state, ...payload };
    }
  }
};

export default NoticeManageModel;
