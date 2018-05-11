import { queryTableData } from './DiscountSetting.service';
import { Action, EffectsCommandMap, Model } from 'dva';
import { Result } from '../../../utils/result';

export interface DiscountSettingState {
  data: object;
}

export interface Record {
  created: string;
  default: string;
  id: string;
  member_level: string;
  memo: string;
  rebet_per: Game[];
  status: string;
  upper_limit: string;
  valid_bet: string;
}
export interface Game {
  game_id: number;
  game_name: string;
  game_type: string;
  val: string;
}

const DiscountSettingModel: Model = {
  namespace: 'discountSetting',
  state: {
    data: []
  },
  effects: {
    *loadData({ payload }: Action, { load }: EffectsCommandMap) {
      return yield load(queryTableData, payload);
    }
  },
  reducers: {
    loadDataSuccess(state: DiscountSettingState, { payload }: Action) {
      return {
        ...state,
        ...payload
      };
    }
  }
};
export default DiscountSettingModel;

export interface DiscountSettingState extends Result<object> {}
