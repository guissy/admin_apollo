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

