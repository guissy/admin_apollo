import * as React from 'react';
import ApolloClient from 'apollo-client/ApolloClient';
import { compose, Mutation, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import withLocale from '../../../../utils/withLocale';
import { GqlResult, writeFragment } from '../../../../utils/apollo';
import { EditFormUI, EditFormConfig } from '../../../../zongzi/pc/form/EditFormUI';
import { Promotion } from './Promotion.model';

interface Hoc {
  client: ApolloClient<object>;
  site: (p: string) => React.ReactNode;
}

interface Props extends Partial<Hoc> {
  edit: { visible: boolean; record: Promotion };
  editFields: EditFormConfig[];
  onDone?: () => void;
  modalTitle: string;
  modalOk: string;
  view: React.PureComponent<{}>;
}

/** 推广信息表单 */
@withLocale
@compose(withApollo)
export default class PromotionEdit extends React.PureComponent<Props, {}> {
  state = {};

  render(): React.ReactNode {
    const { client } = this.props as Hoc;
    return (
      <Mutation
        mutation={gql`
          mutation editMutation($body: PromotionEditInput!, $id: Int!) {
            edit(body: $body, id: $id)
              @rest(
                bodyKey: "body"
                path: "/promotion/:id"
                method: "put"
                type: "PromotionEditResult"
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
            onCancel={this.props.onDone}
            onSubmit={(values: Promotion) => {
              return edit({ variables: { body: values, id: values.id } }).then(
                (v: GqlResult<'edit'>) => {
                  writeFragment(client, 'Promotion', values);
                  if (this.props.onDone) {
                    this.props.onDone();
                  }
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
