const {Model} = require('mongorito');
const router = require('express').Router();
const {pick} = require('lodash/fp');
const moment = require('moment');

const mongodb = require('./mongodb');
const {resultErr, resultOk} = require('./result');
const mockjs = require('mockjs')

class System extends Model {
}

mongodb.register(System);

module.exports = {
  router,
}

const {cmsLog} = mockjs.mock({
  'cmsLog|20': [{
    'id|+1': 1,
    user_name: '@cname',
    ip: '@ip',
    module: '@city',
    op_type: '@integer(1, 6)',
    result: '@integer(1, 3)',
    remark: '@cword(5)',
    created: moment().format('YYYY-MM-DD hh:mm:ss'),
    created_uname: '@cname',
    updated: moment().format('YYYY-MM-DD hh:mm:ss'),
    updated_uname: '@cname',
  }]
});

router.get('/cmsLog', async (req, res, next) => {
  res.json(resultOk(cmsLog));
});

const {opType} = mockjs.mock({
  'opType|3': [{
    'id|+1': 1,
    'name|+1': ['新增', '删除', '修改', '审核', '登录', '登出'],
  }]
});
router.get('/opType', async (req, res, next) => {
  res.json(resultOk(opType));
});
const {cmsLogResult} = mockjs.mock({
  'cmsLogResult|3': [{
    'id|+1': 1,
    'name|+1': ['成功', '失败'],
  }]
});
router.get('/cmsLogResult', async (req, res, next) => {
  res.json(resultOk(cmsLogResult));
});


const {currencySetting} = mockjs.mock({
  'currencySetting|5': [{
    'id|+1': 1,
    cytype: '@city',
    ctype: '@city',
    'status|1': ["enabled", "disabled"],
    created: moment().format('YYYY-MM-DD hh:mm:ss'),
    created_uname: '@cname',
    updated: moment().format('YYYY-MM-DD hh:mm:ss'),
    updated_uname: '@cname',
  }]
});

router.get('/currencySetting', async (req, res, next) => {
  res.json(resultOk(currencySetting));
});
router.put('/currencySetting/:id?', async (req, res, next) => {
  res.json(resultOk({}));
});
router.delete('/currencySetting/:id?', async (req, res, next) => {
  const n = currencySetting.findIndex(v => req.params.id === String(v.id));
  currencySetting.splice(n, 1);
  res.json(resultOk({}));
});


const {memberLog} = mockjs.mock({
  'memberLog|5': [{
    'id|+1': 1,
    id: '@city',
    name: '@cname',
    domain: '@url',
    log_type: '@city',
    'status|1': ["enabled", "disabled"],
    log_ip: '@ip',
    log_value: '@city',
    created: moment().format('YYYY-MM-DD hh:mm:ss'),
    created_uname: '@cname',
    updated: moment().format('YYYY-MM-DD hh:mm:ss'),
    updated_uname: '@cname',
  }]
});

router.get('/memberLog', async (req, res, next) => {
  res.json(resultOk(memberLog));
});
router.put('/memberLog/:id?', async (req, res, next) => {
  res.json(resultOk({}));
});
router.delete('/memberLog/:id?', async (req, res, next) => {
  const n = memberLog.findIndex(v => req.params.id === String(v.id));
  memberLog.splice(n, 1);
  res.json(resultOk({}));
});


const {gameAccount} = mockjs.mock({
  'gameAccount|5': [{
    'id|+1': 1,
    partner_name: '@city',
    admin_url: '@url',
    admin_account: '@first',
    admin_password: '@city',
    created: moment().format('YYYY-MM-DD hh:mm:ss'),
    created_uname: '@cname',
    updated: moment().format('YYYY-MM-DD hh:mm:ss'),
    updated_uname: '@cname',
  }]
});

router.get('/gameAccount', async (req, res, next) => {
  res.json(resultOk(gameAccount));
});
router.put('/gameAccount/:id?', async (req, res, next) => {
  res.json(resultOk({}));
});
router.delete('/gameAccount/:id?', async (req, res, next) => {
  const n = gameAccount.findIndex(v => req.params.id === String(v.id));
  gameAccount.splice(n, 1);
  res.json(resultOk({}));
});


const {emailManage} = mockjs.mock({
  'emailManage|5': [{
    'id|+1': 1,
    title: '@city',
    'send_type|1-3': 1,
    'status|1': ["enabled", "disabled"],
    hyper_text: '@city',
    content: '@city',
    created: moment().format('YYYY-MM-DD hh:mm:ss'),
    created_uname: '@cname',
    updated: moment().format('YYYY-MM-DD hh:mm:ss'),
    updated_uname: '@cname',
  }]
});

router.get('/emailManage', async (req, res, next) => {
  res.json(resultOk(emailManage));
});
router.put('/emailManage/:id?', async (req, res, next) => {
  res.json(resultOk({}));
});
router.delete('/emailManage/:id?', async (req, res, next) => {
  const n = emailManage.findIndex(v => req.params.id === String(v.id));
  emailManage.splice(n, 1);
  res.json(resultOk({}));
});

const {sendType} = mockjs.mock({
  'sendType|3': [{
    'id|+1': 1,
    'name|+1': ['发送类型1', '发送类型2', '发送类型3'],
  }]
});
router.get('/sendType', async (req, res, next) => {
  res.json(resultOk(sendType));
});


