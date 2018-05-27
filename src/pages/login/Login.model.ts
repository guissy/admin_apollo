import { Action, EffectsCommandMap, SubscriptionAPI } from 'dva';
import environment from '../../utils/environment';
import { routerRedux } from 'dva/router';
import * as H from 'history';
import { uniqBy, pick } from 'lodash/fp';
import { MenuItem } from '../home/sider/Menu.data';
import Immutable from 'immutable';
import { parse } from 'querystring';
import MenuData from '../home/sider/Menu.data';

export default {
  namespace: 'login',
  state: {
    hasLogin: false,
    loading: false,
    needLogin: false,
    list: {},
    route: [],
    visited: []
  },
  subscriptions: {
    setup({ dispatch, history }: SubscriptionAPI) {
      // 刷新页面：已登录
      let expiration = window.sessionStorage.getItem(environment.expiration) || '0';
      // 后台挂了不能登录时延长有效期，跳过登录
      const params = parse(window.location.search.slice(1));
      if (params.debug === '42') {
        expiration = String(new Date(2020, 1, 2).valueOf() / 1000);
      }
      if (parseInt(expiration, 10) * 1000 - new Date().valueOf() > 0) {
        // token 没过期
        const userInfo = JSON.parse(window.sessionStorage.getItem(environment.userInfo) || 'null');
        if (userInfo) {
          dispatch({
            type: 'update',
            payload: { ...userInfo, hasLogin: true }
          });
          dispatch({
            type: 'readShortcut',
            payload: true
          });
          // 登录页和登陆后刷新页面
          if (location.pathname === '/login' || location.pathname === '/') {
            dispatch(routerRedux.push(environment.userFirstPage));
          }
        }
      } else {
        if (location.pathname === '/') {
          dispatch(routerRedux.push('/'));
        }
      }
      history.listen((location: H.Location, action: H.Action) => {
        if (location.pathname !== '/login') {
          dispatch({ type: 'access', payload: location });
        }
      });
    }
  },
  effects: {
    *token({ payload }: Action, { put, select }: EffectsCommandMap) {
      const result = payload as LoginedResult;
      const user = result.data;
      user.refresh_token = result.data.refresh_token;
      window.sessionStorage.setItem(environment.tokenName, result.data.token);
      window.sessionStorage.setItem(environment.expiration, String(result.data.expire));
      window.sessionStorage.setItem(environment.userInfo, String(JSON.stringify(user)));

      yield put({
        type: 'update',
        payload: {
          ...user,
          loading: false,
          hasLogin: true,
          needLogin: false
        }
      });
      yield put({ type: 'readShortcut', payload: {} });
    },
    *readShortcut({ payload }: Action, { put, select }: EffectsCommandMap) {
      const routeShortcut = JSON.parse(
        window.localStorage.getItem(environment.shortcutMenu) || '[]'
      );
      // tslint:disable-next-line:no-any
      const store = yield select((({ login }: any) => ({ login })) as any);
      const routeLogin = store.login.route as MenuItem[];
      const route = Immutable.fromJS(routeLogin)
        .mergeDeep(Immutable.fromJS(routeShortcut))
        .toJS();
      yield put({ type: 'update', payload: { route } });
    },
    *writeShortcut({ payload }: Action, { put, select }: EffectsCommandMap) {
      window.localStorage.setItem(environment.shortcutMenu, String(JSON.stringify(payload.route)));
      yield put({ type: 'update', payload });
    },
    *access({ payload }: Action, { put, select }: EffectsCommandMap) {
      // tslint:disable-next-line:no-any
      const store = yield select((({ login }: any) => ({ login })) as any);
      const route = store.login.route as MenuItem[];
      let [isDelete, isUpdate, isInsert, isFetch] = [false, false, false, false];
      route.forEach(item => {
        const subOk = item.children.find(sub => sub.path === payload.pathname);
        if (subOk) {
          isDelete = subOk.action.includes('delete');
          isUpdate = subOk.action.includes('update');
          isInsert = subOk.action.includes('insert');
          isFetch = subOk.action.includes('fetch');
        }
      });
      yield put({
        type: 'update',
        payload: {
          isDelete,
          isFetch,
          isUpdate,
          isInsert
        }
      });
      window.localStorage.setItem(environment.lastUrl, payload.pathname);
      const visited = [...store.login.visited, pick(['pathname', 'search'])(location)];
      yield put({ type: 'update', payload: { visited } });
    }
  },
  reducers: {
    update(state: LoginState, action: Action) {
      return { ...state, ...action.payload };
    }
  }
};

export interface LoginState extends User {
  loading: boolean; // 提交中
  hasLogin: boolean; // 标识是否已登录
  action: Array<string>;
  route: object[]; // 路由
  isDelete: boolean;
  isUpdate: boolean;
  isInsert: boolean;
  isFetch: boolean;
  needLogin: boolean; // 是否需要重新登录
  visited: H.Location[];
}

// 返回结果
export interface LoginedResult {
  data: {
    list: User;
    expire: number; // 时间戳
    refresh_token: string;
    member_control: object;
    token: string;
    route: MenuItem[];
  };
}

// 账号操作权限
interface Premission {
  isDelete: boolean;
  isUpdate: boolean;
  isInsert: boolean;
  isFtech: boolean;
}

// 账号相关
interface User {
  list: {
    id: string;
    username: string;
    truename: string;
    nick: string;
    logintime: string;
    role: string;
    member_control: object;
    refresh_token: string;
    route: MenuItem[];
    email: string;
    mobile: string;
    telephone: string;
    part: string;
    job: string;
    comment: string;
  };
}

/**
 * 当权限 action 为空数组时，不在菜单中显示
 * login.route[].action => login.route[].visible
 */
export function transformLoginRoute(loginRoute: MenuItem[]) {
  // 旧版路由适配为新版路由
  const oldNewMap = {};
  const menuDataOk = (MenuData as MenuItem[]).map(menuOne => {
    if (!loginRoute) {
      return menuOne;
    }
    // 一级name: 根据name
    let parentIndex: number;
    const loginOne = loginRoute.find((loginItem, index) => {
      const hasFound = loginItem.name === menuOne.name;
      parentIndex = index;
      return hasFound;
    });
    const menuOneOk = { ...menuOne };
    if (loginOne) {
      menuOneOk.action = loginOne.action;
      menuOneOk.visible = Array.isArray(loginOne.action) && loginOne.action.length > 0;

      // 二级path: 根据path
      menuOneOk.visible = Array.isArray(loginOne.action) && loginOne.action.length > 0;
      menuOneOk.children = menuOne.children.map((menuTwo, index) => {
        const menuTwoOk = { ...menuTwo };
        const loginTwo = loginOne.children.find(
          loginItem => oldNewMap[loginItem.path] || loginItem.path === menuTwo.path
        );
        if (loginTwo) {
          menuTwoOk.action = loginTwo.action;
          menuTwoOk.visible = Array.isArray(loginTwo.action) && loginTwo.action.length > 0;
          // 适配旧版 path
          menuTwoOk.parentIndex = parentIndex;
          menuTwoOk.index = index;
        }
        return menuTwoOk;
      });
    }
    return menuOneOk;
  });

  return menuDataOk;
}

/** 两级的loginRoute => 一级的loginRoute */
export function getFlatRoute(login: LoginState = {} as LoginState): MenuItem[] {
  const loginRoute = login.route as MenuItem[];
  const loginRouteFlat = loginRoute.reduce((s, v) => s.concat(v.children), [] as MenuItem[]);
  return loginRouteFlat;
}
