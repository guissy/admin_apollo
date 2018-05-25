import gql from 'graphql-tag';

/** 第三方会员查询 */
export interface OtherMember {
  id: number;
  uname: string;
  name: string;
  game_username: string;
}

/** 缓存数据：第三方会员查询 */
export const OtherMemberFragment = gql`
  fragment OtherMemberFragment on OtherMember {
    id
    uname
    name
    game_username
  }
`;

/** 第三方游戏 */
export interface Name {
  id: number;
  name: string;
}
