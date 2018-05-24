import * as React from 'react';
import { Switch, Route } from 'react-router';
import NotFount from '../notFound/NotFound';

// 首页图表
import Dashboard from '../dashboard/Dashboard';

// 网站
//    轮播广告
import AdList from '../web/adList/AdList';
//    文案管理
import AdHome from '../web/adHome/AdHome';
//    代理文案
import ProxyCopy from '../web/proxyCopy/ProxyCopy';
//    存款文案
import DepositCopy from '../web/depositCopy/DepositCopy';
//    浮动图管理
import FloatAd from '../web/floatAd/FloatAd';
//    代理推广资源
import PromotionResource from '../web/promotionResource/PromotionResource';
//    注册设置
// import RegisterSet from ''
//    站点设置
// import WebSet from ''
//    消息
// import SysMessage from ''
//    公告管理
import Notice from '../web/announcementManage/AnnouncementManage';
//    消息管理
import NoticeManage from '../web/noticeManage/NoticeManage';
//    资源站管理
import ResourceManage from '../web/resourceManage/ResourceManage';

// 营销
//    优惠申请
import ActivityApplyPage from '../marketing/activityApply/ActivityApply.page';
//    优惠类型
//    自动优惠模板
// import ActiveSet from ''
//    返水活动
//    返水查询
// import DiscountCounting from ''
//    创建活动模板
// import AddActiveSet from ''
//    每日签到模板优惠设置
// import ActiveMode_1 from ''
//    邮箱验证模板优惠设置
// import ActiveMode_2 from ''
//    手机验证模板优惠设置
// import ActiveMode_3 from ''
//    每日抽奖模板优惠设置
// import ActiveMode_4 from ''
//    救援金模板优惠设置
// import ActiveMode_5 from ''
//    擂台赛模板优惠设置
// import ActiveMode_6 from ''
//    奖上奖模板优惠设置
// import ActiveMode_7 from ''
//    连续闯关模板优惠设置
// import ActiveMode_8 from ''
//    存款优惠模板优惠设置
// import ActiveMode_9 from ''
//    模板优惠设置(邮箱验证)
// import ActiveMode_email from ''
//    手动优惠
//    返水优惠查询
// import DiscountQuery from ''
//    返水优惠设定
// import DiscountSetting from ''

// 游戏

// 风控
//    IP黑名单
//    重复账号
// import DuplicateAccount from ''

// 用户
//    会员管理
import MemberManage from '../user/memberManage/MemberManage';
//    会员层级
import MemberHierarchy from '../user/memberHierarchy/MemberHierarchy';
//    会员标签
import MemberLabel from '../user/memberLabel/MemberLabel';
//    闲置帐号
import IdleAccount from '../user/idleAccount/IdleAccount';
//    登录查询
// import LoginAccount from ''
//    代理管理
import AgentAccount from '../user/agentAccount/AgentAccount';
//    有效用户
// import ValidUser from ''
//    第三方会员查询
import OtherMember from '../user/otherMember/OtherMember';
//    代理审核
import AgentAudit from '../user/agentAudit/AgentAudit';
//    管理员列表
// import ChildAccount from ''
//    管理员角色
// import ChildRoleAccount from ''
//    有效投注查询
// import EffectiveBettingQuery from ''

// 订单
//    红包小费
// import NotePremiumTips from ''

// 现金
//    银行管理
// import BankManagement from ''
//    第三方支付平台
// import OtherPayment from ''
//    收款帐户
// import ReceivableBank from ''
//    线上充值
// import OnLineReceipt from ''
//    公司入款
// import OfflineReceipt from ''
//    会员提现
// import MemberGetOut from ''
//    人工存提
// import Manual from ''
//    现金流水
import FundDetail from '../../pages/cash/fundDetail/FundDetail';
//    转帐记录
import TransferRecord from '../../pages/cash/transferRecord/TransferRecord';

