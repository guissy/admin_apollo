import { stringify } from 'querystring';
import { curry } from 'lodash/fp';
import { Result } from './result';
import gql from 'graphql-tag';
import ApolloClient from 'apollo-client/ApolloClient';

function pathBuilderInner(path: string, params: object) {
  return `${path}?${stringify(params)}`;
}

/** 参数拼接 */
export const pathBuilder = curry(pathBuilderInner);

/**
 * 经过graphQL包装的数据格式
 */
export type GqlResult<T extends string = string> = {
  data: { [key in T]: Result<object> };
};

function writeFragmentInner(
  client: ApolloClient<{}> | undefined,
  typename: string,
  values: { id: number } & { [p: string]: any } // tslint:disable-line
) {
  const keys = Object.keys(values).join('\n');
  if (client) {
    client.writeFragment({
      id: `${typename}:${values.id}`,
      fragment: gql`
                  fragment ${typename}Fragment on ${typename} {
                    id
                    ${keys}
                  }
                `,
      data: {
        ...values,
        __typename: typename
      }
    });
  }
  return values;
}

/** 更新缓存 */
export const writeFragment = curry(writeFragmentInner);
