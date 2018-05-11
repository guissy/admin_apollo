const { Model } = require('mongorito');
const router = require('express').Router();
const { pick } = require('lodash/fp');

const mongodb = require('./mongodb');
const { resultErr, resultOk } = require('./result');
const { secretOrPrivateKey } = require('./token');

class Message extends Model {}
mongodb.register(Message);


router.get('/num', async function login(req, res, next) {
  res.json(resultOk({
    // withdraw: ['1','2'],
    // offline_deposit: ['1','2','3'],
    // common: [1],
    withdraw: 3,
    offline_deposit: 2,
    common: 4,
  }));
});

module.exports = {
  Message,
  router,
}