// 佣金
//    退佣手续费
// import CommissionFeeset from ''
//    代理退佣比例
// import CommissionSet from ''
//    退佣设定
// import AgentSettlementSet from ''
//    退佣期数
// import RefundCommissionPeriod from ''
//    退佣查询
// import CommissionIncomeQuery from ''
//    下级佣金统计
//    代理统计
// import AgencyStatistics from ''
//    代理推广链接
//    代理提款
// import AgentDrawing from ''

// 报表
//    总报表
// import SumStatement from ''
//    游戏报表
// import GameStatement from ''
//    交收表
// import DeliveryStatement from ''
//    出入款汇总
// import FundDetailsSummary from ''
//    余额汇总
// import MemberBalance from ''
//    红包小费
// import PremiumTips from ''

// 系统
//    后台操作日志
import BackgroundLog from '../system/backgroundLog/BackgroundLog';
//    会员操作日志
import MemberLog from '../system/memberLog/MemberLog';
//    邮件管理
import EmailList from '../system/emailList/EmailList';
//    货币设定
import CurrencySetting from '../system/currencySetting/CurrencySetting';
//    邮件服务器
//    前台域名设置
import DomainSetting from '../system/domainSetting/DomainSetting';
//    游戏后台帐号
import GameAccount from '../system/gameAccount/GameAccount';
import ActivityContentPage from '../marketing/activityContent/ActivityContent.page';
import ActivityTypePage from '../marketing/activityType/ActivityType.page';
import DiscountSettingPage from '../marketing/discountSetting/DiscountSetting.page';
import DiscountManagePage from '../marketing/discountManage/DiscountManage.page';
import IpBlackListPage from '../risk/ipBlackList/IpBlackList.page';
import AgentLinkPage from '../brokerage/agentLink/AgentLink.page';
import SubAgentRebatePage from '../brokerage/subAgentRebate/SubAgentRebate.page';

