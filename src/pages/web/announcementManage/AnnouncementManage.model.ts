import { Model, EffectsCommandMap, Action } from 'dva';
import {
  queryNotice,
  doDelete,
  doRelease,
  addNotice,
  changeStatus,
  getUserLevel,
  doEdit
} from './AnnouncementManage.service';
import { Attributes } from '../../../utils/result';
export interface AnnouncementState {
  attributes: Attributes;
  data: Array<AnnouncementData>;
  userLevel: Array<object>;
}
export interface AnnouncementData {
  admin_name: string;
  admin_uid: string;
  content: string;
  created: string;
  end_time: string;
  language_id: string;
  pic: string;
  popup_type: string | number;
  id: string;
  recipient: string;
  recipient_origin: string;
  send_type: string;
  start_time: string;
  status: string;
  title: string;
  type: string;
  updated: string;
  user_id: string;
  username?: null | string;
}
const AnnouncementManageModel: Model = {
  namespace: 'announcementManage',
  state: {
    attributes: {},
    data: [],
    userLevel: []
  },
  effects: {
    *query({ payload }: Action, { put, call }: EffectsCommandMap) {
      const result = yield call(queryNotice, payload);
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
    *doAdd({ payload }: Action, { put, call, select }: EffectsCommandMap) {
      const data = yield call(addNotice, payload);
      return data;
    },
    *doEdit({ payload }: Action, { put, call, select }: EffectsCommandMap) {
      const data = yield call(doEdit, payload);
      return data;
    },
    *doDelete({ payload }: Action, { put, call }: EffectsCommandMap) {
      const data = yield call(doDelete, payload);
      return data;
    },
    *doRelease({ payload }: Action, { put, call }: EffectsCommandMap) {
      const data = yield call(doRelease, payload);
      return data;
    },
    *doStatus({ payload }: Action, { put, call }: EffectsCommandMap) {
      const data = yield call(changeStatus, payload);
      return data;
    },
    *doUseLevel({ payload }: Action, { put, call }: EffectsCommandMap) {
      const result = yield call(getUserLevel, payload);
      if (result.data) {
        yield put({
          type: 'querySuccess',
          payload: {
            userLevel: result.data
          }
        });
      }
      return result;
    }
  },
  reducers: {
    querySuccess(state: AnnouncementState, { payload }: Action) {
      return { ...state, ...payload };
    },
    addLoading(state: AnnouncementState, { payload }: Action) {
      return { ...state, ...payload };
    }
  }
};

export default AnnouncementManageModel;
