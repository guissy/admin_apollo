import { Model, EffectsCommandMap, Action } from 'dva';
import { queryProxy, changeStatus, doApply, doDelete, doAdd, doEdit } from './ProxyCopy.service';
import { Attributes } from '../../../utils/result';
export interface ProxyCopyState {
  data: Array<ProxyCopyData>;
  attributes: Attributes;
  page: number;
  page_size: number;
}
export interface ProxyCopyData {
  name: string;
  id: string;
  language_name: string;
  language_id: string;
  type: string;
  approve_status: string;
  created: string;
  status: string;
  sort: string;
  content: string;
  pf: string;
}
const ProxyCopyModel: Model = {
  namespace: 'proxycopy',
  state: {
    data: [],
    attributes: {},
    page: 1,
    page_size: 20
  },
  effects: {
    *query({ payload }: Action, { put, call }: EffectsCommandMap) {
      const result = yield call(queryProxy, payload);
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
    *doApply({ payload }: Action, { put, call, select }: EffectsCommandMap) {
      const data = yield call(doApply, payload);
      return data;
    },
    *doDelete({ payload }: Action, { put, call, select }: EffectsCommandMap) {
      const data = yield call(doDelete, payload);
      return data;
    },
    *doAdd({ payload }: Action, { put, call, select }: EffectsCommandMap) {
      const data = yield call(doAdd, payload);
      return data;
    },
    *doEdit({ payload }: Action, { put, call, select }: EffectsCommandMap) {
      const data = yield call(doEdit, payload);
      return data;
    }
  },
  reducers: {
    querySuccess(state: ProxyCopyState, { payload }: Action) {
      return { ...state, ...payload };
    },
    addLoading(state: ProxyCopyState, { payload }: Action) {
      return { ...state, ...payload };
    }
  }
};
export default ProxyCopyModel;
