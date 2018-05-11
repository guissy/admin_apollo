import { Action, EffectsCommandMap, Model } from 'dva';
import { queryAgentAudit, operateAgentAudit } from './AgentAudit.service';
import { Result, Attributes } from '../../../utils/result';

export interface AgentAuditState {
  data: Array<object>;
  attributes: Attributes;
}

const agentAuditModel: Model = {
  namespace: 'agentAudit',
  state: {
    data: [],
    attributes: {}
  },
  effects: {
    *queryAgentAudit({ payload }: Action, { select, call, put }: EffectsCommandMap) {
      const result: Result<object> = yield call(queryAgentAudit, payload);
      if (result.state === 0) {
        yield put({
          type: 'loadDataSuccess',
          payload: {
            data: result.data,
            attributes: result.attributes
          }
        });
      }
      return result;
    },
    *operateAgentAudit({ payload }: Action, { select, call, put }: EffectsCommandMap) {
      const data = yield call(operateAgentAudit, payload);
      return data;
    }
  },
  reducers: {
    // 更新state
    loadDataSuccess(state: AgentAuditState, { payload }: Action) {
      return {
        ...state,
        ...payload
      };
    }
  }
};
export default agentAuditModel;
