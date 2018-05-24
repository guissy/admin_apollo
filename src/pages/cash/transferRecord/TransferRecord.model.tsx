import gql from 'graphql-tag';

/** 转帐记录 */
export interface TransferRecord {
  id: number;
  username: string;
  no: string;
  status: string;
  start_time: string;
  end_time: string;
  out_id: string;
  in_id: string;
  op_name: string;
  created: string;
  memo: string;
}

/** 缓存数据：转帐记录 */
export const TransferRecordFragment = gql`
  fragment TransferRecordFragment on TransferRecord {
    id
    username
    no
    status
    start_time
    end_time
    out_id
    in_id
    op_name
    created
    memo
  }
`;

/** 状态 */
export interface Status {
  id: number;
  name: string;
}
/** 转出 */
export interface OutId {
  id: number;
  name: string;
}
/** 转入 */
export interface InId {
  id: number;
  name: string;
}
