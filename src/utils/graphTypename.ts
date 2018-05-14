import { constant } from 'lodash/fp';
import update from 'immutability-helper';

/** 带 __typename */
export function addTypename(typename: string) {
  return (result: object) =>
    update(result, {
      data: {
        $for: {
          __typename: constant(typename)
        }
      }
    });
}
/** 给主类加子类 */
export function addTypePatcher(
  mainType: string,
  itemType: string,
  fn?: (result: object) => object,
  isObject: boolean = false
) {
  return {
    [mainType](result: object) {
      const resultOk = update(result, {
        data: isObject
          ? {
              __typename: constant(itemType)
            }
          : {
              $for: {
                __typename: constant(itemType)
              }
            }
      });
      return typeof fn === 'function' ? fn(resultOk) : resultOk;
    }
  };
}