export default () => {
  return (
    <Switch>
      <Route exact={true} path="/" component={Dashboard} />
      <Route path="/adList" component={AdList} />
      <Route path="/adHome" component={AdHome} />
      <Route path="/proxyCopy" component={ProxyCopy} />
      <Route path="/depositCopy" component={DepositCopy} />
      <Route path="/floatAd" component={FloatAd} />
      <Route path="/promotionResource" component={PromotionResource} />
      {/* <Route path="/registerSet" component={RegisterSet} /> */}
      {/* <Route path="/webSet" component={WebSet} /> */}
      {/* <Route path="/sysMessage" component={SysMessage} /> */}
      <Route path="/notice" component={Notice} />
      <Route path="/noticeManage" component={NoticeManage} />
      <Route path="/resourceManage" component={ResourceManage} />
      <Route path="/apply" component={ActivityApplyPage} />
      <Route path="/typeList" component={ActivityTypePage} />
      {/* <Route path="/activeSet" component={ActiveSet} /> */}
      <Route path="/discount" component={DiscountManagePage} />
      {/* <Route path="/discountCounting" component={DiscountCounting} /> */}
      {/* <Route path="/addActiveSet" component={AddActiveSet} /> */}
      {/* <Route path="/activeMode_1" component={ActiveMode_1} /> */}
      {/* <Route path="/activeMode_2" component={ActiveMode_2} /> */}
      {/* <Route path="/activeMode_3" component={ActiveMode_3} /> */}
      {/* <Route path="/activeMode_4" component={ActiveMode_4} /> */}
      {/* <Route path="/activeMode_5" component={ActiveMode_5} /> */}
      {/* <Route path="/activeMode_6" component={ActiveMode_6} /> */}
      {/* <Route path="/activeMode_7" component={ActiveMode_7} /> */}
      {/* <Route path="/activeMode_8" component={ActiveMode_8} /> */}
      {/* <Route path="/activeMode_9" component={ActiveMode_9} /> */}
      {/* <Route path="/activeMode_email" component={ActiveMode_email} /> */}
      <Route path="/activityContent" component={ActivityContentPage} />
      {/* <Route path="/discountQuery" component={DiscountQuery} /> */}
      <Route path="/discountSetting" component={DiscountSettingPage} />
      {/* <Route path="/lotterPeriodManagement" component={LotterPeriodManagement} /> */}
      <Route path="/ipBlacklist" component={IpBlackListPage} />
      {/* <Route path="/duplicateAccount" component={DuplicateAccount} /> */}
      <Route path="/memberManage" component={MemberManage} />
      <Route path="/memberHierarchy" component={MemberHierarchy} />
      <Route path="/memberLabel" component={MemberLabel} />
      <Route path="/idleAccount" component={IdleAccount} />
      {/* <Route path="/LoginAccount" component={LoginAccount} /> */}
      <Route path="/agentAccount" component={AgentAccount} />
      {/* <Route path="/validUser" component={ValidUser} /> */}
      <Route path="/otherMembers" component={OtherMember} />
      <Route path="/agentAudit" component={AgentAudit} />
      {/* <Route path="/childAccount" component={ChildAccount} /> */}
      {/* <Route path="/childRoleAccount" component={ChildRoleAccount} /> */}
      {/* <Route path="/effectiveBettingQuery" component={EffectiveBettingQuery} /> */}
      {/* <Route path="/chaseNumber" component={ChaseNumber} /> */}
      {/* <Route path="/noteManagement" component={NoteManagement} /> */}
      {/* <Route path="/liveNote" component={LiveNote} /> */}
      {/* <Route path="/markSixQuery" component={MarkSixQuery} /> */}
      {/* <Route path="/notePremiumTips" component={NotePremiumTips} /> */}
      {/* <Route path="/bankManagement" component={BankManagement} /> */}
      {/* <Route path="/otherPayment" component={OtherPayment} /> */}
      {/* <Route path="/receivableBank" component={ReceivableBank} /> */}
      {/* <Route path="/onLineReceipt" component={OnLineReceipt} /> */}
      {/* <Route path="/offlineReceipt" component={OfflineReceipt} /> */}
      {/* <Route path="/memberGetOut" component={MemberGetOut} /> */}
      {/* <Route path="/manual" component={Manual} /> */}
      <Route path="/FundDetails" component={FundDetail} />
      <Route path="/transferRecord" component={TransferRecord} />
      {/* <Route path="/commissionFeeset" component={CommissionFeeset} /> */}
      {/* <Route path="/CommissionSet" component={CommissionSet} /> */}
      {/* <Route path="/agentSettlementSet" component={AgentSettlementSet} /> */}
      {/* <Route path="/RefundCommissionPeriod" component={RefundCommissionPeriod} /> */}
      {/* <Route path="/CommissionIncomeQuery" component={CommissionIncomeQuery} /> */}
      <Route path="/subAgentRebate" component={SubAgentRebatePage} />
      {/* <Route path="/agencyStatistics" component={AgencyStatistics} /> */}
      <Route path="/agentLink" component={AgentLinkPage} />
      {/* <Route path="/agentDrawing" component={AgentDrawing} /> */}
      {/* <Route path="/sumStatement" component={SumStatement} /> */}
      {/* <Route path="/gameStatement" component={GameStatement} /> */}
      {/* <Route path="/deliveryStatement" component={DeliveryStatement} /> */}
      {/* <Route path="/fundDetailsSummary" component={FundDetailsSummary} /> */}
      {/* <Route path="/memberBalance" component={MemberBalance} /> */}
      {/* <Route path="/PremiumTips" component={PremiumTips} /> */}
      <Route path="/backgroundLog" component={BackgroundLog} />
      <Route path="/memberLog" component={MemberLog} />
      <Route path="/emailList" component={EmailList} />
      <Route path="/currencySetting" component={CurrencySetting} />
      <Route path="/domainSetting" component={DomainSetting} />
      <Route path="/gameAccount" component={GameAccount} />
      <Route component={NotFount} />
    </Switch>
  );
};
