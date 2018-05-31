import * as React from 'react';
import ApolloClient from 'apollo-client/ApolloClient';
import { compose, Mutation, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import withLocale from '../../../utils/withLocale';
import { GqlResult, writeFragment } from '../../../utils/apollo';
import { EditFormUI, EditFormConfig } from '../../../zongzi/pc/form/EditFormUI';
import { OtherMember } from './OtherMember.model';

interface Hoc {
  client: ApolloClient<object>;
  site: (p: string) => React.ReactNode;
}

interface Props extends Partial<Hoc> {
  edit: { visible: boolean; record: OtherMember };
  editFields: EditFormConfig[];
  onDone: () => void;
  modalTitle: string;
  modalOk: string;
  view: React.PureComponent<{}>;
}

/** 第三方会员查询表单 */
@withLocale
@compose(withApollo)
export default class OtherMemberEdit extends React.PureComponent<Props, {}> {
  state = {};

  render(): React.ReactNode {
    const { client } = this.props as Hoc;
    return (
      <Mutation
        mutation={gql`
          mutation editMutation($body: OtherMemberEditInput!, $id: Int!) {
            edit(body: $body, id: $id)
              @rest(
                bodyKey: "body"
                path: "/otherMember/:id"
                method: "put"
                type: "OtherMemberEditResult"
              ) {
              state
              message
            }
          }
        `}
      >
        {edit => (
          <EditFormUI
            fieldConfig={this.props.editFields}
            modalTitle={this.props.modalTitle}
            modalOk={this.props.modalOk}
            modalVisible={this.props.edit.visible}
            onCancel={() => {
              this.props.onDone();
            }}
            onSubmit={(values: OtherMember) => {
              return edit({ variables: { body: values, id: values.id } }).then(
                (v: GqlResult<'edit'>) => {
                  writeFragment(client, 'OtherMember', values);
                  this.props.onDone();
                  return v.data && v.data.edit;
                }
              );
            }}
            values={this.props.edit.record}
            view={this.props.view}
          />
        )}
      </Mutation>
    );
  }
}
