import gql from 'graphql-tag';

/** 会员操作日志 */
export interface MemberLog {
  id: number;
  name: string;
  domain: string;
  log_type: string;
  status: string;
  created: string;
  log_ip: string;
  log_value: string;
}

/** 会员操作日志: GraphQL */
export const MemberLogFragment = gql`
  fragment MemberLogFragment on MemberLog {
    id
    name
    domain
    log_type
    status
    created
    log_ip
    log_value
  }
`;
