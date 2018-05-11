import { Action, EffectsCommandMap, Model } from 'dva';
import {
  queryMemberHierarchy,
  queryAllMemberHierarchy,
  addMemberHierarchy,
  editMemberHierarchy,
  deleteMemberHierarchy,
  restoreMemberHierarchy,
  layerdMemberHierarchy,
  queryMemberHierarchySet,
  setMemberHierarchy
} from './Hierarchy.service';
import { Result, Attributes } from '../../../../utils/result';

export interface HierarchyState {
  data: Array<object>;
  attributes: Attributes;
  levelList: Array<object>;
  setData: SetDataModel;
}

interface SetDataModel {
  day_out_times: string;
  day_out_times_nofee: string;
  day_withdraw_max: string;
  each_max_out: string;
  each_min_out: string;
  id: string;
  inserted_at: string;
  level_id: string;
  max_expenese: string;
  nocheck: string;
  offline_glide_multi: string;
  offline_max_in: string;
  offline_min_in: string;
  online_glide_multi: string;
  onlines: OnlinesModel;
  updated_at: string;
  withdraw_expenese: string;
  withdraw_fee: string;
}

interface OnlinesModel {
  wechat: MinMaxModel;
  alipay: MinMaxModel;
  qqpay: MinMaxModel;
  cyberbank: MinMaxModel;
  tenpay: MinMaxModel;
  jdpay: MinMaxModel;
  unionpay: MinMaxModel;
  baidupay: MinMaxModel;
  kapay: MinMaxModel;
  quickpay: MinMaxModel;
}
interface MinMaxModel {
  min: string;
  max: string;
}

const HierarchyModel: Model = {
  namespace: 'hierarchy',
  state: {
    data: [],
    attributes: {},
    levelList: [],
    setData: {
      id: '',
      evel_id: '',
      offline_min_in: '',
      offline_max_in: '',
      online_glide_multi: '',
      offline_glide_multi: '',
      wechat_in_fee: '',
      alipay_in_fee: '',
      each_min_out: '',
      each_max_out: '',
      day_out_times: '',
      day_out_times_nofee: '',
      withdraw_expenese: '',
      max_expenese: '',
      withdraw_fee: '',
      nocheck: '',
      onlines: {
        wechat: {
          min: '',
          max: ''
        },
        alipay: {
          min: '',
          max: ''
        },
        qqpay: {
          min: '',
          max: ''
        },
        cyberbank: {
          min: '',
          max: ''
        },
        tenpay: {
          min: '',
          max: ''
        },
        jdpay: {
          min: '',
          max: ''
        },
        unionpay: {
          min: '',
          max: ''
        },
        baidupay: {
          min: '',
          max: ''
        },
        kapay: {
          min: '',
          max: ''
        },
        quickpay: {
          min: '',
          max: ''
        }
      }
    }
  },
  effects: {
    *loadData({ payload }: Action, { select, call, put }: EffectsCommandMap) {
      const result: Result<object> = yield call(queryMemberHierarchy, payload);
      if (result.data && result.state === 0) {
        yield put({
          type: 'loadDataSuccess',
          payload: {
            data: result.data,
            attributes: result.attributes
          }
        });
      }
    },
    *queryAllMemberHierarchy({ payload }: Action, { select, call, put }: EffectsCommandMap) {
      const result: Result<object> = yield call(queryAllMemberHierarchy, payload);
      if (result.data && result.state === 0) {
        yield put({
          type: 'loadDataSuccess',
          payload: {
            levelList: result.data
          }
        });
      }
    },
    *addMemberHierarchy({ payload }: Action, { select, call, put }: EffectsCommandMap) {
      const data = yield call(addMemberHierarchy, payload);
      return data;
    },
    *editMemberHierarchy({ payload }: Action, { select, call, put }: EffectsCommandMap) {
      const data = yield call(editMemberHierarchy, payload);
      return data;
    },
    *deleteMemberHierarchy({ payload }: Action, { select, call, put }: EffectsCommandMap) {
      const data = yield call(deleteMemberHierarchy, payload);
      return data;
    },
    *restoreMemberHierarchy({ payload }: Action, { select, call, put }: EffectsCommandMap) {
      const data = yield call(restoreMemberHierarchy, payload);
      return data;
    },
    *layerdMemberHierarchy({ payload }: Action, { select, call, put }: EffectsCommandMap) {
      const data = yield call(layerdMemberHierarchy, payload);
      return data;
    },
    *queryMemberHierarchySet({ payload }: Action, { select, call, put }: EffectsCommandMap) {
      const result: Result<object> = yield call(queryMemberHierarchySet, payload);
      console.log(result);
      if (result.data && result.state === 0) {
        yield put({
          type: 'loadDataSuccess',
          payload: {
            setData: result.data[0]
          }
        });
      }
    },
    *setMemberHierarchy({ payload }: Action, { select, call, put }: EffectsCommandMap) {
      const data = yield call(setMemberHierarchy, payload);
      return data;
    }
  },
  reducers: {
    // 更新state
    loadDataSuccess(state: HierarchyState, { payload }: Action) {
      return {
        ...state,
        ...payload
      };
    }
  }
};
export default HierarchyModel;
