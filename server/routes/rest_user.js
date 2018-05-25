const { Model } = require('mongorito');
const router = require('express').Router();
const { pick } = require('lodash/fp');
const moment = require('moment');

const mongodb = require('./mongodb');
const { resultErr, resultOk } = require('./result');
const mockjs = require('mockjs')

class User extends Model {}
mongodb.register(User);

module.exports = {
  router,
}

const { levels } = mockjs.mock({'levels|5': [{
    'id|+1': 1,
    'name|+1': ['vip1', 'vip2', 'vip3', 'vip4', 'vip5']
  }]});
router.get('/user/levels', async (req, res, next) => {
  res.json(resultOk(levels));
});


const { ipBlacklist } = mockjs.mock({'ipBlacklist|5': [{
    'id|+1': 1,
    'ip': '@integer(100, 255).@integer(100, 255).@integer(100, 255).@integer(100, 255)',
    'status|1': ['enabled', 'disabled'],
    'memo|+1': ['哈哈', '呵呵'],
    created: moment().format('YYYY-MM-DD hh:mm:ss'),
    created_uname: '@cname',
    updated: moment().format('YYYY-MM-DD hh:mm:ss'),
    updated_uname: '@cname',
  }]});
router.get('/ipBlacklist', async (req, res, next) => {
  res.json(resultOk(ipBlacklist));
});
router.put('/ipBlacklist/:id?', async (req, res, next) => {
  res.json(resultOk(ipBlacklist));
});


const { otherMember } = mockjs.mock({'otherMember|5': [{
    'id|+1': 1,
    uname: '@cname',
    name: '@cname',
    game_username: '@cname',
    created: moment().format('YYYY-MM-DD hh:mm:ss'),
    created_uname: '@cname',
    updated: moment().format('YYYY-MM-DD hh:mm:ss'),
    updated_uname: '@cname',
  }]});

router.get('/otherMember', async (req, res, next) => {
  res.json(resultOk(otherMember));
});
router.put('/otherMember/:id?', async (req, res, next) => {
  res.json(resultOk({}));
});
router.delete('/otherMember/:id?', async (req, res, next) => {
  const n = otherMember.findIndex(v => req.params.id === String(v.id));
  otherMember.splice(n, 1);
  res.json(resultOk({}));
});

const {thirdGame} = mockjs.mock({
  'thirdGame|3': [{
    'id|+1': 1,
    'name|+1': ['第三方游戏1', '第三方游戏2', '第三方游戏3'],
  }]
});
router.get('/thirdGame', async (req, res, next) => {
  res.json(resultOk(thirdGame));
});

const { memberLabel } = mockjs.mock({'memberLabel|5': [{
  'id|+1': 1,
  title: '@cname',
  'content|+1': Array(5).fill(0).map((v,i) => `vip${i + 1}`),
  admin_name: '@cname',
  inserted: moment().format('YYYY-MM-DD hh:mm:ss'),
  created: moment().format('YYYY-MM-DD hh:mm:ss'),
  created_uname: '@cname',
  updated: moment().format('YYYY-MM-DD hh:mm:ss'),
  updated_uname: '@cname',
}]});

router.get('/memberLabel', async (req, res, next) => {
  res.json(resultOk(memberLabel));
});
router.put('/memberLabel/:id?', async (req, res, next) => {
  res.json(resultOk({}));
});
router.delete('/memberLabel/:id?', async (req, res, next) => {
  const n = memberLabel.findIndex(v => req.params.id === String(v.id));
  memberLabel.splice(n, 1);
  res.json(resultOk({}));
});


const { idleAccount } = mockjs.mock({'idleAccount|5': [{
  'id|+1': 1,
  name: '@cname',
  agent: '@cname',
  'total|1-100': 1,
  last_login: moment().format('YYYY-MM-DD hh:mm:ss'),
  'balance|1-100.1-2': 1,
  created: moment().format('YYYY-MM-DD hh:mm:ss'),
  created_uname: '@cname',
  updated: moment().format('YYYY-MM-DD hh:mm:ss'),
  updated_uname: '@cname',
}]});

router.get('/idleAccount', async (req, res, next) => {
  res.json(resultOk(idleAccount));
});
router.put('/idleAccount/:id?', async (req, res, next) => {
  res.json(resultOk({}));
});
router.delete('/idleAccount/:id?', async (req, res, next) => {
  const n = idleAccount.findIndex(v => req.params.id === String(v.id));
  idleAccount.splice(n, 1);
  res.json(resultOk({}));
});


