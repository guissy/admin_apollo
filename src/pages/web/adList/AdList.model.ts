import { Model, EffectsCommandMap, Action } from 'dva';
import { queryAD, changeStatus, doDelete, doApply, addADlist, doEdit } from './AdList.service';
import { Attributes } from '../../../utils/result';

export interface AdListState {
  attributes: Attributes;
  data: Array<AdListData>;
  page: number;
  page_size: number;
}
export interface AdListData {
  name: string;
  id: string;
  language_name: string;
  language_id: string;
  link: string;
  type: string;
  approve: string;
  created: string;
  status: string;
  picture: string;
  position: string;
  content: string;
  pf: string;
  sort: string;
}
const AdListModel: Model = {
  namespace: 'adList',
  state: {
    attributes: {},
    data: [],
    page: 1,
    page_size: 20
  },
  effects: {
    *query({ payload }: Action, { put, call }: EffectsCommandMap) {
      const result = yield call(queryAD, payload);
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
      const data = yield call(addADlist, payload);
      return data;
    },
    *doEdit({ payload }: Action, { put, call, select }: EffectsCommandMap) {
      const data = yield call(doEdit, payload);
      return data;
    }
  },
  reducers: {
    querySuccess(state: AdListState, { payload }: Action) {
      return { ...state, ...payload };
    },
    addLoading(state: AdListState, { payload }: Action) {
      return { ...state, ...payload };
    }
  }
};

export default AdListModel;