const {domainSetting} = mockjs.mock({
  'domainSetting|5': [{
    'id|+1': 1,
    name: '@city',
    title: '@city',
    bottom: '@city',
    is_ssl: '@city',
    'logo|1': ["http://dummyimage.com/100x40/79d4f2&text=leifl", "http://dummyimage.com/100x40/f2ed79&text=clikj", "http://dummyimage.com/100x40/c979f2&text=ynkoa", "http://dummyimage.com/100x40/79f2a6&text=vylvo", "http://dummyimage.com/100x40/f28379&text=qvwna", "http://dummyimage.com/100x40/7992f2&text=xkpsd", "http://dummyimage.com/100x40/b5f279&text=ozpwf", "http://dummyimage.com/100x40/f279d9&text=slqyg", "http://dummyimage.com/100x40/79f2e7&text=pnctb", "http://dummyimage.com/100x40/f2c479&text=iebbo", "http://dummyimage.com/100x40/a179f2&text=iwxfv", "http://dummyimage.com/100x40/79f27d&text=ehbxb", "http://dummyimage.com/100x40/f27997&text=inswt", "http://dummyimage.com/100x40/79bbf2&text=bdabk", "http://dummyimage.com/100x40/def279&text=sskmi", "http://dummyimage.com/100x40/e279f2&text=loeru", "http://dummyimage.com/100x40/79f2bf&text=vwkln", "http://dummyimage.com/100x40/f29c79&text=jpteg", "http://dummyimage.com/100x40/7979f2&text=kgdvw", "http://dummyimage.com/100x40/9cf279&text=agope"],
    content: '@city',
    created: moment().format('YYYY-MM-DD hh:mm:ss'),
    created_uname: '@cname',
    updated: moment().format('YYYY-MM-DD hh:mm:ss'),
    updated_uname: '@cname',
  }]
});

router.get('/domainSetting', async (req, res, next) => {
  res.json(resultOk(domainSetting[0]));
});
router.put('/domainSetting/:id?', async (req, res, next) => {
  res.json(resultOk({}));
});
router.delete('/domainSetting/:id?', async (req, res, next) => {
  const n = domainSetting.findIndex(v => req.params.id === String(v.id));
  domainSetting.splice(n, 1);
  res.json(resultOk({}));
});

function buildDirFile() {
  return mockjs.mock({
    'dir|5': [{
      'id|+1': 1,
      name: '@word(3,5)',
      'dirtype|1': ['sys','usr'],
      folder: '@word(3,5)',
      size: 'integer(100, 1990)',
      created: moment().format('YYYY-MM-DD hh:mm:ss'),
      created_uname: '@cname',
      updated: moment().format('YYYY-MM-DD hh:mm:ss'),
      updated_uname: '@cname',
    }],
    'file|10': [{
      'id|+1': 10,
      name: '@word(3,5)',
      size: '@integer(100, 1990)',
      'url|1': ["http://dummyimage.com/100x40/79d4f2&text=leifl", "http://dummyimage.com/100x40/f2ed79&text=clikj", "http://dummyimage.com/100x40/c979f2&text=ynkoa", "http://dummyimage.com/100x40/79f2a6&text=vylvo", "http://dummyimage.com/100x40/f28379&text=qvwna", "http://dummyimage.com/100x40/7992f2&text=xkpsd", "http://dummyimage.com/100x40/b5f279&text=ozpwf", "http://dummyimage.com/100x40/f279d9&text=slqyg", "http://dummyimage.com/100x40/79f2e7&text=pnctb", "http://dummyimage.com/100x40/f2c479&text=iebbo", "http://dummyimage.com/100x40/a179f2&text=iwxfv", "http://dummyimage.com/100x40/79f27d&text=ehbxb", "http://dummyimage.com/100x40/f27997&text=inswt", "http://dummyimage.com/100x40/79bbf2&text=bdabk", "http://dummyimage.com/100x40/def279&text=sskmi", "http://dummyimage.com/100x40/e279f2&text=loeru", "http://dummyimage.com/100x40/79f2bf&text=vwkln", "http://dummyimage.com/100x40/f29c79&text=jpteg", "http://dummyimage.com/100x40/7979f2&text=kgdvw", "http://dummyimage.com/100x40/9cf279&text=agope"],
      created: moment().format('YYYY-MM-DD hh:mm:ss'),
      created_uname: '@cname',
      updated: moment().format('YYYY-MM-DD hh:mm:ss'),
      updated_uname: '@cname',
    }]
  })
}

let {dir, file} = buildDirFile();
let folder;
router.get('/resourceFiles/:folder?', async (req, res, next) => {
  if (folder !== req.params.folder) {
    ({ dir, file } = buildDirFile());
  }
  res.json(resultOk({
    countdir: dir.length,
    countfile: file.length,
    dir,
    file
  }));
  folder = req.params.folder;
});

router.delete('/resourceFiles/:id?', async (req, res, next) => {
  const n1 = file.findIndex(v => req.params.id === String(v.id));
  if (n1>=0) file.splice(n1, 1);
  const n2 = dir.findIndex(v => req.params.id === String(v.id));
  if (n2>=0) dir.splice(n2, 1);
  res.json(resultOk({}));
});
router.patch('/resourceFiles/:id?/:name?', async (req, res, next) => {
  res.json(resultOk({}));
});