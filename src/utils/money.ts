import update, { Query } from 'immutability-helper';
import { Attributes, Result } from './result';
import { queryTableData } from '../pages/brokerage/subAgentRebate2/SubAgentRebate.service';
import { TableRow } from '../pages/brokerage/subAgentRebate2/SubAgentRebate.model';

update.extend('$for', function(value: object, array: object | object[]) {
  if (array == null) {
    return [];
  }
  return Array.isArray(array)
    ? array.map(item => update(item, value))
    : Object.entries(array)
        .map(([key, item]) => [key, update(item, value)])
        .reduce((obj, [key, item]) => ({ ...obj, [key]: item }), {});
});

// 返回 $apply 对象可执行乘除100
function moneyTo(type: '/100' | '*100') {
  return {
    $apply: (money: number) => {
      const moneyOk = type === '/100' ? money / 100 : money * 100;
      if (isNaN(moneyOk)) {
        return money;
      } else {
        return moneyOk;
      }
    }
  };
}

/**
 * 除以100: 单位分转元
 * @example
 * const data = [{money: 100}]
 * update(data, {$for: {money: yuan} );
 */
export const yuan = moneyTo('/100');
/**
 * 乘以100: 单位元转分
 * @example
 * const data = [{money: 100}]
 * update(data, {$for: {money: fen} );
 */
export const fen = moneyTo('*100');

/**
 * 转换 Result
 * @see queryTableData
 * @example
 * request(`/query`, { method: 'get' })
 *   .then(
 *     moneyForResult({
 *       data: {
 *         $for: {
 *           money: yuan
 *         }
 *       }
 *    })
 *  ）;
 */
export function moneyForResult<T>(moneyOption: QueryResult<T>) {
  return (result: Result<T>) => {
    if (Number(result.state) === 0) {
      result = update(result, moneyOption);
    }
    return result;
  };
}

/**
 * 转换 param: 提交给后台的参数
 * @example
 * paramOk = moneyForParam({
 *            money: yuan
 *          })(param);
 */
export function moneyForParam<T>(moneyOption: QueryResult<T>) {
  return (param: object) => {
    if (typeof param === 'object') {
      param = update(param, moneyOption);
    }
    return param;
  };
}

type Item<T> = T extends (infer U)[] ? U : T;
type Tree<T> = { [K in keyof T]?: QueryLoop<T[K]> };
type QueryLoop<T> = Tree<Item<T>> | For<Item<T>>;
type For<T> = { $for: Tree<T> | For<T> } | { $apply: (old: T) => T } | any; // tslint:disable-line:no-any
type QueryResult<T> = { data: QueryLoop<T>; attributes?: QueryLoop<Attributes> };
