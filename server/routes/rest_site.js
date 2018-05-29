const { Model } = require('mongorito');
const router = require('express').Router();
const { pick } = require('lodash/fp');
const moment = require('moment');

const mongodb = require('./mongodb');
const { resultErr, resultOk } = require('./result');
const mockjs = require('mockjs')

class Site extends Model {}
mongodb.register(Site);

module.exports = {
  router,
}


const { adHome } = mockjs.mock({'adHome|20': [{
  'id|+1': 1,
  name: '@city',
  language: '@city',
  'approve_status|1': ["pending","pass", "rejected"],
  'status|1': ["enabled","disabled"],
  sort: '@integer(1, 100)',
  created: moment().format('YYYY-MM-DD hh:mm:ss'),
  created_uname: '@cname',
  updated: moment().format('YYYY-MM-DD hh:mm:ss'),
  updated_uname: '@cname',
}]});

router.get('/adHome', async (req, res, next) => {
  res.json(resultOk(adHome));
});
router.put('/adHome/:id?', async (req, res, next) => {
  res.json(resultOk({}));
});
router.delete('/adHome/:id?', async (req, res, next) => {
  const n = adHome.findIndex(v => req.params.id === String(v.id));
  adHome.splice(n, 1);
  res.json(resultOk({}));
});



const { adList } = mockjs.mock({'adList|20': [{
  'id|+1': 1,
  name: '@city',
  pf: '@integer(1, 3)',
  position: '@city',
  'picture|1': Array(5).fill(0).map(v => mockjs.Random.image("100x40", mockjs.Random.color(), mockjs.Random.word(5))),
  link: '@url',
  language: '@city',
  sort: '@integer(1, 100)',
  'approve|1': '@integer(1,3)',
  'status|1': ["enabled","disabled"],
  created: moment().format('YYYY-MM-DD hh:mm:ss'),
  created_uname: '@cname',
  updated: moment().format('YYYY-MM-DD hh:mm:ss'),
  updated_uname: '@cname',
}]});

router.get('/adList', async (req, res, next) => {
  res.json(resultOk(adList));
});
router.put('/adList/:id?', async (req, res, next) => {
  res.json(resultOk({}));
});
router.delete('/adList/:id?', async (req, res, next) => {
  const n = adList.findIndex(v => req.params.id === String(v.id));
  adList.splice(n, 1);
  res.json(resultOk({}));
});

const {adListPf} = mockjs.mock({
  'adListPf|3': [{
    'id|+1': 1,
    'name|+1': ['使用平台1', '使用平台2', '使用平台3'],
  }]
});
router.get('/adListPf', async (req, res, next) => {
  res.json(resultOk(adListPf));
});
const {adListApprove} = mockjs.mock({
  'adListApprove|3': [{
    'id|+1': 1,
    'name|+1': ['已通过', '待申请', '已拒绝', '申请中'],
  }]
});
router.get('/adListApprove', async (req, res, next) => {
  res.json(resultOk(adListApprove));
});


const { announceManage } = mockjs.mock({'announceManage|20': [{
  'id|+1': 1,
  send_type: '@integer(1, 3)',
  type: '@integer(1, 3)',
  title: '@city',
  'content|1': Array(20).fill(0).map(v=>'内容-' + mockjs.Random.cword('20')),
  popup_type: '@integer(1, 3)',
  recipient: '@first',
  admin_name: '@first',
  recipient_origin: '@first',
  language_id: '@city',
  start_time: '@datetime',
  end_time: '@datetime',
  'status|1': ["enabled","disabled"],
  created: moment().format('YYYY-MM-DD hh:mm:ss'),
  created_uname: '@cname',
  updated: moment().format('YYYY-MM-DD hh:mm:ss'),
  updated_uname: '@cname',
}]});

