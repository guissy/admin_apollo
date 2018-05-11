import { Action, EffectsCommandMap, Model } from 'dva';
import { getMarketInfo } from './PromotionInfo.service';

export interface AgentMarketState {
  agentMarketInfo: AgentMarketData;
}

export default {
  namespace: 'promotionInfo',
  state: {
    agentMarketInfo: {}
  },
  effects: {
    *getMarketInfo({ payload }: Action, { put, call }: EffectsCommandMap) {
      const result = yield call(getMarketInfo, payload);
      if (result.data) {
        yield put({
          type: 'getBaseSuccess',
          payload: {
            agentMarketInfo: result.data
          }
        });
      }
      return result;
    }
  },
  reducers: {
    getBaseSuccess(state: AgentMarketState, { payload }: Action) {
      return { ...state, ...payload };
    }
  }
};
export interface AgentMarketData {
  code: string;
  member_ads_site: Array<string>;
  sub_agent_site: Array<string>;
}
