import gql from 'graphql-tag';

/** 会员标签 */
export interface MemberLabel {
  id: number;
  title: string;
  content: string;
  admin_name: string;
  inserted: string;
}

/** 缓存数据：会员标签 */
export const MemberLabelFragment = gql`
  fragment MemberLabelFragment on MemberLabel {
    id
    title
    content
    admin_name
    inserted
  }
`;
