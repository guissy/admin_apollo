const jwt = require('jsonwebtoken');
const { Model } = require('mongorito');
const router = require('express').Router();
const { pick } = require('lodash/fp');

const mongodb = require('./mongodb');
const { resultErr, resultOk } = require('./result');
const { secretOrPrivateKey } = require('./token');
const { random } = require('lodash/fp')

class Message extends Model {}
mongodb.register(Message);


router.get('/stat/today', async function login(req, res, next) {
  res.json(resultOk({
    active_members: random(1, 9999),
    new_members: random(1, 9999),
    online_members: random(1, 9999),
    deposit_money: random(1, 9999),
    best_times: random(1, 9999),
    best_money: random(1, 9999),
  }));
});
router.get('/stat/channel/7', async function login(req, res, next) {
  res.json(resultOk({}));
});

module.exports = {
  Message,
  router,
}
