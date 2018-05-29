import gql from 'graphql-tag';

/** 代理推广资源 */
export interface ProxyPromotion {
  id: number;
  name: string;
  width: string;
  length: string;
  wh: string;
  file_type: string;
  picture: string;
  language_id: string;
  script: string;
  status: string;
  created: string;
}

/** 代理推广资源: GraphQL */
export const ProxyPromotionFragment = gql`
  fragment ProxyPromotionFragment on ProxyPromotion {
    id
    name
    width
    length
    wh
    file_type
    picture
    language_id
    script
    status
    created
  }
`;
