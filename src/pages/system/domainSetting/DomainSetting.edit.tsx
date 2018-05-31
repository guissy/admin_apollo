import * as React from 'react';
import ApolloClient from 'apollo-client/ApolloClient';
import { compose, Mutation, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import withLocale from '../../../utils/withLocale';
import { GqlResult, writeFragment } from '../../../utils/apollo';
import { EditFormUI, EditFormConfig } from '../../../zongzi/pc/form/EditFormUI';
import { DomainSetting } from './DomainSetting.model';

interface Hoc {
  client: ApolloClient<object>;
  site: (p: string) => React.ReactNode;
}

interface Props extends Partial<Hoc> {
  edit: { visible: boolean; record: DomainSetting };
  editFields: EditFormConfig[];
  modalTitle: string;
  modalOk: string;
  view: React.PureComponent<{}>;
}

/** 前台域名设置表单 */
@withLocale
@compose(withApollo)
export default class DomainSettingEdit extends React.PureComponent<Props, {}> {
  state = {};

  render(): React.ReactNode {
    const { client } = this.props as Hoc;
    return (
      <Mutation
        mutation={gql`
          mutation editMutation($body: DomainSettingEditInput!, $id: Int!) {
            edit(body: $body, id: $id)
              @rest(
                bodyKey: "body"
                path: "/domainSetting/:id"
                method: "put"
                type: "DomainSettingEditResult"
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
            onSubmit={(values: DomainSetting) => {
              return edit({ variables: { body: values, id: values.id } }).then(
                (v: GqlResult<'edit'>) => {
                  writeFragment(client, 'DomainSetting', values);
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
