import * as React from 'react';
import ApolloClient from 'apollo-client/ApolloClient';
import { compose, Mutation, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { ApplyItem } from './Apply.model';
import withLocale from '../../../utils/withLocale';
import { EditFormComponent, EditFormConfig } from '../../components/form/EditFormComponent';
import { GqlResult, writeFragment } from '../../../utils/apollo';

interface Hoc {
  client: ApolloClient<object>;
  site: (p: string) => React.ReactNode;
}

interface Props extends Partial<Hoc> {
  coupon: { visible: boolean; record: ApplyItem };
  withdraw: { visible: boolean; record: ApplyItem };
  couponFields: EditFormConfig[];
  withdrawFields: EditFormConfig[];
  setState: (state: object) => void;
}

/** 编辑优惠和取款 */
@withLocale
@compose(withApollo)
export default class ApplyEdit extends React.PureComponent<Props, {}> {
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
            <EditFormComponent
              fieldConfig={this.props.couponFields}
              modalTitle={site('修改优惠金额')}
              modalOk={site('修改优惠金额成功')}
              modalVisible={this.props.coupon.visible}
              onCancel={() => {
                this.props.setState({
                  coupon: { visible: false, record: {} }
                });
              }}
              onSubmit={(values: ApplyItem) => {
                return coupon({ variables: { body: values, id: values.id } }).then(
                  (v: GqlResult<'coupon'>) => {
                    writeFragment(client, 'ApplyItem', values);
                    this.props.setState({
                      coupon: { visible: false, record: {} }
                    });
                    return v.data.coupon;
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
            <EditFormComponent
              fieldConfig={this.props.withdrawFields}
              modalTitle={site('修改取款条件')}
              modalOk={site('修改取款条件成功')}
              modalVisible={this.props.withdraw.visible}
              onCancel={() => {
                this.props.setState({
                  withdraw: { visible: false, record: {} }
                });
              }}
              onSubmit={(values: ApplyItem) => {
                return withdraw({ variables: { body: values, id: values.id } }).then(
                  (v: GqlResult<'withdraw'>) => {
                    writeFragment(client, 'ApplyItem', values);
                    this.props.setState({
                      withdraw: { visible: false, record: {} }
                    });
                    return v.data.withdraw;
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
