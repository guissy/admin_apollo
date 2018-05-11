import {
  queryTableData,
  doStart,
  doStop,
  doDelete,
  getTypes,
  getLanguages,
  submitEditData,
  getEditData,
  submitAddData
} from './ContentManage.service';
import { Action, EffectsCommandMap, Model } from 'dva';
import { Result } from '../../../utils/result';

export interface ContentManageState {
  data: Array<Record>;
  types: Array<Type>;
  languages: Array<object>;
}
export interface Type {
  id: string;
  name: string;
}

export interface Record {
  begin_time: string;
  cover: string;
  created: string;
  created_uname: string;
  description: string;
  end_time: string;
  id: string;
  issue_mode: string;
  language_id: string;
  language_name: string;
  name: string;
  rule: string;
  sort: string;
  state: string;
  status: string;
  title: string;
  types: Array<Type>;
  updated: string;
  updated_uname: string;
}

const contentManageModel: Model = {
  namespace: 'contentManage',
  state: {
    data: [],
    types: []
  },
  effects: {
    *loadData({ payload }: Action, { select, call, put }: EffectsCommandMap) {
      const result = yield call(queryTableData, payload);
      if (result) {
        yield put({
          type: 'loadDataSuccess',
          payload: result
        });
      }
      return result;
    },
    *doStart({ payload }: Action, { select, call, put }: EffectsCommandMap) {
      const result = yield call(doStart, payload);
      return result;
    },
    *doStop({ payload }: Action, { select, call, put }: EffectsCommandMap) {
      const result = yield call(doStop, payload);
      return result;
    },
    *doDelete({ payload }: Action, { select, call, put }: EffectsCommandMap) {
      const result = yield call(doDelete, payload);
      return result;
    },
    *getTypes({ payload }: Action, { select, call, put }: EffectsCommandMap) {
      const result = yield call(getTypes, payload);
      if (result) {
        yield put({
          type: 'loadTypesSuccess',
          payload: {
            types: result.data
          }
        });
      }
      return result;
    },
    *getLanguages({ payload }: Action, { select, call, put }: EffectsCommandMap) {
      const result = yield call(getLanguages, payload);
      if (result) {
        yield put({
          type: 'loadLanguagesSuccess',
          payload: {
            languages: result.data
          }
        });
      }
      return result;
    },
    *submitEditData({ payload }: Action, { select, call, put }: EffectsCommandMap) {
      const result = yield call(submitEditData, payload);
      return result;
    },
    *submitAddData({ payload }: Action, { select, call, put }: EffectsCommandMap) {
      const result = yield call(submitAddData, payload);
      return result;
    },
    *getEditData({ payload }: Action, { select, call, put }: EffectsCommandMap) {
      const result = yield call(getEditData, payload);
      return result;
    }
  },
  reducers: {
    loadDataSuccess(state: ContentManageState, { payload }: Action) {
      return {
        ...state,
        ...payload
      };
    },
    loadTypesSuccess(state: ContentManageState, { payload }: Action) {
      return {
        ...state,
        ...payload
      };
    },
    loadLanguagesSuccess(state: ContentManageState, { payload }: Action) {
      return {
        ...state,
        ...payload
      };
    }
  }
};
export default contentManageModel;
export interface ContentManageState extends Result<object> {}
