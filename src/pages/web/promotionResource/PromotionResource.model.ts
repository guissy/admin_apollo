import { Model, EffectsCommandMap, Action } from 'dva';
import {
  queryResources,
  changeStatus,
  doDelete,
  doEdit,
  doApply,
  addResources,
  getAllGames
} from './PromotionResource.service';
import { Attributes } from '../../../utils/result';

export interface ResourcesState {
  attributes: Attributes;
  data: Array<ResourcesData>;
  page: number;
  page_size: number;
  games: Array<{ category: string; id: string; name: string }>;
}

export interface ResourcesData {
  created?: string;
  file_type?: string;
  game_type: string;
  id: string;
  language_id: string;
  language_name: string;
  length: string;
  name: string;
  picture: string;
  status: string;
  type: string;
  updated: string;
  script: string;
  wh: string;
  width: string;
}
const promotionResource: Model = {
  namespace: 'promotionResource',
  state: {
    data: [],
    games: [],
    attributes: {},
    page: 1,
    page_size: 20
  },
  effects: {
    *query({ payload }: Action, { put, call, load }: EffectsCommandMap) {
      return yield load(queryResources, payload);
    },
    *doEnable({ payload }: Action, { put, call }: EffectsCommandMap) {
      const data = yield call(changeStatus, payload);
      return data;
    },
    *doAdd({ payload }: Action, { put, call, select }: EffectsCommandMap) {
      const data = yield call(addResources, payload);
      return data;
    },
    *doEdit({ payload }: Action, { put, call, select }: EffectsCommandMap) {
      const data = yield call(doEdit, payload);
      return data;
    },
    *doDelete({ payload }: Action, { put, call }: EffectsCommandMap) {
      const data = yield call(doDelete, payload);
      return data;
    },
    *doApply({ payload }: Action, { put, call }: EffectsCommandMap) {
      const data = yield call(doApply, payload);
      return data;
    },
    *doGames({ payload }: Action, { put, call }: EffectsCommandMap) {
      const data = yield call(getAllGames, payload);
      if (data.data) {
        yield put({
          type: 'getGamesSuccess',
          payload: {
            games: data.data
          }
        });
      }
    }
  },
  reducers: {
    querySuccess(state: ResourcesState, { payload }: Action) {
      return { ...state, ...payload };
    },
    getGamesSuccess(state: ResourcesState, { payload }: Action) {
      return { ...state, ...payload };
    },
    addLoading(state: ResourcesState, { payload }: Action) {
      return { ...state, ...payload };
    }
  }
};

export default promotionResource;
