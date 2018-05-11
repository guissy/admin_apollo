import * as React from 'react';
import { select } from '../../../utils/model';
import { connect, Dispatch } from 'dva';
import styled from 'styled-components';
import { Table, Tag } from 'antd';
import withLocale from '../../../utils/withLocale';
import { IntlKeys } from '../../../locale/zh_CN';
import { CurrencySettingState } from './CurrencySetting.model';

interface CurrencySettingsItem {
  changed: string;
  ctype: string;
  cytype: string;
  id: string;
  status: string;
}

interface Props {
  tableData: Array<CurrencySettingsItem>;
  isLoading: boolean;
  dispatch: Dispatch;
  site: (p: IntlKeys) => React.ReactNode;
  currencySetting: CurrencySettingState;
}

interface State {
  tableData: Array<CurrencySettingsItem>;
  isLoading: boolean;
}

/** 货币设定 */
@withLocale
@select('currencySetting')
export default class CurrencySetting extends React.PureComponent<Props, State> {
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
      tableData: nextProps.currencySetting.tableData,
      isLoading: false
    });
  }

  loadData = () => {
    this.props.dispatch({
      type: 'currencySetting/loadData',
      payload: {}
    });
  }

  render() {
    const columns = [
      {
        title: this.props.site('货币代码'),
        dataIndex: 'cytype'
      },
      {
        title: this.props.site('货币名称'),
        dataIndex: 'ctype'
      },
      {
        title: this.props.site('当前状态'),
        dataIndex: 'status',
        render: (status: string) => {
          if (status === '1') {
            return <Tag className={'account-opened'}>{this.props.site('启用')}</Tag>;
          } else {
            return <Tag className={'account-close'}>{this.props.site('停用')}</Tag>;
          }
        }
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
