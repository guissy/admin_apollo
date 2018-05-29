---
to: src/pages/<%= h.folder(name) %>.model.ts
unless_exists: true
---
<% Page = h.Page(name); page = h.page(name) -%>
import gql from 'graphql-tag';

/** <%= h.title() %> */
export interface <%= Page %> {
  id: number;
<% h.fields().forEach(function(field){ -%>
  <%= field.dataIndex %>: string;
<% }) -%>
}

/** <%= h.title() %>: GraphQL */
export const <%= Page %>Fragment = gql`
  fragment <%= Page %>Fragment on <%= Page %> {
    id
<% h.fields().forEach(function(field){ -%>
    <%= field.dataIndex %>
<% }) -%>
  }
`;

<% h.form('select', name).forEach(function(field) { -%>
<% Type = h.Page(field.dataIndex);type = h.page(field.dataIndex); types = h.selectType(field, name) + 'List' -%>
/** <%- field.title %> */
export interface <%= Type %> {
  id: number;
  name: string;
}
/** <%- field.title %> GraphQL */
export const <%= type %>Query = gql`
  query {
    <%= types %> @rest(type: "<%= Type %>Result", path: "/<%= type %>") {
      data {
        id
        name
      }
    }
  }
`;
<% }) -%>