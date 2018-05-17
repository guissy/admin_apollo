import { Model } from 'dva';
import gql from 'graphql-tag';

const activityContent: Model = {
  namespace: 'activityContent',
  state: {}
};

export default activityContent;

export interface ActivitycontentItem {
  id: number;
}

export const ActivitycontentFragment = gql`
  fragment ActivitycontentItemFragment on ActivitycontentItem {
    id
  }
`;
