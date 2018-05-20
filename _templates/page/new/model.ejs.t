---
to: src/pages/<%= h.inflection.camelize(name, true) %>/<%= h.inflection.camelize(name) %>.model.ts
---
<% Page = h.inflection.camelize(name); page = h.inflection.camelize(name, true) -%>
import { Model } from 'dva';
import gql from 'graphql-tag';

const <%= name %>: Model = {
  namespace: '<%= page %>',
  state: {},
};

export default <%= page %>;

export interface <%= Page %>Item {
  id: number;
}

export const <%= Page %>Fragment = gql`
  fragment <%= Page %>ItemFragment on <%= Page %>Item {
    id
  }
`
