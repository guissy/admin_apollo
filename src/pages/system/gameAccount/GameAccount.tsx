import * as React from 'react';
import { select } from '../../../utils/model';
import { connect, Dispatch } from 'dva';
import styled from 'styled-components';
import {
  Radio,
  Icon,
  Divider,
  Tag,
  Checkbox,
  Row,
  Col,
  Button,
  Modal,
  Form,
  Select,
  Input,
  Card,
  message,
  Table
} from 'antd';
import withLocale from '../../../utils/withLocale';
import { IntlKeys } from '../../../locale/zh_CN';
import { GameAccountState } from './GameAccount.model';

interface Props {
  dispatch: Dispatch;
  site: (p: IntlKeys) => React.ReactNode;
  gameAccount: GameAccountState;
}

interface State {
  tableData: Array<object>;
  isLoading: boolean;
}

/** 游戏后台帐号 */
@withLocale
@select('gameAccount')
export default class GameAccount extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      tableData: [],
      isLoading: true
    };
  }

  componentWillMount() {
    this.loadData();
  }

  componentWillReceiveProps(nextProps: Props) {
    this.setState({
      ...nextProps.gameAccount,
      isLoading: false
    });
  }

  loadData = () => {
    this.props.dispatch({
      type: 'gameAccount/loadData',
      payload: {}
    });
  }

  render() {
    const columns = [
      {
        title: this.props.site('游戏类型'),
        dataIndex: 'partner_name'
      },
      {
        title: this.props.site('后台网址'),
        dataIndex: 'admin_url'
      },
      {
        title: this.props.site('登录账号'),
        dataIndex: 'admin_account'
      },
      {
        title: this.props.site('登录密码'),
        dataIndex: 'admin_password'
      }
    ];

    return (
      <div>
        <Table
          columns={columns}
          dataSource={this.state.tableData}
          bordered={true}
          loading={this.state.isLoading}
          rowKey={(r, i) => String(i)}
        />
      </div>
    );
  }
}
