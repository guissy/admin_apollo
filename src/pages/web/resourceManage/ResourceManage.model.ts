import { message } from 'antd';
import {
  queryResourceManageData,
  deleteFile,
  rename,
  openFolder,
  addDir
} from './ResourceManage.service';
import { Action, EffectsCommandMap, Model, SubscriptionAPI } from 'dva';
import { messageError } from '../../../utils/showMessage';

export interface DirItem {
  dirtype: string;
  folder: string;
  name: string;
}

export interface FileItem {
  filesize: number;
  filetype: string;
  folder: string;
  name: string;
  url: string;
}

export interface ResourceManageState {
  countdir: number;
  countfile: number;
  dir: Array<DirItem>;
  file: Array<FileItem>;
  isLoading: boolean;
}

const resourceManageModel: Model = {
  namespace: 'resourceManage',
  state: {
    countdir: 0,
    countfile: 0,
    dir: [],
    file: [],
    isLoading: false
  },
  effects: {
    *loadData({ payload }: Action, { select, call, put }: EffectsCommandMap) {
      const result = yield call(queryResourceManageData, payload);
      if (result.state === '0') {
        yield put({
          type: 'loadDataSuccess',
          payload: {
            ...result.data,
            isLoading: true
          }
        });
      } else {
        messageError(result.message);
      }
    },
    *openFolder({ payload }: Action, { select, call, put }: EffectsCommandMap) {
      const result = yield call(openFolder, payload.folder);
      if (result.state === '0') {
        yield put({
          type: 'loadDataSuccess',
          payload: {
            ...result.data,
            isLoading: true
          }
        });
      } else {
        messageError(result.message);
      }
    },
    *delete({ payload }: Action, { select, call, put }: EffectsCommandMap) {
      const result = yield call(deleteFile, payload.url);
      return result;
    },
    *rename({ payload }: Action, { select, call, put }: EffectsCommandMap) {
      const result = yield call(rename, payload);
      return result;
    },
    *addDir({ payload }: Action, { select, call, put }: EffectsCommandMap) {
      const result = yield call(addDir, payload);
      return result;
    }
  },
  reducers: {
    loadDataSuccess(state: ResourceManageState, { payload }: Action) {
      return {
        ...state,
        ...payload
      };
    }
  }
};

export default resourceManageModel;
