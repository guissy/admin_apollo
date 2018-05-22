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