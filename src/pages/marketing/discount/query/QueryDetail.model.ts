import { queryTableData } from './QueryDetail.service';
import { Action, EffectsCommandMap, Model } from 'dva';
import { Result } from '../../../../utils/result';

export interface QueryDetailState {
  data: Array<Record>;
}
export interface Record {
  agent_id: string;
  agent_name: string;
  coupon: string;
  rebet_id: string;
  user_id: string;
  user_name: string;
  valid_bet: string;
  games: Array<Game>;
  valid_coupon: string;
  id: number;
}

export interface Game {
  coupon: number;
  game_id: string | number;
  game_name: string;
  game_type: string;
  valid_bet: number;
}
const QueryDetailModel: Model = {
  namespace: 'querydetail',
  state: {
    data: []
  },
  effects: {
    *loadData({ payload }: Action, { select, call, put }: EffectsCommandMap) {
      const result = yield call(queryTableData, payload);
      let id = 1;
      if (result.data) {
        result.data.forEach((element: Record) => {
          element.id = id++;
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
    }
  },
  reducers: {
    loadDataSuccess(state: QueryDetailState, { payload }: Action) {
      return {
        ...state,
        ...payload
      };
    }
  }
};
export default QueryDetailModel;

export interface QueryDetailState extends Result<object> {}
