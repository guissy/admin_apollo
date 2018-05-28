---
to: src/pages/<%= h.folder(name) %>.edit.tsx
unless_exists: true
---
<% Page = h.Page(name); page = h.page(name); dd = h.dd(name) -%>
import * as React from 'react';
import ApolloClient from 'apollo-client/ApolloClient';
import { compose, Mutation, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import withLocale from '<%= dd %>../utils/withLocale';
import { GqlResult, writeFragment } from '<%= dd %>../utils/apollo';
import { EditFormUI, EditFormConfig } from '<%= dd %>components/form/EditFormUI';
import { <%= Page %> } from './<%= Page %>.model';

interface Hoc {
  client: ApolloClient<object>;
  site: (p: string) => React.ReactNode;
}

interface Props extends Partial<Hoc> {
  edit: { visible: boolean; record: <%= Page %> };
  editFields: EditFormConfig[];
  modalTitle: string;
  modalOk: string;
  view: React.PureComponent<{}>;
}

/** <%= h.title() %>表单 */
@withLocale
@compose(withApollo)
export default class <%= Page %>Edit extends React.PureComponent<Props, {}> {
  state = {};

  render(): React.ReactNode {
    const { client } = this.props as Hoc;
    return (
      <Mutation
        mutation={gql`
          mutation editMutation($body: <%= Page %>EditInput!, $id: Int!) {
            edit(body: $body, id: $id)
              @rest(
                bodyKey: "body"
                path: "/<%= page %>/:id"
                method: "put"
                type: "<%= Page %>EditResult"
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
            onSubmit={(values: <%= Page %>) => {
              return edit({ variables: { body: values, id: values.id } }).then(
                (v: GqlResult<'edit'>) => {
                  writeFragment(client, '<%= Page %>', values);
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
