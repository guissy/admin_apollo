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

// 网站
//    轮播广告
//    文案管理
//    代理文案
//    存款文案
//    浮动图管理
//    代理推广资源
//    注册设置
//    站点设置
//    消息
//    公告管理
//    消息管理
//    资源站管理

// 营销
//    优惠申请
//    优惠类型
//    自动优惠模板
//    返水活动
//    返水查询
//    创建活动模板
//    每日签到模板优惠设置
//    邮箱验证模板优惠设置
//    手机验证模板优惠设置
//    每日抽奖模板优惠设置
//    救援金模板优惠设置
//    擂台赛模板优惠设置
//    奖上奖模板优惠设置
// import ActiveMode_7 from ''
//    连续闯关模板优惠设置
//    存款优惠模板优惠设置
//    模板优惠设置(邮箱验证)
//    手动优惠
//    返水优惠查询
//    返水优惠设定

// 游戏

// 风控
//    IP黑名单
//    重复账号

// 用户
//    会员管理
//    会员层级
//    会员标签
//    闲置帐号
//    登录查询
//    代理管理
//    有效用户
//    第三方会员查询
//    代理审核
//    管理员列表
//    管理员角色
//    有效投注查询

// 订单
//    订单查询
//    红包小费

// 现金
//    银行管理
//    第三方支付平台
//    收款帐户
//    线上充值
//    公司入款
//    会员提现
//    人工存提
//    现金流水
//    转帐记录

// 佣金
//    退佣手续费
//    代理退佣比例
//    退佣设定
//    退佣期数
//    退佣查询
//    下级佣金统计
//    代理统计
//    代理推广链接
//    代理提款

// 报表
//    总报表
//    游戏报表
//    交收表
//    出入款汇总
//    余额汇总
//    红包小费

// 系统
//    后台操作日志
//    会员操作日志
//    邮件管理
//    货币设定
//    邮件服务器
//    前台域名设置
//    游戏后台帐号

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
