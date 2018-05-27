import gql from 'graphql-tag';

/** 推广信息 */
export interface Promotion {
  id: number;
  code: string;
  site: string;
  link: string;
}

/** 缓存数据：推广信息 */
export const PromotionFragment = gql`
  fragment PromotionFragment on Promotion {
    id
    code
    site
    link
  }
`;
