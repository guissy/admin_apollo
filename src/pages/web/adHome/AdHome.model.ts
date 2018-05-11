import { Model, EffectsCommandMap, Action } from 'dva';
import { queryADhome, changeStatus, doDelete, doEdit, doApply, addHome } from './AdHome.service';
import { Attributes } from '../../../utils/result';
export interface AdHomeState {
  attributes: Attributes;
  data: Array<AdHomeData>;
  page: number;
  page_size: number;
}
export interface AdHomeData {
  name: string;
  id: string;
  language_name: string;
  language_id: string;
  approve_status: string;
  created: string;
  status: string;
  sort: number;
  content: string;
  pf: string;
}
const AdHomeModel: Model = {
  namespace: 'adHome',
  state: {
    data: [],
    attributes: {},
    page_size: 20,
    page: 1
  },
  effects: {
    *query({ payload }: Action, { put, call }: EffectsCommandMap) {
      const result = yield call(queryADhome, payload);
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
      const data = yield call(addHome, payload);
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
    *doApply({ payload }: Action, { put, call }: EffectsCommandMap) {
      const data = yield call(doApply, payload);
      return data;
    }
  },
  reducers: {
    querySuccess(state: AdHomeState, { payload }: Action) {
      return { ...state, ...payload };
    },
    addLoading(state: AdHomeState, { payload }: Action) {
      return { ...state, ...payload };
    }
  }
};

export default AdHomeModel;
