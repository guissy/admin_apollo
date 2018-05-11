import { Action, EffectsCommandMap, Model } from 'dva';
import { queryTableData, deleteActive, addActive, editActive } from './TypeList.service';
import { Result } from '../../../utils/result';

export interface TypeListState {
  data: Array<object>;
}
export interface Record {
  created: string;
  created_uname: string;
  description: string;
  id: string;
  name: string;
  sort: string;
  status: string;
  updated: string;
  updated_uname: string;
}
const TypeListModel: Model = {
  namespace: 'typeList',
  state: {
    data: []
  },
  effects: {
    *loadData({ payload }: Action, { load }: EffectsCommandMap) {
      return yield load(queryTableData, payload);
    },
    *deleteActive({ payload }: Action, { select, call, put }: EffectsCommandMap) {
      return yield call(deleteActive, payload);
    },
    *addActive({ payload }: Action, { select, call, put }: EffectsCommandMap) {
      return yield call(addActive, payload);
    },
    *editActive({ payload }: Action, { select, call, put }: EffectsCommandMap) {
      return yield call(editActive, payload);
    }
  },
  reducers: {
    addLoading(state: TypeListState, { payload }: Action) {
      return {
        ...state,
        ...payload
      };
    },
    loadDataSuccess(state: TypeListState, { payload }: Action) {
      return {
        ...state,
        ...payload
      };
    }
  }
};
export default TypeListModel;
export interface TypeListState extends Result<object> {}
