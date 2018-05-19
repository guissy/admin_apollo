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
import AdListModel from './pages/web/adList/AdList.model';
//    文案管理
import AdHomeModel from './pages/web/adHome/AdHome.model';
//    代理文案
import ProxyCopyModel from './pages/web/proxyCopy/ProxyCopy.model';
//    存款文案
import DepositCopyModel from './pages/web/depositCopy/DepositCopy.model';
//    浮动图管理
import FloatAdModel from './pages/web/floatAd/FloatAd.model';
//    代理推广资源
import PromotionResourceModel from './pages/web/promotionResource/PromotionResource.model';
//    注册设置
//    站点设置
//    消息
//    公告管理
import AnnouncementManageModel from './pages/web/announcementManage/AnnouncementManage.model';
//    消息管理
import NoticeManageModel from './pages/web/noticeManage/NoticeManage.model';
//    资源站管理
import ResourceManageModel from './pages/web/resourceManage/ResourceManage.model';

// 营销
//    优惠申请
import ActivityApplyModel from './pages/marketing/activityApply/ActivityApply.model';
//    优惠类型
import TypeListModel from './pages/marketing/typeList/TypeList.model';
//    自动优惠模板
//    返水活动
import DiscountModel from './pages/marketing/discount/Discount.model';
import DiscountDetailModel from './pages/marketing/discount/detail/DiscountDetail.model';
import AddDiscountModel from './pages/marketing/discount/add/AddDiscount.model';
import QueryDetailModel from './pages/marketing/discount/query/QueryDetail.model';
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
import IpBlackListModel from './pages/risk/ipBlackList/IpBlackList.model';
//    重复账号

// 用户
//    会员管理
import MemberManageModel from './pages/user/memberManage/MemberManage.model';
import MemberInformationModel from './pages/user/memberManage/information/Information.model';
import MemberAccountBalanceModel from './pages/user/memberManage/balance/Balance.model';
import MemberBankDetail from './pages/user/memberManage/bankDetail/BankDetail.model';
import MemberSettingModel from './pages/user/memberManage/memberSetting/MemberSetting.model';
import MemberWidthRawModel from './pages/user/memberManage/audit/Audit.model';
//    会员层级
import MemberHierarchyModel from './pages/user/memberHierarchy/hierarchy/Hierarchy.model';
import MemberQueryModel from './pages/user/memberHierarchy/memberQuery/MemberQuery.model';
//    会员标签
import MemberLabelModel from './pages/user/memberLabel/MemberLabel.model';
//    闲置帐号
import IdleAccountModel from './pages/user/idleAccount/IdleAccount.model';
//    登录查询
//    代理管理
import AgentAccountModel from './pages/user/agentAccount/AgentAccount.model';
import AgentInformationModel from './pages/user/agentAccount/agentInformation/AgentInformation.model';
import promotionInfoModel from './pages/user/agentAccount/promotionInfo/PromotionInfo.model';
//    有效用户
//    第三方会员查询
import OtherMemberModel from './pages/user/otherMember/OtherMember.model';
//    代理审核
import AgentAuditModel from './pages/user/agentAudit/AgentAudit.model';
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
import FundDetailModel from './pages/cash/fundDetail/FundDetail.model';
//    转帐记录
import TransferRecordModel from './pages/cash/transferRecord/TransferRecord.model';

// 佣金
//    退佣手续费
//    代理退佣比例
//    退佣设定
//    退佣期数
//    退佣查询
//    下级佣金统计
import SubAgentRebateModel from './pages/brokerage/subAgentRebate/SubAgentRebate.model';
//    代理统计
//    代理推广链接
import AgentLinkModel from './pages/brokerage/agentLink/AgentLink.model';
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
import BackgroundModel from './pages/system/backgroundLog/BackgroundLog.model';
//    会员操作日志
import MemberLogModel from './pages/system/memberLog/MemberLog.model';
//    邮件管理
import EmailListModel from './pages/system/emailList/EmailList.model';
//    货币设定
import CurrencySettingsModel from './pages/system/currencySetting/CurrencySetting.model';
//    邮件服务器
import EmailSettingModel from './pages/system/emailSetting/EmailSetting.model';
//    前台域名设置
import DomainSettingModel from './pages/system/domainSetting/DomainSetting.model';
//    游戏后台帐号
import GameAccountModel from './pages/system/gameAccount/GameAccount.model';

