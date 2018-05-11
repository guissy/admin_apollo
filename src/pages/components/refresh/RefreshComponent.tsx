import * as React from 'react';
import { IntlKeys } from '../../../locale/zh_CN';
import withLocale from '../../../utils/withLocale';
import { Dispatch } from 'dva';
import { Button, Form, Select } from 'antd';
import { select } from '../../../utils/model';
import { Attributes } from '../../../utils/result';
const Option = Select.Option;
const FormItem = Form.Item;

/** 手动/自动刷新 */
@withLocale
@select('')
export default class RefreshComponent extends React.PureComponent<RefreshProps, RefreshState> {
  static getDerivedStateFromProps(nextProps: RefreshProps) {
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
          <FormItem {...formItemLayout} label="刷新">
            <Select defaultValue="noUpdated" onChange={this.onRefreshChange}>
              <Option value="noUpdated">不刷新</Option>
              <Option value="30Second">30秒</Option>
              <Option value="60Second">60秒</Option>
              <Option value="120Second">120秒</Option>
              <Option value="180Second">180秒</Option>
            </Select>
          </FormItem>
        ) : (
          ''
        )}
      </>
    );
  }
}

/** 刷新组件props */
export interface RefreshProps {
  actionType: string; // namespace/effect
  type: 'manually' | 'auto'; // 手动 => manually 自动 => auto
  attributes: Attributes;
  site?: (words: IntlKeys) => React.ReactNode;
  dispatch?: Dispatch;
}

interface RefreshState {
  attributes: Attributes;
}
