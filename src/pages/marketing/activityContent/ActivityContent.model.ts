import { Model } from 'dva';
import gql from 'graphql-tag';

const activityContent: Model = {
  namespace: 'activityContent',
  state: {}
};

export default activityContent;

export interface ActivityContentItem {
  id: number;
}

export const ActivityContentItemFragment = gql`
  fragment ActivityContentItemFragment on ActivityContentItem {
    id
  }
`;
