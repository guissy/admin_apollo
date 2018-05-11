import update from 'immutability-helper';
import { fen, yuan } from './money';

test('分转元: 对象', () => {
  const fenObj = { data: { money: '101' }, total: 102 };
  const yuanObj = { data: { money: 1.01 }, total: 1.02 };
  expect(
    update(fenObj, {
      data: { money: yuan },
      total: yuan
    })
  ).toEqual(yuanObj);
});

test('分转元: 数组', () => {
  const fenObj = { data: [{ money: '101' }, { total: 102 }] };
  const yuanObj = { data: [{ money: 1.01 }, { total: 1.02 }] };
  expect(
    update(fenObj, {
      data: { $for: { money: yuan, total: yuan } }
    })
  ).toEqual(yuanObj);
});

test('元转分: 对象', () => {
  const yuanObj = { data: { money: '1.01' }, total: 1.02 };
  const fenObj = { data: { money: 101 }, total: 102 };
  expect(
    update(yuanObj, {
      data: { money: fen },
      total: fen
    })
  ).toEqual(fenObj);
});

test('元转分: 数组', () => {
  const fenObj = { data: [{ money: 101 }, { total: 102 }] };
  const yuanObj = { data: [{ money: '1.01' }, { total: 1.02 }] };
  expect(
    update(yuanObj, {
      data: { $for: { money: fen, total: fen } }
    })
  ).toEqual(fenObj);
});
