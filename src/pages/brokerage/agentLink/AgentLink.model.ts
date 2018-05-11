import { message } from 'antd';
import { queryTableData, transformStatus, add, edit, deleteLink } from './AgentLink.service';
import { Action, EffectsCommandMap, Model } from 'dva';
import { Attributes, Result } from '../../../utils/result';
import { showMessageForResult } from '../../../utils/showMessage';

export interface TableRow {
  comment: string;
  created: string;
  id: string;
  domain: string;
  status: string;
  updated: string;
}

export interface AgentLinkState {
  tableData: Array<TableRow>;
  attributes: Attributes;
}

const AgentLinkModel: Model = {
  namespace: 'agentLink',
  state: {
    tableData: [],
    attributes: {}
  },
  effects: {
    *loadData({ payload }: Action, { select, call, put }: EffectsCommandMap) {
      const result: Result<TableRow> = yield call(queryTableData, payload);
      if (result.state === 0) {
        yield put({
          type: 'loadDataSuccess',
          payload: {
            tableData: result.data,
            attributes: result.attributes
          }
        });
      }
      showMessageForResult(result);
      return result;
    },
    *transformStatus({ payload }: Action, { select, call, put }: EffectsCommandMap) {
      const result = yield call(transformStatus, payload);
      if (result.state === 0) {
        yield put({
          type: 'loadData',
          payload: {
            page: '1',
            page_size: '20'
          }
        });
      }
      return result;
    },
    *add({ payload }: Action, { select, call, put }: EffectsCommandMap) {
      const result = yield call(add, payload);
      if (result.state === 0) {
        yield put({
          type: 'loadData',
          payload: {
            page: '1',
            page_size: '20'
          }
        });
      }
      return result;
    },
    *edit({ payload }: Action, { select, call, put }: EffectsCommandMap) {
      const result = yield call(edit, payload);
      if (result.state === 0) {
        yield put({
          type: 'loadData',
          payload: {
            page: '1',
            page_size: '20'
          }
        });
      }
      return result;
    },
    *delete({ payload }: Action, { select, call, put }: EffectsCommandMap) {
      const result = yield call(deleteLink, payload);
      if (result.state === 0) {
        yield put({
          type: 'loadData',
          payload: {
            page: '1',
            page_size: '20'
          }
        });
      }
      return result;
    }
  },
  reducers: {
    loadDataSuccess(state: AgentLinkState, { payload }: Action) {
      return {
        ...state,
        ...payload
      };
    }
  }
};

export default AgentLinkModel;
