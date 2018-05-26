import * as React from 'react';
import withLocale, { siteFunction } from '../../../utils/withLocale';
import { Button, Tabs } from 'antd';
import MemberHierarchyPage from './memberHierarchy/MemberHierarchy.page';
import MemberQueryPage from './memberQuery/MemberQuery.page';
const TabPane = Tabs.TabPane;

interface Props {
  site?: siteFunction;
}

/** 层级管理/会员查询 */
@withLocale
export default class Hierarchy extends React.PureComponent<Props> {
  render() {
    const { site = () => '' } = this.props;
    return (
      <div>
        <div className="card-container">
          <Tabs type="card">
            <TabPane tab={site('层级管理')} key="1">
              <MemberHierarchyPage />
            </TabPane>
            <TabPane tab={site('会员查询')} key="2">
              <MemberQueryPage />
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}
