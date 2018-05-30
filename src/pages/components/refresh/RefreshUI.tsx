import * as React from 'react';
import withLocale from '../../../utils/withLocale';
import { Dispatch } from 'dva';
import { Button, Form, Select } from 'antd';
import { select } from '../../../utils/model';
import { Attributes } from '../../../utils/result';

interface Props {
  actionType: string; // namespace/effect
  type: 'manually' | 'auto'; // 手动 => manually 自动 => auto
  attributes?: Attributes;
  site?: (words: string) => React.ReactNode;
  dispatch?: Dispatch;
}

/** 手动/自动刷新 */
@withLocale
@select('')
export default class RefreshUI extends React.PureComponent<Props, {}> {
  static getDerivedStateFromProps(nextProps: Props) {
    return {
      attributes: nextProps.attributes
    };
  }

  timer: number;
  state = {
    attributes: {
      number: 0,
      size: 0,
      total: 0
    }
  };

  onRefresh = () => {
    this.refreshAction();
  }

  onRefreshChange = (value: string) => {
    if (this.state.attributes.number !== 1) {
      return;
    }
    switch (value) {
      case '30Second':
        this.refreshTimer(30 * 1000);
        break;
      case '60Second':
        this.refreshTimer(60 * 1000);
        break;
      case '120Second':
        this.refreshTimer(120 * 1000);
        break;
      case '180Second':
        this.refreshTimer(180 * 1000);
        break;
      default:
        window.clearInterval(this.timer);
    }
  }

  refreshTimer = (interval: number) => {
    window.clearInterval(this.timer);
    this.timer = window.setInterval(() => {
      this.refreshAction();
    },                              interval);
  }

  refreshAction = () => {
    this.props.dispatch!({
      type: this.props.actionType,
      payload: {
        page: this.state.attributes.number,
        pageSize: this.state.attributes.number
      }
    });
  }

  render() {
    const { type, site = () => null } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 1 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 3 }
      }
    };
    return (
      <>
        {type === 'manually' ? <Button onClick={this.onRefresh}>刷新</Button> : ''}
        {type === 'auto' ? (
          <Form.Item {...formItemLayout} label="刷新">
            <Select defaultValue="noUpdated" onChange={this.onRefreshChange}>
              <Select.Option value="noUpdated">不刷新</Select.Option>
              <Select.Option value="30Second">30秒</Select.Option>
              <Select.Option value="60Second">60秒</Select.Option>
              <Select.Option value="120Second">120秒</Select.Option>
              <Select.Option value="180Second">180秒</Select.Option>
            </Select>
          </Form.Item>
        ) : (
          ''
        )}
      </>
    );
  }
}
