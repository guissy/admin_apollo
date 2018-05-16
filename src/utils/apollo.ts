import { stringify } from 'querystring';
import { curry } from 'lodash/fp';

function pathBuilderInner(path: string, params: object) {
  return `${path}?${stringify(params)}`;
}

/** 参数拼接 */
export const pathBuilder = curry(pathBuilderInner);
