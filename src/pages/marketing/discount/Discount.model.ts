import { queryTableData } from './Discount.service';
import { Action, EffectsCommandMap, Model } from 'dva';
import { Result } from '../../../utils/result';

export interface DiscountState {
  data: Array<Record>;
}

export interface Record {
  created: string;
  created_uname: string;
  end_time: string;
  games: string;
  id: string;
  member_level: string;
  name: string;
  start_time: string;
  total_coupon: string;
  total_people: string;
  total_valid_bet: string;
  withdraw_per: string;
  effect_time: string;
  people_coupon: string;
}

const DiscountModel: Model = {
  namespace: 'discount',
  state: {
    tableData: []
  },
  effects: {
    *loadData({ payload }: Action, { select, call, put }: EffectsCommandMap) {
      const result = yield call(queryTableData, payload);
      if (result) {
        /** 把部分数据合并 */
        result.data.forEach((element: Record) => {
          element.effect_time = element.start_time + ' ' + element.end_time;
          element.people_coupon = element.total_people + '/' + Number(element.total_coupon) / 100;
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
    loadDataSuccess(state: DiscountState, { payload }: Action) {
      return {
        ...state,
        ...payload
      };
    }
  }
};
export default DiscountModel;

export interface DiscountState extends Result<object> {}
