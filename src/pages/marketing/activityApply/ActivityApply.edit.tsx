import * as React from 'react';
import ApolloClient from 'apollo-client/ApolloClient';
import { compose, Mutation, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { ActivityApply } from './ActivityApply.model';
import withLocale from '../../../utils/withLocale';
import { EditFormUI, EditFormConfig } from '../../../zongzi/pc/form/EditFormUI';
import { GqlResult, writeFragment } from '../../../utils/apollo';

interface Hoc {
  client: ApolloClient<object>;
  site: (p: string) => React.ReactNode;
}

interface Props extends Partial<Hoc> {
  coupon: { visible: boolean; record: ActivityApply };
  withdraw: { visible: boolean; record: ActivityApply };
  couponFields: EditFormConfig[];
  withdrawFields: EditFormConfig[];
  setState: (state: object) => void;
}

/** 编辑优惠和取款 */
@withLocale
@compose(withApollo)
export default class ActivityApplyEdit extends React.PureComponent<Props, {}> {
  render(): React.ReactNode {
    const { site = () => '', client } = this.props as Hoc;
    return (
      <>
        {/* 修改优惠金额 */}
        <Mutation
          mutation={gql`
            mutation couponMutation($body: CouponInput!, $id: Int!) {
              coupon(body: $body, id: $id)
                @rest(
                  bodyKey: "body"
                  path: "/active.discount/:id"
                  method: "PATCH"
                  type: "CouponResult"
                ) {
                state
                message
              }
            }
          `}
        >
          {coupon => (
            <EditFormUI
              fieldConfig={this.props.couponFields}
              modalTitle={site('修改优惠金额')}
              modalOk={site('修改优惠金额成功')}
              modalVisible={this.props.coupon.visible}
              onCancel={() => {
                this.props.setState({
                  coupon: { visible: false, record: {} }
                });
              }}
              onSubmit={(values: ActivityApply) => {
                return coupon({ variables: { body: values, id: values.id } }).then(
                  (v: GqlResult<'coupon'>) => {
                    writeFragment(client, 'ActivityApply', values);
                    this.props.setState({
                      coupon: { visible: false, record: {} }
                    });
                    return v.data && v.data.coupon;
                  }
                );
              }}
              values={this.props.coupon.record}
              view={this}
            />
          )}
        </Mutation>
        {/* 修改取款条件 */}
        <Mutation
          mutation={gql`
            mutation withdrawMutation($body: WithdrawInput!, $id: Int!) {
              withdraw(body: $body, id: $id)
                @rest(
                  bodyKey: "body"
                  path: "/active.withdraw/:id"
                  method: "PATCH"
                  type: "WithdrawResult"
                ) {
                state
                message
              }
            }
          `}
        >
          {withdraw => (
            <EditFormUI
              fieldConfig={this.props.withdrawFields}
              modalTitle={site('修改取款条件')}
              modalOk={site('修改取款条件成功')}
              modalVisible={this.props.withdraw.visible}
              onCancel={() => {
                this.props.setState({
                  withdraw: { visible: false, record: {} }
                });
              }}
              onSubmit={(values: ActivityApply) => {
                return withdraw({ variables: { body: values, id: values.id } }).then(
                  (v: GqlResult<'withdraw'>) => {
                    writeFragment(client, 'ActivityApply', values);
                    this.props.setState({
                      withdraw: { visible: false, record: {} }
                    });
                    return v.data && v.data.withdraw;
                  }
                );
              }}
              values={this.props.withdraw.record}
              view={this}
            />
          )}
        </Mutation>
      </>
    );
  }
}
