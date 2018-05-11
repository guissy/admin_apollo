import { queryTableData, doRevoke } from './DiscountDetail.service';
import { Action, EffectsCommandMap, Model } from 'dva';
import { Result } from '../../../../utils/result';

export interface DiscountDetailState {
  data: Array<Record>;
  revokeLoading: boolean;
}
export interface Record {
  agent_id: string;
  agent_name: string;
  coupon: string;
  detail_id: string;
  end_time: string;
  id: string;
  level: string;
  member_level: string;
  name: string;
  rebet_id: string;
  rebet_time: string;
  revoked: string;
  start_time: string;
  status: string;
  total_coupon: string;
  total_people: string;
  total_valid_bet: string;
  user_id: string;
  user_name: string;
  valid_bet: string;
  withdraw_bet: string;
  withdraw_per: string;
  games: Array<Game>;
  valid_coupon: string;
}

export interface Game {
  coupon: number;
  game_id: string | number;
  game_name: string;
  game_type: string;
  valid_bet: number;
}
const DiscountDetailModel: Model = {
  namespace: 'discountdetail',
  state: {
    data: [],
    revokeLoading: false
  },
  effects: {
    *loadData({ payload }: Action, { select, call, put }: EffectsCommandMap) {
      const result = yield call(queryTableData, payload);
      if (result.data) {
        result.data.forEach((element: Record) => {
          element.valid_coupon =
            Number(element.valid_bet) / 100 + ',' + Number(element.coupon) / 100;
          element.games.forEach((item: Game, key: number) => {
            element[`game_${key}`] = Number(item.valid_bet) / 100 + ',' + Number(item.coupon) / 100;
          });
        });
        yield put({
          type: 'loadDataSuccess',
          payload: result
        });
      }
      return result;
    },
    *doRevoke({ payload }: Action, { select, call, put }: EffectsCommandMap) {
      yield put({
        type: 'addRevokeLoading',
        payload: {
          revokeLoading: true
        }
      });
      const result = yield call(doRevoke, payload);
      yield put({
        type: 'delRevokeLoading',
        payload: {
          revokeLoading: false
        }
      });
      return result;
    }
  },
  reducers: {
    loadDataSuccess(state: DiscountDetailState, { payload }: Action) {
      return {
        ...state,
        ...payload
      };
    },
    addRevokeLoading(state: DiscountDetailState, { payload }: Action) {
      return {
        ...state,
        ...payload
      };
    },
    delRevokeLoading(state: DiscountDetailState, { payload }: Action) {
      return {
        ...state,
        ...payload
      };
    }
  }
};
export default DiscountDetailModel;

export interface DiscountDetailState extends Result<object> {}
