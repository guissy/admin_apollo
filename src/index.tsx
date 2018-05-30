import * as React from 'react';
import dva, { Action, SubscriptionAPI } from 'dva';
import { ConnectedRouter } from 'react-router-redux';
import { Switch, Route } from 'react-router';
import createBrowserHistory from 'history/createBrowserHistory';
import registerServiceWorker from './registerServiceWorker';
import { RestLink } from 'apollo-link-rest';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from 'react-apollo';
import { setContext } from 'apollo-link-context';

import './assets/fonts/iconfont';
import './assets/styles/app.scss';

import Home from './pages/home/Home';
import Login from './pages/login/Login';
import LoginModel from './pages/login/Login.model';
import DashboardModel from './pages/dashboard/Dashboard.model';
// 设置
import SettingModel from './pages/home/header/setting/Setting.model';
// 头部
import HeaderModel from './pages/home/header/Header.model';
import throttleEffect from './utils/throttleEffect';
import { effectLoadingLoadError, loadReducer, effectErrorMessage } from './utils/model';
import { moneyForResult, yuan } from './utils/money';
import environment from './utils/environment';
import { addTypePatcher } from './utils/graphTypename';
import ActivityApplyPage from './pages/marketing/activityApply/ActivityApply.page';
import { DiscountManage } from './pages/marketing/discountManage/DiscountManage.model';
import { SubAgentRebateDetail } from './pages/brokerage/subAgentRebate/SubAgentRebate.model';
import { AnnounceManageType } from './pages/site/announceManage/AnnounceManage.model';
import { ResourceFile } from './pages/site/resourceManage/ResourceManage.model';
import { constant } from 'lodash/fp';
import update from 'immutability-helper';

const app = dva({
  history: createBrowserHistory(),
  onEffect: effectLoadingLoadError,
  onReducer: loadReducer,
  onError: effectErrorMessage
});

app.model({
  namespace: 'loading',
  state: false,
  reducers: { update: (state: boolean, { payload }: Action) => payload }
});
app.model(throttleEffect(LoginModel));
app.model(throttleEffect(DashboardModel));
app.model(throttleEffect(SettingModel));
app.model(throttleEffect(HeaderModel));