// 设置
import SettingModel from './pages/home/header/setting/Setting.model';
// 头部
import HeaderModel from './pages/home/header/Header.model';
import throttleEffect from './utils/throttleEffect';
import { effectLoadingLoadError, loadReducer, effectErrorMessage } from './utils/model';
import { moneyForResult, yuan } from './utils/money';
import environment from './utils/environment';
import { addTypePatcher } from './utils/graphTypename';
import ActivityApply from './pages/marketing/activityApply/ActivityApply';

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
app.model(throttleEffect(BackgroundModel));
app.model(throttleEffect(MemberLogModel));
app.model(throttleEffect(AdListModel));
app.model(throttleEffect(AdHomeModel));
app.model(throttleEffect(IpBlackListModel));
app.model(throttleEffect(MemberManageModel));
app.model(throttleEffect(MemberInformationModel));
app.model(throttleEffect(MemberAccountBalanceModel));
app.model(throttleEffect(MemberBankDetail));
app.model(throttleEffect(MemberSettingModel));
app.model(throttleEffect(MemberWidthRawModel));
app.model(throttleEffect(MemberLabelModel));
app.model(throttleEffect(MemberQueryModel));
app.model(throttleEffect(MemberHierarchyModel));
app.model(throttleEffect(IdleAccountModel));
app.model(throttleEffect(OtherMemberModel));
app.model(throttleEffect(AgentAuditModel));
app.model(throttleEffect(ProxyCopyModel));
app.model(throttleEffect(ActivityApplyModel));
app.model(throttleEffect(TypeListModel));
app.model(throttleEffect(SettingModel));
app.model(throttleEffect(HeaderModel));
app.model(throttleEffect(DepositCopyModel));
app.model(throttleEffect(EmailListModel));
app.model(throttleEffect(CurrencySettingsModel));
app.model(throttleEffect(EmailSettingModel));
app.model(throttleEffect(DomainSettingModel));
app.model(throttleEffect(GameAccountModel));
app.model(throttleEffect(FloatAdModel));
app.model(throttleEffect(ResourceManageModel));
app.model(throttleEffect(DiscountModel));
app.model(throttleEffect(DiscountDetailModel));
app.model(throttleEffect(SubAgentRebateModel));
app.model(throttleEffect(AgentLinkModel));
app.model(throttleEffect(PromotionResourceModel));
app.model(throttleEffect(NoticeManageModel));
app.model(throttleEffect(AnnouncementManageModel));
app.model(throttleEffect(AgentAccountModel));
app.model(throttleEffect(AgentInformationModel));
app.model(throttleEffect(promotionInfoModel));
app.model(throttleEffect(AddDiscountModel));
app.model(throttleEffect(FundDetailModel));
app.model(throttleEffect(TransferRecordModel));
app.model(throttleEffect(QueryDetailModel));

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
        ...addTypePatcher('LoginResult', 'LoginOneItem', undefined, true),
        ...addTypePatcher('ActivityResult', 'ActiveItem'),
        ...addTypePatcher('ActivityContentResult', 'ActivityContentItem'),
        ...addTypePatcher('ActivityTypeResult', 'ActivityType'),
        ...addTypePatcher('ActivityEditResult', 'ActivityEdit'),
        ...addTypePatcher(
          'ActivityApply',
          'ActivityApplyItem',
          moneyForResult<ActivityApply[]>({
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
