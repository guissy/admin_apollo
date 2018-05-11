import * as React from 'react';

import Hierarchy from './hierarchy/Hierarchy';
import MemberQuery from './memberQuery/MemberQuery';

import { IntlKeys } from '../../../locale/zh_CN';
import withLocale, { siteFunction } from '../../../utils/withLocale';

import { Button, Tabs } from 'antd';
const TabPane = Tabs.TabPane;

interface Props {
  site?: siteFunction;
}

@withLocale
// tslint:disable-next-line:top-level-comment
export default class MemberHierarchy extends React.PureComponent<Props> {
  render() {
    // const { site = () => null } = this.props;
    const { site = () => '' } = this.props;
    return (
      <div>
        <div className="card-container">
          <Tabs type="card">
            <TabPane tab={site('层级管理')} key="1">
              <Hierarchy />
            </TabPane>
            <TabPane tab={site('会员查询')} key="2">
              <MemberQuery />
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}
