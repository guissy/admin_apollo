import * as React from 'react';
import ApolloClient from 'apollo-client/ApolloClient';
import { compose, Mutation, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import withLocale from '../../../../utils/withLocale';
import { GqlResult, writeFragment } from '../../../../utils/apollo';
import { EditFormUI, EditFormConfig } from '../../../components/form/EditFormUI';
import { MemberSetting } from './MemberSetting.model';

interface Hoc {
  client: ApolloClient<object>;
  site: (p: string) => React.ReactNode;
}

interface Props extends Partial<Hoc> {
  edit: { visible: boolean; record: MemberSetting };
  editFields: EditFormConfig[];
  modalTitle: string;
  modalOk: string;
  view: React.PureComponent<{}>;
}

/** 会员设置表单 */
@withLocale
@compose(withApollo)
export default class MemberSettingEdit extends React.PureComponent<Props, {}> {
  state = {};

  render(): React.ReactNode {
    const { client } = this.props as Hoc;
    return (
      <Mutation
        mutation={gql`
          mutation editMutation($body: MemberSettingEditInput!, $id: Int!) {
            edit(body: $body, id: $id)
              @rest(
                bodyKey: "body"
                path: "/memberSetting/:id"
                method: "put"
                type: "MemberSettingEditResult"
              ) {
              state
              message
            }
          }
        `}
      >
        {edit => (
          <EditFormUI
            isPage={true}
            fieldConfig={this.props.editFields}
            modalTitle={this.props.modalTitle}
            modalOk={this.props.modalOk}
            modalVisible={this.props.edit.visible}
            onSubmit={(values: MemberSetting) => {
              return edit({ variables: { body: values, id: values.id } }).then(
                (v: GqlResult<'edit'>) => {
                  writeFragment(client, 'MemberSetting', values);
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