router.get('/announceManage', async (req, res, next) => {
  res.json(resultOk(announceManage));
});
router.put('/announceManage/:id?', async (req, res, next) => {
  res.json(resultOk({}));
});
router.delete('/announceManage/:id?', async (req, res, next) => {
  const n = announceManage.findIndex(v => req.params.id === String(v.id));
  announceManage.splice(n, 1);
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
const {announceManageType} = mockjs.mock({
  'announceManageType|3': [{
    'id|+1': 1,
    'name|+1': ['消息类型1', '消息类型2', '消息类型3'],
  }]
});
router.get('/announceManageType', async (req, res, next) => {
  res.json(resultOk(announceManageType));
});
const {popupType} = mockjs.mock({
  'popupType|3': [{
    'id|+1': 1,
    'name|+1': ['弹出类型1', '弹出类型2', '弹出类型3'],
  }]
});
router.get('/popupType', async (req, res, next) => {
  res.json(resultOk(popupType));
});


const { depositNote } = mockjs.mock({'depositNote|20': [{
  'id|+1': 1,
  name: '@city',
  language: '@city',
  'approve_status|1': ["enabled","disabled"],
  'status|1': ["enabled","disabled"],
  content: '@city',
  apply_to: '@integer(1, 3)',
  created: '@datetime',
  created: moment().format('YYYY-MM-DD hh:mm:ss'),
  created_uname: '@cname',
  updated: moment().format('YYYY-MM-DD hh:mm:ss'),
  updated_uname: '@cname',
}]});

router.get('/depositNote', async (req, res, next) => {
  res.json(resultOk(depositNote));
});
router.put('/depositNote/:id?', async (req, res, next) => {
  res.json(resultOk({}));
});
router.delete('/depositNote/:id?', async (req, res, next) => {
  const n = depositNote.findIndex(v => req.params.id === String(v.id));
  depositNote.splice(n, 1);
  res.json(resultOk({}));
});

const {approveStatus} = mockjs.mock({
  'approveStatus|3': [{
    'id|+1': 1,
    'name|+1': ['审核状态1', '审核状态2', '审核状态3'],
  }]
});
router.get('/approveStatus', async (req, res, next) => {
  res.json(resultOk(approveStatus));
});
const {applyTo} = mockjs.mock({
  'applyTo|3': [{
    'id|+1': 1,
    'name|+1': ['使用于1', '使用于2', '使用于3'],
  }]
});
router.get('/applyTo', async (req, res, next) => {
  res.json(resultOk(applyTo));
});


const { floatAd } = mockjs.mock({'floatAd|20': [{
  'id|+1': 1,
  name: '@city',
  link: '@url',
  language: '@city',
  'picture|1': ["http://dummyimage.com/100x40/f279e2&text=gywch","http://dummyimage.com/100x40/79f2de&text=ggygu","http://dummyimage.com/100x40/f2bb79&text=onnfc","http://dummyimage.com/100x40/9879f2&text=gugri","http://dummyimage.com/100x40/7df279&text=lhbkx","http://dummyimage.com/100x40/f279a0&text=gkqmz","http://dummyimage.com/100x40/79c4f2&text=sqaun","http://dummyimage.com/100x40/e7f279&text=pzrmq","http://dummyimage.com/100x40/d979f2&text=xklfj","http://dummyimage.com/100x40/79f2b6&text=symaa","http://dummyimage.com/100x40/f29279&text=btcer","http://dummyimage.com/100x40/7982f2&text=gxzac","http://dummyimage.com/100x40/a5f279&text=vdxtf","http://dummyimage.com/100x40/f279c9&text=tkuld","http://dummyimage.com/100x40/79ecf2&text=wldmj","http://dummyimage.com/100x40/f2d479&text=whlju","http://dummyimage.com/100x40/b179f2&text=aptit","http://dummyimage.com/100x40/79f28d&text=idbgl","http://dummyimage.com/100x40/f27987&text=iwyzc","http://dummyimage.com/100x40/79abf2&text=inlvm"],
  position: '@integer(1, 3)',
  pf: '@integer(1, 3)',
  'approve|1': ["enabled","disabled"],
  sort: '@integer(1, 100)',
  created: moment().format('YYYY-MM-DD hh:mm:ss'),
  created_uname: '@cname',
  updated: moment().format('YYYY-MM-DD hh:mm:ss'),
  updated_uname: '@cname',
}]});

router.get('/floatAd', async (req, res, next) => {
  res.json(resultOk(floatAd));
});
router.put('/floatAd/:id?', async (req, res, next) => {
  res.json(resultOk({}));
});
router.delete('/floatAd/:id?', async (req, res, next) => {
  const n = floatAd.findIndex(v => req.params.id === String(v.id));
  floatAd.splice(n, 1);
  res.json(resultOk({}));
});

const {floatAdPosition} = mockjs.mock({
  'floatAdPosition|3': [{
    'id|+1': 1,
    'name|+1': ['显示位置1', '显示位置2', '显示位置3'],
  }]
});
router.get('/floatAdPosition', async (req, res, next) => {
  res.json(resultOk(floatAdPosition));
});
const {floatAdPf} = mockjs.mock({
  'floatAdPf|3': [{
    'id|+1': 1,
    'name|+1': ['平台1', '平台2', '平台3'],
  }]
});
router.get('/floatAdPf', async (req, res, next) => {
  res.json(resultOk(floatAdPf));
});
const {floatAdApprove} = mockjs.mock({
  'floatAdApprove|3': [{
    'id|+1': 1,
    'name|+1': ['审核状态1', '审核状态2', '审核状态3'],
  }]
});
router.get('/floatAdApprove', async (req, res, next) => {
  res.json(resultOk(floatAdApprove));
});

