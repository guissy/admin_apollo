import { Attributes } from './../../../utils/result';
import { message } from 'antd';
import { queryTableData } from './MemberLog.service';
import { Action, EffectsCommandMap, Model } from 'dva';
import { messageError } from '../../../utils/showMessage';

export interface MemberLogState {
  tableData: Array<object>;
  attributes: Attributes;
}

const memberLogModel: Model = {
  namespace: 'memberLog',
  state: {
    tableData: []
  },
  effects: {
    *loadData({ payload }: Action, { select, call, put }: EffectsCommandMap) {
      const result = yield call(queryTableData, payload);
      if (result.state === 0) {
        yield put({
          type: 'loadDataSuccess',
          payload: {
            tableData: result.data,
            attributes: result.attributes
          }
        });
      } else {
        messageError(result.message);
      }
    }
  },
  reducers: {
    loadDataSuccess(state: MemberLogState, { payload }: Action) {
      return {
        ...state,
        ...payload,
        isLoading: false
      };
    }
  }
};

export default memberLogModel;
