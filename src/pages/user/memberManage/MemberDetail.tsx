import * as React from 'react';
import MemberInformation from './information/Information';
import AccountBalance from './balance/Balance';
import BankDetail from './bankDetail/BankDetail';
import MemberSetting from './memberSetting/MemberSetting';
import Audit from './audit/Audit';

import { IntlKeys } from '../../../locale/zh_CN';
import withLocale from '../../../utils/withLocale';

import { Button, Tabs } from 'antd';
const TabPane = Tabs.TabPane;

interface Props {
  callBackPage: Function;
  userId: number;
  site?: (p: IntlKeys) => React.ReactNode;
}
// interface State {}
@withLocale
// tslint:disable-next-line:top-level-comment
export default class MemberDetail extends React.PureComponent<Props> {
  constructor(props: Props) {
    super(props);
  }
  callBackMemberManagePage = () => {
    this.props.callBackPage();
  }
  render() {
    const { site = () => null, userId } = this.props;
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
              <MemberInformation userId={userId} />
            </TabPane>
            <TabPane tab={site('账户余额')} key="2">
              <AccountBalance userId={userId} />
            </TabPane>
            <TabPane tab={site('取款稽核信息')} key="3">
              <Audit userId={userId} />
            </TabPane>
            <TabPane tab={site('银行信息')} key="4">
              <BankDetail userId={userId} />
            </TabPane>
            <TabPane tab={site('会员设置')} key="5">
              <MemberSetting userId={userId} />
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}
