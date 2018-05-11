const { Model } = require('mongorito');
const router = require('express').Router();
const { pick } = require('lodash/fp');
const moment = require('moment');

const mongodb = require('./mongodb');
const { resultErr, resultOk } = require('./result');
const mockjs = require('mockjs')

class Active extends Model {}
mongodb.register(Active);

const { applys } = mockjs.mock({'applys|20': [{
    'active_id|+1': 1,
    'active_name|1':  ['充100送100'],
    'active_title|1': ['充100送100'],
    'agent_id': 1,
    apply_time: moment().format('YYYY-MM-DD hh:mm:ss'),
    content: '某君的QQ状态很搞，上面浪漫的写着：“你五毛我五毛，那么咱俩就能凑一块了！”众人羡慕之时，另一女说到：“你六毛我六毛咱俩就能一块2了。”再另一女接到：“你七毛我七毛，咱俩就能一块死了……”',
    coupon_money: 1000,
    deposit_money: 1000,
    email: 'g@g.cn',
    'id|+1': 1,
    ip: '127.0.0.1',
    issue_mode: '1',
    level: '1',
    memo: '@cname',
    mobile: '13500119988',
    process_time: moment().format('YYYY-MM-DD hh:mm:ss'),
    state: 'pending',
    'status|1': ['pending', 'rejected', 'pass'],
    'type_id|0': [1],
    type_name: '充值',
    'user_id|+1': 1,
    user_name: '@cname',
    withdraw_require: '1',
  }]});
const { actives } = mockjs.mock({'actives|20': [{
    'id|+1': 1,
    'title|+1': ['充一百送一百','充话费送老婆', '送上月球，送飞船', '买一送一','活不见人'],
    'name': '哈哈',
  }]});
router.get('/copywriter/float', async function login(req, res, next) {
  const { data } = mockjs.mock({'data|20': [{
      'active_id|+1': 1,
      'active_name|1':  ['充100送100'],
      'active_title|1': ['充100送100'],
      'agent_id': 1,
      apply_time: moment().format('YYYY-MM-DD hh:mm:ss'),
      content: '某君的QQ状态很搞，上面浪漫的写着：“你五毛我五毛，那么咱俩就能凑一块了！”众人羡慕之时，另一女说到：“你六毛我六毛咱俩就能一块2了。”再另一女接到：“你七毛我七毛，咱俩就能一块死了……”',
      coupon_money: 1000,
      deposit_money: 1000,
      email: 'g@g.cn',
      'id|+1': 1,
      ip: '127.0.0.1',
      issue_mode: '1',
      level: '1',
      memo: '@cnname',
      mobile: '13500119988',
      process_time: moment().format('YYYY-MM-DD hh:mm:ss'),
      state: 'pending',
      status: '2',
      'type_id': [1],
      type_name: '充值',
      'user_id|+1': 1,
      user_name: 'cnname',
      withdraw_require: '1',
    }]})
  res.json(resultOk(data));
});
router.get('/active/applys', async function login(req, res, next) {
  res.json(resultOk(applys));
});
router.put('/active/apply.comment/:id', async function save(req, res, next) {
  res.json(resultOk({}))
});
router.get('/active/apply/:id', async function save(req, res, next) {
  res.json(resultOk(applys[0]))
});
router.patch('/active.withdraw.require/:id', async function save(req, res, next) {
  res.json(resultOk({}))
});
// 优惠活动标题
router.get('/actives', async function save(req, res, next) {
  res.json(resultOk(actives))
});
// 优惠活动标题
router.put('/active/apply/status', async function save(req, res, next) {
  res.json(resultOk(actives))
});

module.exports = {
  Active,
  router,
}
