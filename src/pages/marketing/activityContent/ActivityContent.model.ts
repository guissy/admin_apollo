import gql from 'graphql-tag';

export interface ActivityContent {
  id: number;
  types: { name: string }[];
  name: string;
  title: string;
  cover: string;
  begin_time: string;
  end_time: string;
  language_id: number;
  language_name: string;
  description: string;
  sort: number;
  open_type: string;
  link: string;
  content: string;
  content2: string;
  apply_times: string;
  created: string;
  created_uname: string;
  updated: string;
  updated_uname: string;
  status: string;
  memo: string;
}

export const ActivityContentFragment = gql`
  fragment ActivityContentFragment on ActivityContent {
    id
    types
    name
    title
    cover
    begin_time
    end_time
    language_id
    language_name
    description
    sort
    open_type
    link
    content
    content2
    apply_times
    created
    created_uname
    updated
    updated_uname
    status
    memo
  }
`;

export interface ActivityType {
  name: string;
  id: number;
}
