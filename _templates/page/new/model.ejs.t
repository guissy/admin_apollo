---
to: src/pages/<%= h.folder(name) %>.model.tsx
unless_exists: true
---
<% Page = h.Page(name); page = h.page(name) -%>
import { Model } from 'dva';
import gql from 'graphql-tag';

const <%= page %>: Model = {
  namespace: '<%= page %>',
  state: {},
};

/** dva 模型 */
export default <%= page %>;

/** 实体类型 */
export interface <%= Page %> {
  id: number;
}

/** 缓存数据：实体类型 */
export const <%= Page %>Fragment = gql`
  fragment <%= Page %>Fragment on <%= Page %> {
    id
  }
`
