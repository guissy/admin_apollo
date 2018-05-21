import { Model } from 'dva';
import gql from 'graphql-tag';

const activityType: Model = {
  namespace: 'activityType',
  state: {}
};

/** dva 模型 */
export default activityType;

/** 实体类型 */
export interface ActivityType {
  id: number;
  name: string;
  description: string;
  sort: number;
  created_uname: string;
  created: string;
  updated: string;
}

/** 缓存数据：实体类型 */
export const ActivityTypeFragment = gql`
  fragment ActivityTypeFragment on ActivityType {
    id
    name
    description
    sort
    created_uname
    created
    updated
  }
`;
