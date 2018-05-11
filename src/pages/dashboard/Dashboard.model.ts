import { Action, EffectsCommandMap, SubscriptionAPI } from 'dva';
import {
  queryToday,
  queryChannel,
  queryGames,
  queryMember,
  queryAmount
} from './Dashboard.service';

export default {
  namespace: 'dashboard',
  state: {},
  subscriptions: {},
  effects: {
    *today({ payload }: Action, { call, put }: EffectsCommandMap) {
      const result = yield call(queryToday);
      if (result.state === 0) {
        yield put({ type: 'queryTodaySuccess', payload: result.data });
      }
    },
    *channel({ payload }: Action, { call, put }: EffectsCommandMap) {
      const result = yield call(queryChannel);
      if (result.state === 0) {
        yield put({ type: 'queryChannelSuccess', payload: result.data });
      }
    }
  },
  reducers: {
    // tslint:disable-next-line:no-any
    queryTodaySuccess: (state: TodayState, action: any) => ({ ...state, ...action.payload }),
    // tslint:disable-next-line:no-any
    queryChannelSuccess: (state: ChannelState, action: any) => ({ ...state, ...action.payload })
  }
};

export interface TodayState {
  active_members: string; // 今日活跃用户
  new_members: string; // 今日新增用户
  online_members: string; // 今日上线用户数
  deposit_money: string; // 今日存款总金额
  best_times: string; // 今日总订单数
  best_money: string; // 今日总订单金额
}

interface ChannelState extends TodayState {}

export interface DashboardState extends TodayState {}
