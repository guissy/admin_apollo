import { message } from 'antd';
import { queryTableData, deleteRowData, sendEmail, addEmail } from './EmailList.service';
import { Action, EffectsCommandMap, Model, SubscriptionAPI } from 'dva';
import { messageError } from '../../../utils/showMessage';

export interface EmailListState {
  tableData: Array<object>;
  isLoading: boolean;
}

const emailListModel: Model = {
  namespace: 'emailList',
  state: {
    tableData: []
  },
  effects: {
    *loadData({ payload }: Action, { select, call, put }: EffectsCommandMap) {
      const data = yield call(queryTableData, payload);
      if (data.state === 0) {
        yield put({
          type: 'loadDataSuccess',
          payload: {
            tableData: data.data
          }
        });
      }
    },
    *deleteRowData({ payload }: Action, { select, call, put }: EffectsCommandMap) {
      const result = yield call(deleteRowData, payload);
      if (result.state === 0) {
        yield put({
          type: 'loadData',
          payload: {
            page: '1',
            page_size: '20'
          }
        });
      }
    },
    *sendEmail({ payload }: Action, { select, call, put }: EffectsCommandMap) {
      const result = yield call(sendEmail, payload);
      if (result.state === 0) {
        yield put({
          type: 'loadData',
          payload: {
            page: '1',
            page_size: '20'
          }
        });
      } else {
        yield put({
          type: 'loadData',
          payload: {
            page: '1',
            page_size: '20'
          }
        });
        messageError(result.message);
      }
    },
    *addEmail({ payload }: Action, { select, call, put }: EffectsCommandMap) {
      const result = yield call(addEmail, payload);
      if (result.state === 0) {
        yield put({
          type: 'loadData',
          payload: {
            page: '1',
            page_size: '20'
          }
        });
      } else {
        messageError(result.message);
      }
    }
  },
  reducers: {
    loadDataSuccess(state: EmailListState, { payload }: Action) {
      return {
        ...state,
        ...payload
      };
    }
  }
};

export default emailListModel;
