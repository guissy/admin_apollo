import { getLevel, getGames } from './AddDiscount.service';
import { Action, EffectsCommandMap, Model } from 'dva';
import { Result } from '../../../../utils/result';

export interface AddDiscountState {}

export interface Level {
  admin_id: string;
  comment: string;
  created: string;
  deposit_etime: string;
  deposit_max: string;
  deposit_min: string;
  deposit_money: string;
  deposit_stime: string;
  deposit_times: string;
  id: string;
  level_id: string;
  max_deposit_money: string;
  memo: string;
  name: string;
  num: string;
  register_etime: string;
  register_stime: string;
  tid: string;
  updated: string;
  withdraw_count: string;
  withdraw_times: string;
}
export interface Game {
  id: string;
  name: string;
  game_id: string;
  game_name: string;
  game_short: string;
  game_type: string;
}

const AddDiscountModel: Model = {
  namespace: 'addDiscount',
  state: {
    data: []
  },
  effects: {
    *getLevel({ payload }: Action, { select, call, put }: EffectsCommandMap) {
      return yield call(getLevel, payload);
    },
    *getGames({ payload }: Action, { select, call, put }: EffectsCommandMap) {
      return yield call(getGames, payload);
    }
  }
};
export default AddDiscountModel;

export interface AddDiscountState extends Result<object> {}
