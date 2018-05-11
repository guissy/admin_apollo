import { Model, EffectsCommandMap, Action } from 'dva';
import { queryCk, changeStatus, doDelete, doApply, addCkManage, doEdit } from './FloatAd.service';
import { message } from 'antd';
import { Attributes } from '../../../utils/result';

export interface FloatAdState {
  data: Array<object>;
  attributes: Attributes;
  page_size: number;
  page: number;
}
export interface FloatAdData {
  align: string;
  name: string;
  id: string;
  language_name: string;
  language_id: string;
  approve: string;
  link: string;
  status: string;
  sort: string;
  picture: string;
  position: string;
  pf: string;
}
const FloatAdModel: Model = {
  namespace: 'floatAd',
  state: {
    data: [],
    attributes: {},
    page_size: 20,
    page: 1
  },
  effects: {
    *query({ payload }: Action, { put, call }: EffectsCommandMap) {
      const result = yield call(queryCk, payload);
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
    *doEnable({ payload }: Action, { put, call, select }: EffectsCommandMap) {
      const data = yield call(changeStatus, payload);
      return data;
    },
    *doDelete({ payload }: Action, { put, call, select }: EffectsCommandMap) {
      const data = yield call(doDelete, payload);
      return data;
    },
    *doApply({ payload }: Action, { put, call, select }: EffectsCommandMap) {
      const data = yield call(doApply, payload);
      return data;
    },
    *doAdd({ payload }: Action, { put, call, select }: EffectsCommandMap) {
      const data = yield call(addCkManage, payload);
      return data;
    },
    *doEdit({ payload }: Action, { put, call, select }: EffectsCommandMap) {
      const data = yield call(doEdit, payload);
      return data;
    }
  },
  reducers: {
    querySuccess(state: FloatAdState, { payload }: Action) {
      return { ...state, ...payload };
    },
    addLoading(state: FloatAdState, { payload }: Action) {
      return { ...state, ...payload };
    }
  }
};

export default FloatAdModel;
