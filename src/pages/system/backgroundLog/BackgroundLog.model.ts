import { Attributes } from './../../../utils/result';
import { message } from 'antd';
import { queryTableData } from './BackgroundLog.service';
import { Action, EffectsCommandMap, Model } from 'dva';
import { messageError } from '../../../utils/showMessage';

export interface BackgroundLogState {
  tableData: Array<object>;
  attributes: Attributes;
}

const BackgroundLogModel: Model = {
  namespace: 'backgroundLog',
  state: {
    tableData: [],
    attributes: {}
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
    loadDataSuccess(state: BackgroundLogState, { payload }: Action) {
      return {
        ...state,
        ...payload,
        isLoading: false
      };
    }
  }
};

export default BackgroundLogModel;
