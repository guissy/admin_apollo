---
to: src/pages/<%= h.folder(name) %>.field.tsx
unless_exists: true
sh: prettier --print-width 100 --single-quote --trailing-commas all --parser typescript --write src/pages/<%= h.folder(name) %>.field.tsx
---
<% Page = h.Page(name); page = h.page(name); dd = h.dd(name) -%>
import * as React from 'react';
import ApolloClient from 'apollo-client/ApolloClient';
import { Input, InputNumber, Tag, Select, Switch, DatePicker } from 'antd';
import { Query, ChildProps, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { moneyPattern } from '<%= dd %>../utils/formRule';
import LinkComponent from '<%= dd %>components/link/LinkComponent';
import withLocale from '<%= dd %>../utils/withLocale';
import TableFormField, { FieldProps, notInTable } from '<%= dd %>../utils/TableFormField';
import TableActionComponent from '<%= dd %>components/table/TableActionComponent';
import { messageResult } from '<%= dd %>../utils/showMessage';
import { GqlResult, writeFragment } from '<%= dd %>../utils/apollo';
import { Result } from '<%= dd %>../utils/result';
import <%= Page %>Page from './<%= Page %>.page';
import { <%= Page %>, <%= Page %>Fragment<%= h.form('select', name).map(v => ', ' + h.Page(v.dataIndex) + ', ' + h.page(v.dataIndex) + 'Query').join('') %>} from './<%= Page %>.model';

const site = withLocale.site;

/** <%= h.title() %>字段 */
export default class <%= Page %>Field<T extends { client: ApolloClient<{}> }> extends TableFormField<T> {
  id = {
    form: <input type="hidden" />,
    table: notInTable
  };

<% h.fields().forEach(function(field){ -%>
  <%- h.key(field.dataIndex) %> = {
    title: site('<%= field.title %>'),
    form: <% if (field.dataIndex === 'status') { -%> (
      <Switch
        checkedChildren={site('启用')}
        unCheckedChildren={site('停用')}
      />),
<% } else if (field.form === 'date') { -%>
<DatePicker.RangePicker />,
<% } else if (field.form === 'number') { -%>
<InputNumber />,
<% } else if (field.form === 'textarea') { -%>
<Input.TextArea />,
<% } else if (field.form === 'select') { -%>
<% Type = h.selectType(field, name, true);type = h.selectType(field, name); types = h.selectType(field, name) + 'List'; -%>
({
      text,
      record,
      view,
      value,
      onChange
    }: FieldProps<string, <%= Type %>, <%= Page %>Page>) => (
      <Query query={<%= type%>Query}>
        {({ data: { <%= types %> = { data: [] as <%= Type %>[] } } = {} }:
  ChildProps<{}, { <%= types %>: Result<<%= Type %>[]> }, {}>) => (
          <Select defaultValue={value} onChange={onChange}>
            {<%= types %>.data.map((type: <%= Type %>, i: number) => (
              <Select.Option key={i} value={String(type.id)}>
                {type.name}
              </Select.Option>
            ))}
          </Select>
        )}
      </Query>
    ),  
    table: ({ text, record, view }: FieldProps<string, <%= Type %>, <%= Page %>Page>) => (
      <Query query={<%= type %>Query}>
        {({
          data: { <%= types %> = { data: [] as <%= Type %>[] } } = {}
        }: ChildProps<{}, { <%= types %>: Result<<%= Type %>[]> }, {}>) =>
          <%= types %>.data
            .filter(<%= type %> => <%= type %>.id === Number(text))
            .map(<%= type %> => <%= type %>.name)
        }
      </Query>
    ),
<% } else { -%>
<Input />,
<% } -%>
<% if (field.dataIndex === 'status') { -%>
    table: ({ text, record, view }: FieldProps<string, <%= Page %>, <%= Page %>Page>) => (
      <>
        {record.status === 'enabled' ? (
        <Tag className="account-opened">{site('启用')}</Tag>
        ) : (
        <Tag className="account-close">{site('停用')}</Tag>
        )}
      </>),
<% } -%>
<% if (field.dataIndex.includes(',')) { -%>
    table: ({ text, record, view }: FieldProps<string, <%= Page %>, <%= Page %>Page>) => (
      <>
        {record.<%- field.dataIndex.split(',')[0] %>} <br/>
        {record.<%- field.dataIndex.split(',')[1] %>}
      </>),
<% } -%>
  };

<% }) -%>
  oparation = {
    title: site('操作'),
    table: ({ record, view }: FieldProps<string, <%= Page %>, <%= Page %>Page>) => {
      return (
        !record.isTotalRow && (
<% if (h.fields().map(v => v.dataIndex).includes('status') ) { -%>
          <Mutation
            mutation={gql`
              mutation statusMutation($body: StatusInput!) {
                status(body: $body)
                  @rest(
                    bodyKey: "body"
                    path: "/<%= page %>/status"
                    method: "PUT"
                    type: "StatusResult"
                  ) {
                  state
                  message
                }
              }
            `}
          >
            {status => (
<% } -%>
          <Mutation
            mutation={gql`
              mutation removeMutation($id: RemoveInput!) {
                remove(id: $id)
                  @rest(
                    path: "/<%= page %>/:id"
                    method: "DELETE"
                    type: "RemoveResult"
                  ) {
                  state
                  message
                }
              }
            `}
            refetchQueries={['<%= page %>Query']}
          >
            {remove => (
              <TableActionComponent>
<% if (h.fields().map(v => v.dataIndex).includes('status') ) { -%>
                <LinkComponent
                  confirm={true}
                  onClick={() =>
                    status({
                      variables: {
                        body: {
                          id: record.id,
                          status: record.status === 'enabled' ? 'disabled' : 'enabled'
                        }
                      }
                    })
                      .then(messageResult('status'))
                      .then((v: GqlResult<'status'>) => {
                        writeFragment(this.props.client, '<%= Page %>', {
                          id: record.id,
                          status: record.status === 'enabled' ? 'disabled' : 'enabled'
                        });
                        return v.data && v.data.status;
                      })
                  }
                >
                  {record.status === 'enabled' ? site('停用') : site('启用')}
                </LinkComponent>
<% } -%>
                <LinkComponent
                  confirm={true}
                  onClick={() =>
                    remove({ variables: { id: record.id } })
                      .then(messageResult('remove'))
                      .then((v: GqlResult<'remove'>) => {
                        return v.data && v.data.remove;
                      })
                  }
                >
                  {site('删除')}
                </LinkComponent>
                <LinkComponent
                  onClick={() => {
                    this.setState({
                      edit: { visible: true, record }
                    });
                  }}
                >
                  编辑
                </LinkComponent>
              </TableActionComponent>
            )}
          </Mutation>
<% if (h.fields().map(v => v.dataIndex).includes('status') ) { -%>
            )}
          </Mutation>
<% } -%>
        )
      );
    }
  };

  constructor(view: React.PureComponent<T>) {
    super(view);
  }
}
