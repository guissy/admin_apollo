import * as React from 'react';
import { Route, Switch } from 'react-router';
import NotFount from '../notFound/NotFound';
import Dashboard from '../dashboard/Dashboard';
import ActivityApplyPage from '../marketing/activityApply/ActivityApply.page';
import ActivityContentPage from '../marketing/activityContent/ActivityContent.page';
import ActivityTypePage from '../marketing/activityType/ActivityType.page';
import DiscountSettingPage from '../marketing/discountSetting/DiscountSetting.page';
import DiscountManagePage from '../marketing/discountManage/DiscountManage.page';
import IpBlackListPage from '../risk/ipBlackList/IpBlackList.page';
import AgentLinkPage from '../brokerage/agentLink/AgentLink.page';
import SubAgentRebatePage from '../brokerage/subAgentRebate/SubAgentRebate.page';
import FundDetailPage from '../cash/fundDetail/FundDetail.page';
import TransferRecordPage from '../cash/transferRecord/TransferRecord.page';
import OtherMemberPage from '../user/otherMember/OtherMember.page';
import MemberLabelPage from '../user/memberLabel/MemberLabel.page';
import IdleAccountPage from '../user/idleAccount/IdleAccount.page';
import AgentAuditPage from '../user/agentAudit/AgentAudit.page';
import Hierarchy from '../user/hierarchy/Hierarchy';
import AgentAccountPage from '../user/agentAccount/AgentAccount.page';
import MemberManagePage from '../user/memberManage/MemberManage.page';
import AdHomePage from '../site/adHome/AdHome.page';
import AdListPage from '../site/adList/AdList.page';
import AnnounceManagePage from '../site/announceManage/AnnounceManage.page';
import DepositNotePage from '../site/depositNote/DepositNote.page';
import FloatAdPage from '../site/floatAd/FloatAd.page';
import ProxyPromotionPage from '../site/proxyPromotion/ProxyPromotion.page';
import ResourceManagePage from '../site/resourceManage/ResourceManage.page';
import CmsLogPage from '../system/cmsLog/CmsLog.page';
import MemberLogPage from '../system/memberLog/MemberLog.page';
import CurrencySettingPage from '../system/currencySetting/CurrencySetting.page';
import GameAccountPage from '../system/gameAccount/GameAccount.page';
import EmailManagePage from '../system/emailManage/EmailManage.page';
import DomainSettingPage from '../system/domainSetting/DomainSetting.page';

export default () => {
  return (
    <Switch>
      <Route exact={true} path="/" component={Dashboard} />
      <Route path="/adList" component={AdListPage} />
      <Route path="/adHome" component={AdHomePage} />
      <Route path="/depositCopy" component={DepositNotePage} />
      <Route path="/floatAd" component={FloatAdPage} />
      <Route path="/promotionResource" component={ProxyPromotionPage} />
      <Route path="/notice" component={AnnounceManagePage} />
      <Route path="/resourceManage" component={ResourceManagePage} />
      <Route path="/apply" component={ActivityApplyPage} />
      <Route path="/typeList" component={ActivityTypePage} />
      <Route path="/discount" component={DiscountManagePage} />
      <Route path="/activityContent" component={ActivityContentPage} />
      <Route path="/discountSetting" component={DiscountSettingPage} />
      <Route path="/ipBlacklist" component={IpBlackListPage} />
      <Route path="/memberManage" component={MemberManagePage} />
      <Route path="/memberHierarchy" component={Hierarchy} />
      <Route path="/memberLabel" component={MemberLabelPage} />
      <Route path="/idleAccount" component={IdleAccountPage} />
      <Route path="/agentAccount" component={AgentAccountPage} />
      <Route path="/otherMembers" component={OtherMemberPage} />
      <Route path="/agentAudit" component={AgentAuditPage} />
      <Route path="/FundDetails" component={FundDetailPage} />
      <Route path="/transferRecord" component={TransferRecordPage} />
      <Route path="/subAgentRebate" component={SubAgentRebatePage} />
      <Route path="/agentLink" component={AgentLinkPage} />
      <Route path="/backgroundLog" component={CmsLogPage} />
      <Route path="/memberLog" component={MemberLogPage} />
      <Route path="/emailList" component={EmailManagePage} />
      <Route path="/currencySetting" component={CurrencySettingPage} />
      <Route path="/domainSetting" component={DomainSettingPage} />
      <Route path="/gameAccount" component={GameAccountPage} />
      <Route component={NotFount} />
    </Switch>
  );
};
