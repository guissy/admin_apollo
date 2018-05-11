import { Action, Model } from 'dva';
import { Result } from '../../../utils/result';

export interface ApplyItem {
  active_id: string;
  active_name: string;
  active_title: string;
  agent_id: string;
  apply_time: string;
  content: string;
  coupon_money: string;
  deposit_money: string;
  email: string;
  id: string;
  ip: string;
  issue_mode: string;
  level: string;
  memo: string;
  mobile: string;
  process_time: string;
  state: string;
  status: string;
  type_id: string;
  type_name: string;
  user_id: string;
  user_name: string;
  withdraw_require: string;
}

export interface ApplyState {
  data: Array<ApplyItem>;
  isDetailLoading: boolean;
  // detailData: ApplyItem;
}

const ApplyModel: Model = {
  namespace: 'apply',
  state: {},
  reducers: {
    update(state: ApplyState, { payload }: Action) {
      return {
        ...state,
        ...payload
      };
    }
  }
};

export default ApplyModel;
export interface ApplyState extends Result<object> {}
