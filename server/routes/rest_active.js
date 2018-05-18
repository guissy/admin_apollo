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
      memo: '@cname',
      mobile: '13500119988',
      process_time: moment().format('YYYY-MM-DD hh:mm:ss'),
      'state|1': ['pending', 'pass', 'rejected'],
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
router.patch('/active.withdraw/:id', async function save(req, res, next) {
  res.json(resultOk({}))
});
router.patch('/active.discount/:id', async function save(req, res, next) {
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
// 优惠类型
router.get('/active/types', async function save(req, res, next) {
    res.json(resultOk([
        { 'name': '充值', id: 1 },
        { 'name': '满减', id: 2 },
        { 'name': '幸运', id: 3 }
    ]));
});


const { activities } = mockjs.mock({'activities|20': [{
        'id|+1': 1,
        begin_time: moment().format('YYYY-MM-DD hh:mm:ss'),
        cover: `https://placeholdit.imgix.net/~text?txtsize=23&bg=a9160f&txtclr=ffffff&txt=@cname&w=360&h=60`,
        created: moment().format('YYYY-MM-DD hh:mm:ss'),
        created_uname: '@cname',
        description: '@city',
        end_time: moment().format('YYYY-MM-DD hh:mm:ss'),
        issue_mode: '1',
        language_id: '1',
        language_name: '中文',
        'name|1': ['充一百送一百', '充话费送老婆', '送上月球，送飞船', '买一送一', '活不见人'],
        rule: '充1000000才送',
        sort: '送100',
        state: '1',
        status: '',
        'title|1': ['充一百送一百', '充话费送老婆', '送上月球，送飞船', '买一送一', '活不见人'],
        'types|1-2': [{ 'name|1': ['充值','满减','幸运'] }],
        updated: moment().format('YYYY-MM-DD hh:mm:ss'),
        updated_uname: '@cname',
    }]});
// 列表
router.get('/activity/content', async function list(req, res, next) {
  res.json(resultOk(activities))
});
// 开始
router.patch('/active/manual/:id', async function save(req, res, next) {
  res.json(resultOk(activities[0]))
});
// 删除
router.delete('/active/manual/:id', async function save(req, res, next) {
  res.json(resultOk(activities[0]))
});
// 添加
router.put('/active/manual', async function save(req, res, next) {
  res.json(resultOk(activities[0]))
});
// 详情
router.get('/active/manual/:id', async function save(req, res, next) {
  res.json(resultOk(activities[0]))
});
// 修改
router.put('/active/manual/:id', async function save(req, res, next) {
  res.json(resultOk(activities[0]))
});

module.exports = {
  Active,
  router,
}
