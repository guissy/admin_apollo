---
to: src/pages/<%= name %>/<%= Name %>.model.ts
---
import { Model } from 'dva';
import gql from 'graphql-tag';

const <%= name %>: Model = {
  namespace: '<%= name %>',
  state: {},
};

export default <%= name %>;

export interface <%= Name %>Item {
  id: number;
}

export const <%= Name %>Fragment = gql`
  fragment <%= Name %>ItemFragment on <%= Name %>Item {
    id
  }
`
