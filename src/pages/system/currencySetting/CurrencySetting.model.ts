import { queryTableData } from './CurrencySetting.service';
import { Action, EffectsCommandMap, Model } from 'dva';

interface CurrencySettingsItem {
  changed: string;
  ctype: string;
  cytype: string;
  id: string;
  status: string;
}

export interface CurrencySettingState {
  tableData: Array<CurrencySettingsItem>;
  isLoading: boolean;
}

const currencySettingModel: Model = {
  namespace: 'currencySetting',
  state: {
    tableData: []
  },
  effects: {
    *loadData({ payload }: Action, { select, call, put }: EffectsCommandMap) {
      const data = yield call(queryTableData, payload);
      if (data.state === 0) {
        yield put({
          type: 'loadDataSuccess',
          payload: {
            tableData: data.data
          }
        });
      }
    }
  },
  reducers: {
    loadDataSuccess(state: CurrencySettingState, { payload }: Action) {
      return {
        ...state,
        ...payload
      };
    }
  }
};

export default currencySettingModel;
