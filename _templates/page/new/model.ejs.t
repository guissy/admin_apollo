---
to: src/pages/<%= h.folder(name) %>.model.tsx
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

/** 缓存数据：<%= h.title() %> */
export const <%= Page %>Fragment = gql`
  fragment <%= Page %>Fragment on <%= Page %> {
    id
<% h.fields().forEach(function(field){ -%>
    <%= field.dataIndex %>
<% }) -%>
  }
`;

<% h.form('select').forEach(function(field) { -%>
<% Type = h.Page(field.dataIndex);type = h.page(field.dataIndex); -%>
/** <%- field.title %> */
export interface <%= Type %> {
  id: number;
  name: string;
}
<% }) -%>
