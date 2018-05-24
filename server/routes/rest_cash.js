const { Model } = require('mongorito');
const router = require('express').Router();
const { pick } = require('lodash/fp');
const moment = require('moment');

const mongodb = require('./mongodb');
const { resultErr, resultOk } = require('./result');
const mockjs = require('mockjs')

// class Cash extends Model {}
// mongodb.register(Cash);

module.exports = {
  router,
}

const { fundDetail } = mockjs.mock({'fundDetail|5': [{
  'id|+1': 1,
  username: '@cname',
  no: '@cname',
  'deal_category|1-3': 1,
  'deal_type|1-4': 1,
  'deal_money|11-110.1-2': 1,
  'balance|11-110.1-2': 1,
  memo: '有钱任性',
  start_time: moment().format('YYYY-MM-DD hh:mm:ss'),
  end_time: moment().format('YYYY-MM-DD hh:mm:ss'),
  created: moment().format('YYYY-MM-DD hh:mm:ss'),
  created_uname: '@cname',
  updated: moment().format('YYYY-MM-DD hh:mm:ss'),
  updated_uname: '@cname',
}]});

router.get('/fundDetail', async (req, res, next) => {
  res.json(resultOk(fundDetail));
});
router.put('/fundDetail/:id?', async (req, res, next) => {
  res.json(resultOk({}));
});
router.delete('/fundDetail/:id?', async (req, res, next) => {
  const n = fundDetail.findIndex(v => req.params.id === String(v.id));
  fundDetail.splice(n, 1);
  res.json(resultOk({}));
});

const { dealType } = mockjs.mock({'dealType|4': [{
    'id|+1': 1,
    'name|+1': ['买入', '卖出', '转入', '转出' ],
  }]});
const { dealCategory } = mockjs.mock({'dealCategory|3': [{
    'id|+1': 1,
    'name|+1': ['消费', '投资', '其他'],
  }]});
router.get('/dealType', async (req, res, next) => {
  res.json(resultOk(dealType));
});
router.get('/dealCategory', async (req, res, next) => {
  res.json(resultOk(dealCategory));
});