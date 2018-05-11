import * as React from 'react';
import { select } from '../../../../utils/model';
import { connect, Dispatch } from 'dva';
import { AgentMarketState, AgentMarketData } from './PromotionInfo.model';
import styled from 'styled-components';
import { showMessageForResult } from '../../../../utils/showMessage';
import { IntlKeys } from '../../../../locale/zh_CN';
import withLocale from '../../../../utils/withLocale';
import { Row, Col, Form, Input, Button, Select, message } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';

const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;

const InformationCon = styled.div`
  .button-con {
    text-align: center;
  }
`;

interface Props {
  site?: (p: IntlKeys) => React.ReactNode;
  agentId: string;
  dispatch?: Dispatch;
  // tslint:disable-next-line:no-any
  promotionInfo?: AgentMarketState | any;
  // tslint:disable-next-line:no-any
  form?: WrappedFormUtils | any;
}
interface State {
  agentId: string;
}
/** 代理管理推广信息页面 */
@withLocale
@select('promotionInfo')
@Form.create()
export default class PromotionInfo extends React.Component<Props, State> {
  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    if (nextProps.agentId !== prevState.agentId) {
      return {
        agentId: nextProps.agentId
      };
    }
    return null;
  }

  state = {
    agentId: ''
  };
  componentDidMount() {
    this.props.dispatch!({
      type: 'promotionInfo/getMarketInfo',
      payload: {
        id: this.state.agentId
      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { site = () => null, promotionInfo } = this.props;
    const { agentMarketInfo } = promotionInfo;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 }
      }
    };
    return (
      <InformationCon>
        <Form>
          <Row type="flex">
            <Col span={24}>
              <FormItem {...formItemLayout} label={site('个人网站')}>
                <span>{agentMarketInfo.website}</span>
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem {...formItemLayout} label={site('推广码')}>
                <span>{agentMarketInfo.code}</span>
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem {...formItemLayout} label={site('会员推广链接')}>
                <span>
                  {agentMarketInfo.member_ads_site &&
                    agentMarketInfo.member_ads_site.length &&
                    agentMarketInfo.member_ads_site.join('; ')}
                </span>
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem {...formItemLayout} label={site('下级代理链接')}>
                <span>
                  {agentMarketInfo.sub_agent_site &&
                    agentMarketInfo.sub_agent_site.length &&
                    agentMarketInfo.sub_agent_site.join('; ')}
                </span>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </InformationCon>
    );
  }
}
