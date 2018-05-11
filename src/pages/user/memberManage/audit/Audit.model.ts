import { Action, EffectsCommandMap, Model } from 'dva';
import { queryUserAccountAudit } from './Audit.service';
import { Result, Attributes } from '../../../../utils/result';

interface AuditData {
  level_config: LevelConfig;
  list: Array<object>;
  total_admin_fee: number;
  total_coupon: number;
  total_fee: number;
}

interface LevelConfig {
  withdraw_expenese: number;
  max_expenese: number;
  nocheck: number;
}

export interface MemberAuditState {
  data: AuditData;
  attributes: Attributes;
}

const MemberAuditModel: Model = {
  namespace: 'memberAudit',
  state: {
    data: {
      level_config: {
        withdraw_expenese: 0,
        max_expenese: 0,
        nocheck: 0
      },
      list: [],
      total_admin_fee: 0,
      total_coupon: 0,
      total_fee: 0
    }
  },
  effects: {
    *loadData({ payload }: Action, { select, call, put }: EffectsCommandMap) {
      const result: Result<object> = yield call(queryUserAccountAudit, payload);
      if (result.data && result.state === 0) {
        yield put({
          type: 'loadDataSuccess',
          payload: {
            data: result.data,
            attributes: result.attributes
          }
        });
      }
    }
  },
  reducers: {
    // 更新state
    loadDataSuccess(state: MemberAuditState, { payload }: Action) {
      return {
        ...state,
        ...payload
      };
    }
  }
};
export default MemberAuditModel;
