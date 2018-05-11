import * as React from 'react';
import AgentInformation from './agentInformation/AgentInformation';
import PromotionInformation from './promotionInfo/PromotionInfo';
// import BankDetail from './bankDetail/BankDetail';
// import MemberSetting from './memberSetting/MemberSetting';
// import Audit from './audit/Audit';

import { IntlKeys } from '../../../locale/zh_CN';
import withLocale from '../../../utils/withLocale';

import { Button, Tabs } from 'antd';
const TabPane = Tabs.TabPane;

interface Props {
  callBackPage: Function;
  agentId: string;
  site?: (p: IntlKeys) => React.ReactNode;
  agentType: string; // 判断 1层级代理，2直属代理",
}
/** 代理管理资料展开页面 */
// interface State {}
@withLocale
export default class AgentDetail extends React.PureComponent<Props> {
  callBackMemberManagePage = () => {
    this.props.callBackPage();
  }
  render() {
    const { site = () => null, agentId, agentType } = this.props;
    return (
      <div>
        <div>
          <Button onClick={this.callBackMemberManagePage} type="primary">
            {site('返回')}
          </Button>
        </div>
        <div className="card-container">
          <Tabs type="card">
            <TabPane tab={site('基本资料')} key="1">
              <AgentInformation agentId={agentId} agentType={agentType} />
            </TabPane>
            <TabPane tab={site('推广信息')} key="2">
              <PromotionInformation agentId={agentId} />
            </TabPane>
            <TabPane tab={site('账户余额')} key="3">
              {/* <Audit agentId={agentId} /> */}
            </TabPane>
            <TabPane tab={site('代理佣金')} key="4" disabled={agentType === '1'}>
              {/* <BankDetail agentId={agentId} /> */}
              {typeof agentType}
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}
