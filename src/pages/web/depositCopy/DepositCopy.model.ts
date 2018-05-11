import { Model, EffectsCommandMap, Action } from 'dva';
import {
  queryDeposit,
  changeStatus,
  doApply,
  doDelete,
  addDeposit,
  doEdit
} from './DepositCopy.service';
import { Attributes } from '../../../utils/result';

export interface DepositCopyState {
  data: Array<object>;
  attributes: Attributes;
  page: number;
  page_size: number;
}
export interface DepositCopyData {
  apply_to: string;
  name: string;
  id: string;
  language_name: string;
  language_id: string;
  type: string;
  approve_status: string;
  created: string;
  status: string;
  sort: string;
  pf: string;
  content: string;
}
const DepositCopyModel: Model = {
  namespace: 'depositcopy',
  state: {
    data: [],
    attributes: true,
    page_size: 20,
    page: 1
  },
  effects: {
    *query({ payload }: Action, { put, call }: EffectsCommandMap) {
      const result = yield call(queryDeposit, payload);
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
      const data = yield call(addDeposit, payload);
      return data;
    },
    *doEdit({ payload }: Action, { put, call, select }: EffectsCommandMap) {
      const data = yield call(doEdit, payload);
      return data;
    }
  },
  reducers: {
    querySuccess(state: DepositCopyState, { payload }: Action) {
      return { ...state, ...payload };
    },
    addLoading(state: DepositCopyState, { payload }: Action) {
      return { ...state, ...payload };
    }
  }
};

export default DepositCopyModel;
