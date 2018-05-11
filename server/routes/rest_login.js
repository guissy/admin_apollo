const jwt = require('jsonwebtoken');
const { Model } = require('mongorito');
const router = require('express').Router();
const { pick } = require('lodash/fp');

const mongodb = require('./mongodb');
const { resultErr, resultOk } = require('./result');
const { secretOrPrivateKey } = require('./token');
const menu = require('./menu');

class Login extends Model {}
mongodb.register(Login);

Login.findOne().then(zlg => {
  if (!zlg) {
    const login = new Login({
      username: 'xiaoming',
      password: '123456',
      truename: 'xiaoming',
      job: '前端攻城狮',
      part: '技术部',
      id: 1
    });
    login.save();
  }
});

router.post('/login/one', async function login(req, res, next) {
  res.json(resultOk({
    uid: 1,
    fid: 1,
    sign: 1,
  }));
});
router.post('/login/two', async function login(req, res) {
  const loginDb = await Login.findOne(pick(['username','password'])(req.body));
  let result;
  if (!loginDb) {
    result = resultErr("账号或密码不对！");
  } else {
    const username = loginDb.get('username');
    const uid = loginDb.get('id');
    const action = username === 'zlg'
      ? ["delete", "update", "fetch", "insert", 'finish']
      : ["delete", "update", "fetch", "insert", 'finish'];
    req.app.set(username, true);
    const data = {
      token: jwt.sign({
        username: username,
        uid: uid,
      }, secretOrPrivateKey, {
        expiresIn: 60 * 60 * 1000
      }),
      state: 1,
      list: {
        "id": loginDb.get('id'),
        "username": username,
        "truename": loginDb.get('truename'),
        "nick": "anonymity",
        "email": "",
        "telephone": "",
        "mobile": "",
        "part": loginDb.get('part'),
        "job": loginDb.get('job'),
        "comment": "",
        "logintime": "2018-04-18 01:51:51",
        "role": "1"
      },
      "role": "master",
      "route": menu,
      expire: (Date.now() + 60 * 60 * 1000) / 1000
    }
    result = resultOk(data);
  }
  res.json(result);
});
router.post('/logout', async function logout(req,res) {
  let result = resultErr('Error');
  const loginDb = await Login.findOne(req.body);
  if (loginDb) {
    if (req.locals) {
      req.app.set(req.locals.__username, false);
    }
    const data = {}
    result = resultOk(data);
  }
  res.json(result);
});
router.post('/login/password', async function password(req,res) {
  let result = resultErr('Error');
  const loginDb = await Login.findOne({
    password: req.body.user.password,
    username: req.locals.__username
  });
  if (loginDb) {
    loginDb.set('password', req.body.user.password);
    loginDb.save();
    const data = {};
    result = resultOk(data);
  }
  res.json(result);
});

module.exports = {
  Login,
  router,
}