const authLink = setContext((_, { headers }) => {
  const token = sessionStorage.getItem(environment.tokenName);
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  };
});
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(
    new RestLink({
      uri: environment.apiHost,
      credentials: 'omit',
      typePatcher: {
        ResourceFileResult(result: ResourceFile) {
          return update(result, {
            data: {
              __typename: constant('ResourceFile'),
              file: {
                $for: {
                  __typename: constant('ResourceDirItem')
                }
              },
              dir: {
                $for: {
                  __typename: constant('ResourceFileItem')
                }
              }
            }
          });
        },
        // ...addTypePatcher('ResourceFileResult', 'ResourceFile'),
        ...addTypePatcher('DomainSettingResult', 'DomainSetting', undefined, true),
        ...addTypePatcher('EmailManageResult', 'EmailManage'),
        ...addTypePatcher('SendTypeResult', 'SendType'),
        ...addTypePatcher('GameAccountResult', 'GameAccount'),
        ...addTypePatcher('MemberLogResult', 'MemberLog'),
        ...addTypePatcher('CurrencySettingResult', 'CurrencySetting'),
        ...addTypePatcher('CmsLogResult', 'CmsLog'),
        ...addTypePatcher('OpTypeResult', 'OpType'),
        ...addTypePatcher('CmsLogResultResult', 'CmsLogResult'),
        ...addTypePatcher('ProxyPromotionResult', 'ProxyPromotion'),
        ...addTypePatcher('PromotionResourceResult', 'PromotionResource'),
        ...addTypePatcher('ApproveStatusResult', 'ApproveStatus'),
        ...addTypePatcher('ApplyToResult', 'ApplyTo'),
        ...addTypePatcher('FloatAdResult', 'FloatAd'),
        ...addTypePatcher('FloatAdPositionResult', 'FloatAdPosition'),
        ...addTypePatcher('FloatAdPfResult', 'FloatAdPf'),
        ...addTypePatcher('FloatAdApproveResult', 'FloatAdApprove'),
        ...addTypePatcher('DepositNoteResult', 'DepositNote'),
        ...addTypePatcher('ApproveStatusResult', 'ApproveStatus'),
        ...addTypePatcher('ApplyToResult', 'ApplyTo'),
        ...addTypePatcher('AnnounceManageResult', 'AnnounceManage'),
        ...addTypePatcher('AnnounceManagePfResult', 'AnnounceManagePf'),
        ...addTypePatcher('AnnounceManageApproveResult', 'AnnounceManageApprove'),
        ...addTypePatcher('SendTypeResult', 'SendType'),
        ...addTypePatcher('AnnounceManageTypeResult', 'AnnounceManageType'),
        ...addTypePatcher('PopupTypeResult', 'PopupType'),
        ...addTypePatcher('AdListResult', 'AdList'),
        ...addTypePatcher('AdListPfResult', 'AdListPf'),
        ...addTypePatcher('AdListApproveResult', 'AdListApprove'),
        ...addTypePatcher('AdHomeResult', 'AdHome'),
        ...addTypePatcher('MemberSettingResult', 'MemberSetting', undefined, true),
        ...addTypePatcher('BankNameResult', 'BankName'),
        ...addTypePatcher('MemberSettingStateResult', 'MemberSettingState'),
        ...addTypePatcher('BankCardResult', 'BankCard', undefined, true),
        ...addTypePatcher('BankNameResult', 'BankName'),
        ...addTypePatcher('BankCardStateResult', 'BankCardState'),
        ...addTypePatcher('MemberInfoResult', 'MemberInfo', undefined, true),
        ...addTypePatcher('QuestionIdResult', 'QuestionId'),
        ...addTypePatcher('AccountBalanceResult', 'AccountBalance', undefined, true),
        ...addTypePatcher('MemberAuditResult', 'MemberAudit'),
        ...addTypePatcher('MemberAuditChannelResult', 'MemberAuditChannel'),
        ...addTypePatcher('MemberAuditTagsResult', 'MemberAuditTags'),
        ...addTypePatcher('MemberAuditOnlineResult', 'MemberAuditOnline'),
        ...addTypePatcher('MemberAuditStateResult', 'MemberAuditState'),
        ...addTypePatcher('MemberManageResult', 'MemberManage'),
        ...addTypePatcher('MemberManageChannelResult', 'MemberManageChannel'),
        ...addTypePatcher('MemberManageTagsResult', 'MemberManageTags'),
        ...addTypePatcher('MemberManageOnlineResult', 'MemberManageOnline'),
        ...addTypePatcher('MemberManageStateResult', 'MemberManageState'),
        ...addTypePatcher('PromotionResult', 'Promotion', undefined, true),
        ...addTypePatcher('AgentInfoResult', 'AgentInfo', undefined, true),
        ...addTypePatcher('AgentAccountResult', 'AgentAccount'),
        ...addTypePatcher('AgentAccountTypeResult', 'AgentAccountType'),
        ...addTypePatcher('AgentAccountChannelResult', 'AgentAccountChannel'),
        ...addTypePatcher('AgentAccountOnlineResult', 'AgentAccountOnline'),
        ...addTypePatcher('AgentAccountStatusResult', 'AgentAccountStatus'),
        ...addTypePatcher('MemberQueryResult', 'MemberQuery'),
        ...addTypePatcher('MemberQueryLayeredResult', 'MemberQueryLayered'),
        ...addTypePatcher('MemberQueryLockResult', 'MemberQueryLock'),
        ...addTypePatcher('MemberHierarchyResult', 'MemberHierarchy'),
        ...addTypePatcher('HierarchyResult', 'Hierarchy'),
        ...addTypePatcher('AgentAuditResult', 'AgentAudit'),
        ...addTypePatcher('AgentAuditStatusResult', 'AgentAuditStatus'),
        ...addTypePatcher('IdleAccountResult', 'IdleAccount'),
        ...addTypePatcher('MemberLabelResult', 'MemberLabel'),
        ...addTypePatcher('ThirdGameResult', 'ThirdGame'),
        ...addTypePatcher('ThirdNameResult', 'ThirdName'),
        ...addTypePatcher('OtherMemberResult', 'OtherMember'),
        ...addTypePatcher('TransferRecordResult', 'TransferRecord'),
        ...addTypePatcher('DealTypeResult', 'DealType'),
        ...addTypePatcher('DealCategoryResult', 'DealCategory'),
        ...addTypePatcher('FundDetailResult', 'FundDetail'),
        ...addTypePatcher('SubAgentRebateDetailResult', 'SubAgentRebateDetail'),
        ...addTypePatcher('SubAgentRebateResult', 'SubAgentRebate'),
        ...addTypePatcher('LoginResult', 'LoginOneItem', undefined, true),
        ...addTypePatcher('ActivityResult', 'ActiveItem'),
        ...addTypePatcher('ActivityContentResult', 'ActivityContent'),
        ...addTypePatcher('ActivityTypeResult', 'ActivityType'),
        ...addTypePatcher('DiscountSettingResult', 'DiscountSetting'),
        ...addTypePatcher('ActivityEditResult', 'ActivityEdit'),
        ...addTypePatcher('DiscountManageResult', 'DiscountManage'),
        ...addTypePatcher('DiscountDetailResult', 'DiscountDetail'),
        ...addTypePatcher('UserLevelResult', 'UserLevel'),
        ...addTypePatcher('IpBlackListResult', 'IpBlackList'),
        ...addTypePatcher(
          'ActivityApplyResult',
          'ActivityApply',
          moneyForResult<ActivityApplyPage[]>({
            data: {
              $for: {
                coupon_money: yuan, // 分转元
                deposit_money: yuan,
                withdraw_require: yuan
              }
            }
          })
        )
      }
    })
  )
});

const router = ({ history }: SubscriptionAPI) => {
  return (
    <ApolloProvider client={client}>
      <ConnectedRouter history={history}>
        <Switch>
          <Route exect={true} path="/login" component={Login} />
          <Route path="/" component={Home} />
        </Switch>
      </ConnectedRouter>
    </ApolloProvider>
  );
};

app.router(router);
app.start(document.getElementById('root'));
registerServiceWorker();

// hot module replace
if (module.hot) {
  module.hot.accept('./pages/home/Home', () => {
    app.router(router);
    app.start(document.getElementById('root'));
  });
}
