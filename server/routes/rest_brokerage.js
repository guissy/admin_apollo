const { Model } = require('mongorito');
const router = require('express').Router();
const { pick } = require('lodash/fp');
const moment = require('moment');

const mongodb = require('./mongodb');
const { resultErr, resultOk } = require('./result');
const mockjs = require('mockjs')

// class Brokerage extends Model {}
// mongodb.register(Brokerage);

module.exports = {
  router,
}

const { agentLink } = mockjs.mock({'agentLink|5': [{
  'id|+1': 1,
  domain: '@cname',
  comment: '@cname',
  status: '@cname',
  created: moment().format('YYYY-MM-DD hh:mm:ss'),
  created_uname: '@cname',
  updated: moment().format('YYYY-MM-DD hh:mm:ss'),
  updated_uname: '@cname',
}]});

router.get('/agentLink', async (req, res, next) => {
  res.json(resultOk(agentLink));
});
router.put('/agentLink/:id?', async (req, res, next) => {
  res.json(resultOk({}));
});
router.delete('/agentLink/:id?', async (req, res, next) => {
  const n = agentLink.findIndex(v => req.params.id === String(v.id));
  agentLink.splice(n, 1);
  res.json(resultOk({}));
});

const { subAgentRebate } = mockjs.mock({'subAgentRebate|5': [{
  'id|+1': 1,
  period_name: '201801',
  uname: '@cname',
  settings: '',
  'total|1-199': 1,
  'status|1': ['enabled', 'disabled'],
  account: '@cname',
  'level|1-5': 1,
  created: moment().format('YYYY-MM-DD hh:mm:ss'),
  created_uname: '@cname',
  updated: moment().format('YYYY-MM-DD hh:mm:ss'),
  updated_uname: '@cname',
}]});

router.get('/subAgentRebate', async (req, res, next) => {
  res.json(resultOk(subAgentRebate));
});
router.put('/subAgentRebate/:id?', async (req, res, next) => {
  res.json(resultOk({}));
});
router.delete('/subAgentRebate/:id?', async (req, res, next) => {
  const n = subAgentRebate.findIndex(v => req.params.id === String(v.id));
  subAgentRebate.splice(n, 1);
  res.json(resultOk({}));
});

const { subAgentRebateDetail } = mockjs.mock({'subAgentRebateDetail|5': [{
    'id|+1': 1,
    username: '@cname',
    'bkge_amount|1-100': 1,
    'rate|1-100.1-2': 1,
    'commission|100-200.1-2': 1,
    created: moment().format('YYYY-MM-DD hh:mm:ss'),
    created_uname: '@cname',
    updated: moment().format('YYYY-MM-DD hh:mm:ss'),
    updated_uname: '@cname',
  }]});

router.get('/subAgentRebateDetail', async (req, res, next) => {
  res.json(resultOk(subAgentRebateDetail));
});

