import gql from 'graphql-tag';

/** 会员设置 */
export interface MemberSetting {
  id: number;
  mtoken: string;
  online: string;
  refuse_withdraw: string;
  refuse_sale: string;
  refuse_rebate: string;
  refuse_exchange: string;
}

/** 缓存数据：会员设置 */
export const MemberSettingFragment = gql`
  fragment MemberSettingFragment on MemberSetting {
    id
    mtoken
    online
    refuse_withdraw
    refuse_sale
    refuse_rebate
    refuse_exchange
  }
`;
