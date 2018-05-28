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



const { agentAudit } = mockjs.mock({'agentAudit|5': [{
  'id|+1': 1,
  name: '@cname',
  mobile: '@zip@zip',
  email: '@email',
  truename: '@cname',
  'channel|1-4': 1,
  ip: '@ip',
  admin_user: '@cname',
  'status|1': ['enabled','disabled'],
  created: moment().format('YYYY-MM-DD hh:mm:ss'),
  created_uname: '@cname',
  updated: moment().format('YYYY-MM-DD hh:mm:ss'),
  updated_uname: '@cname',
}]});

router.get('/agentAudit', async (req, res, next) => {
  res.json(resultOk(agentAudit));
});
router.put('/agentAudit/:id?', async (req, res, next) => {
  res.json(resultOk({}));
});
router.delete('/agentAudit/:id?', async (req, res, next) => {
  const n = agentAudit.findIndex(v => req.params.id === String(v.id));
  agentAudit.splice(n, 1);
  res.json(resultOk({}));
});

const {agentAuditStatus} = mockjs.mock({
  'agentAuditStatus|3': [{
    'id|+1': 1,
    'name|+1': ['审核状态1', '审核状态2', '审核状态3'],
  }]
});
router.get('/agentAuditStatus', async (req, res, next) => {
  res.json(resultOk(agentAuditStatus));
});

const { memberHierarchy } = mockjs.mock({'memberHierarchy|5': [{
  'id|+1': 1,
  name: '@city',
  memo: '描述-@cword(2, 5)',
  'register_stime': '@datetime',
  'register_etime': '@datetime',
  'deposit_stime': '@datetime',
  'deposit_etime': '@datetime',
  deposit_min: '@float(100, 999, 1, 2)',
  deposit_max: '@float(100, 999, 1, 2)',
  deposit_times: '@integer(1, 100)',
  deposit_money: '@float(100, 999, 1, 2)',
  max_deposit_money: '@float(100, 999, 1, 2)',
  withdraw_times: '@integer(1, 100)',
  withdraw_count: '@integer(1, 100)',
  num: '@integer(1, 100)',
  comment: '备注-@cword(2, 5)',
  created: moment().format('YYYY-MM-DD hh:mm:ss'),
  created_uname: '@cname',
  updated: moment().format('YYYY-MM-DD hh:mm:ss'),
  updated_uname: '@cname',
}]});

router.get('/memberHierarchy', async (req, res, next) => {
  res.json(resultOk(memberHierarchy));
});
router.put('/memberHierarchy/:id?', async (req, res, next) => {
  res.json(resultOk({}));
});
router.delete('/memberHierarchy/:id?', async (req, res, next) => {
  const n = memberHierarchy.findIndex(v => req.params.id === String(v.id));
  memberHierarchy.splice(n, 1);
  res.json(resultOk({}));
});

const { memberQuery } = mockjs.mock({'memberQuery|5': [{
  'id|+1': 1,
  name: '@cname',
  agnet: '@city',
  created: '@datetime',
  last_login: '@datetime',
  deposit_total: '@integer(1, 100)',
  deposit_money: '@float(100, 999, 1, 2)',
  deposit_max: '@float(100, 999, 1, 2)',
  withdraw_total: '@integer(1, 100)',
  withdraw_money: '@integer(1, 100)',
  layered: '@integer(1, 3)',
  lock: '@integer(1, 3)',
  created: moment().format('YYYY-MM-DD hh:mm:ss'),
  created_uname: '@cname',
  updated: moment().format('YYYY-MM-DD hh:mm:ss'),
  updated_uname: '@cname',
}]});

router.get('/memberQuery', async (req, res, next) => {
  res.json(resultOk(memberQuery));
});
router.put('/memberQuery/:id?', async (req, res, next) => {
  res.json(resultOk({}));
});
router.delete('/memberQuery/:id?', async (req, res, next) => {
  const n = memberQuery.findIndex(v => req.params.id === String(v.id));
  memberQuery.splice(n, 1);
  res.json(resultOk({}));
});

const {memberQueryLayered} = mockjs.mock({
  'memberQueryLayered|3': [{
    'id|+1': 1,
    'name|+1': ['分层1', '分层2', '分层3'],
  }]
});
router.get('/memberQueryLayered', async (req, res, next) => {
  res.json(resultOk(memberQueryLayered));
});
const {memberQueryLock} = mockjs.mock({
  'memberQueryLock|3': [{
    'id|+1': 1,
    'name|+1': ['锁定1', '锁定2', '锁定3'],
  }]
});
router.get('/memberQueryLock', async (req, res, next) => {
  res.json(resultOk(memberQueryLock));
});


const { agentAccount } = mockjs.mock({'agentAccount|5': [{
  'id|+1': 1,
  name: '@first',
  truename: '@cname',
  type: '@integer(1, 3)',
  pname: '@city',
  level: '@city',
  inferisors_num: '@integer(1, 100)',
  play_num: '@integer(1, 100)',
  balance: '@float(100, 999, 1, 2)',
  code: '@city',
  channel: '@integer(1, 2)',
  'online': '@integer(1, 3)',
  status: '@integer(0, 2)',
  created: moment().format('YYYY-MM-DD hh:mm:ss'),
  created_uname: '@cname',
  updated: moment().format('YYYY-MM-DD hh:mm:ss'),
  updated_uname: '@cname',
}]});

router.get('/agentAccount', async (req, res, next) => {
  res.json(resultOk(agentAccount));
});
router.put('/agentAccount/:id?', async (req, res, next) => {
  res.json(resultOk({}));
});
router.delete('/agentAccount/:id?', async (req, res, next) => {
  const n = agentAccount.findIndex(v => req.params.id === String(v.id));
  agentAccount.splice(n, 1);
  res.json(resultOk({}));
});

const {agentAccountType} = mockjs.mock({
  'agentAccountType|3': [{
    'id|+1': 1,
    'name|+1': ['层级代理', '直属代理'],
  }]
});
router.get('/agentAccountType', async (req, res, next) => {
  res.json(resultOk(agentAccountType));
});
const {agentAccountChannel} = mockjs.mock({
  'agentAccountChannel|3': [{
    'id|+1': 1,
    'name|+1': ['H5注册', 'PC注册', '厅主后台创建', '代理后台创建'],
  }]
});
router.get('/agentAccountChannel', async (req, res, next) => {
  res.json(resultOk(agentAccountChannel));
});
const {agentAccountOnline} = mockjs.mock({
  'agentAccountOnline|3': [{
    'id|+1': 1,
    'name|+1': ['在线', '离线'],
  }]
});
router.get('/agentAccountOnline', async (req, res, next) => {
  res.json(resultOk(agentAccountOnline));
});
const {agentAccountStatus} = mockjs.mock({
  'agentAccountStatus|3': [{
    'id|+1': 1,
    'name|+1': ['账号状态1', '账号状态2', '账号状态3'],
  }]
});
router.get('/agentAccountStatus', async (req, res, next) => {
  res.json(resultOk(agentAccountStatus));
});


const { agentInfo } = mockjs.mock({'agentInfo|2': [{
  'id|+1': 1,
  name: '@first',
  id: '@city',
  play_num: '@integer(1, 100)',
  truename: '@cname',
  inferisors_num: '@integer(1, 100)',
  up_agent_name: '@city',
  pwd1_login: '@city',
  pwd_money: '@float(100, 999, 1, 2)',
  type: '@cname',
  level: '@city',
  created: '@datetime',
  last_login: '@datetime',
  register_ip: '@ip',
  login_ip: '@ip',
  channel: '@city',
  mobile: '13567@zip',
  email: '@email',
  qq: '@city',
  skype: '@city',
  weixin: '@city',
  gender: '@city',
  brith: '@city',
  country: '@city',
  language_name: '@city',
  province: '@city',
  ctype: '@city',
  memo: '备注-@cword(2, 5)',
  created: moment().format('YYYY-MM-DD hh:mm:ss'),
  created_uname: '@cname',
  updated: moment().format('YYYY-MM-DD hh:mm:ss'),
  updated_uname: '@cname',
}]});

router.get('/agentInfo/:id', async (req, res, next) => {
  res.json(resultOk(agentInfo[0]));
});
router.put('/agentInfo/:id?', async (req, res, next) => {
  res.json(resultOk({}));
});
router.delete('/agentInfo/:id?', async (req, res, next) => {
  const n = agentInfo.findIndex(v => req.params.id === String(v.id));
  agentInfo.splice(n, 1);
  res.json(resultOk({}));
});



const { promotion } = mockjs.mock({'promotion|2': [{
  'id|+1': 1,
  code: '@zip',
  site: '@domain',
  link: '@url',
  created: moment().format('YYYY-MM-DD hh:mm:ss'),
  created_uname: '@cname',
  updated: moment().format('YYYY-MM-DD hh:mm:ss'),
  updated_uname: '@cname',
}]});

router.get('/promotion/:id', async (req, res, next) => {
  res.json(resultOk(promotion[0]));
});
router.put('/promotion/:id?', async (req, res, next) => {
  res.json(resultOk({}));
});
router.delete('/promotion/:id?', async (req, res, next) => {
  const n = promotion.findIndex(v => req.params.id === String(v.id));
  promotion.splice(n, 1);
  res.json(resultOk({}));
});



const { memberManage } = mockjs.mock({'memberManage|20': [{
  'id|+1': 1,
  username: '@first',
  truename: '@cname',
  agent: '@city',
  amount: '@float(100, 999, 1, 2)',
  ip: '@ip',
  channel: '@integer(1, 3)',
  tags: '@integer(1, 3)',
  online: '@integer(1, 2)',
  state: '@first',
  created: moment().format('YYYY-MM-DD hh:mm:ss'),
  created_uname: '@cname',
  updated: moment().format('YYYY-MM-DD hh:mm:ss'),
  updated_uname: '@cname',
}]});

router.get('/memberManage', async (req, res, next) => {
  res.json(resultOk(memberManage));
});
router.put('/memberManage/:id?', async (req, res, next) => {
  res.json(resultOk({}));
});
router.delete('/memberManage/:id?', async (req, res, next) => {
  const n = memberManage.findIndex(v => req.params.id === String(v.id));
  memberManage.splice(n, 1);
  res.json(resultOk({}));
});

const {memberManageChannel} = mockjs.mock({
  'memberManageChannel|3': [{
    'id|+1': 1,
    'name|+1': ['注册来源1', '注册来源2', '注册来源3'],
  }]
});
router.get('/memberManageChannel', async (req, res, next) => {
  res.json(resultOk(memberManageChannel));
});
const {memberManageTags} = mockjs.mock({
  'memberManageTags|3': [{
    'id|+1': 1,
    'name|+1': ['标签1', '标签2', '标签3'],
  }]
});
router.get('/memberManageTags', async (req, res, next) => {
  res.json(resultOk(memberManageTags));
});
const {memberManageOnline} = mockjs.mock({
  'memberManageOnline|3': [{
    'id|+1': 1,
    'name|+1': ['在线', '离线'],
  }]
});
router.get('/memberManageOnline', async (req, res, next) => {
  res.json(resultOk(memberManageOnline));
});
const {memberManageState} = mockjs.mock({
  'memberManageState|3': [{
    'id|+1': 1,
    'name|+1': ['账号状态1', '账号状态2', '账号状态3'],
  }]
});
router.get('/memberManageState', async (req, res, next) => {
  res.json(resultOk(memberManageState));
});



const { memberAudit } = mockjs.mock({'memberAudit|5': [{
  'id|+1': 1,
  money: '@float(100, 999, 1, 2)',
  coupon_money: '@float(100, 999, 1, 2)',
  valid_bet: '@float(100, 999, 1, 2)',
  withdraw_bet_principal: '@city',
  withdraw_bet_coupon: '@city',
  is_pass: '@float(100, 999, 1, 2)',
  deduct_coupon: '@city',
  deduct_admin_fee: '@float(100, 999, 1, 2)',
  created: moment().format('YYYY-MM-DD hh:mm:ss'),
  created_uname: '@cname',
  updated: moment().format('YYYY-MM-DD hh:mm:ss'),
  updated_uname: '@cname',
}]});

router.get('/memberAudit', async (req, res, next) => {
  res.json(resultOk(memberAudit));
});
router.put('/memberAudit/:id?', async (req, res, next) => {
  res.json(resultOk({}));
});
router.delete('/memberAudit/:id?', async (req, res, next) => {
  const n = memberAudit.findIndex(v => req.params.id === String(v.id));
  memberAudit.splice(n, 1);
  res.json(resultOk({}));
});



const { accountBalance } = mockjs.mock({'accountBalance|5': [{
  'id|+1': 1,
  currency_name: '美金',
  balance: '@float(100, 999, 1, 2)',
  freeze_withdraw: '@float(100, 999, 1, 2)',
  amount: '@float(100, 999, 1, 2)',
  created: moment().format('YYYY-MM-DD hh:mm:ss'),
  created_uname: '@cname',
  updated: moment().format('YYYY-MM-DD hh:mm:ss'),
  updated_uname: '@cname',
}]});

router.get('/accountBalance/:id?', async (req, res, next) => {
  res.json(resultOk(accountBalance[0]));
});
router.put('/accountBalance/:id?', async (req, res, next) => {
  res.json(resultOk({}));
});
router.delete('/accountBalance/:id?', async (req, res, next) => {
  const n = accountBalance.findIndex(v => req.params.id === String(v.id));
  accountBalance.splice(n, 1);
  res.json(resultOk({}));
});



const { memberInfo } = mockjs.mock({'memberInfo|2': [{
  'id|+1': 1,
  tags: 'vip',
  truename: '@cname',
  pwd_login: '@word(6)',
  pwd_money: '@word(6)',
  user_type: '@integer(1,5)',
  level: '@integer(1,3)',
  last_login: '@datetime',
  ip: '@ip',
  last_ip: '@ip',
  channel: '@city',
  country: '@country',
  province: '@province',
  city: '@city',
  nationality: '@country',
  ctype: '美金',
  language: '中文',
  birth: '@datetime',
  gender: '男',
  idcard: '@zip@zip@zip',
  mobile: '13567@zip',
  qq: '@zip@zip',
  weixin: '@word(3)@zip',
  email: '@email',
  skype: '@email',
  address: '@city',
  postcode: '@zip',
  question_id: '@integer(1, 3)',
  answer: '@cword(3)',
  memo: '备注-@cword(2, 5)',
  created: moment().format('YYYY-MM-DD hh:mm:ss'),
  created_uname: '@cname',
  updated: moment().format('YYYY-MM-DD hh:mm:ss'),
  updated_uname: '@cname',
}]});

router.get('/memberInfo/:id?', async (req, res, next) => {
  res.json(resultOk(memberInfo[0]));
});
router.put('/memberInfo/:id?', async (req, res, next) => {
  res.json(resultOk({}));
});
router.delete('/memberInfo/:id?', async (req, res, next) => {
  const n = memberInfo.findIndex(v => req.params.id === String(v.id));
  memberInfo.splice(n, 1);
  res.json(resultOk({}));
});

const {questionId} = mockjs.mock({
  'questionId|3': [{
    'id|+1': 1,
    'name|+1': ['安全问题1', '安全问题2', '安全问题3'],
  }]
});
router.get('/questionId', async (req, res, next) => {
  res.json(resultOk(questionId));
});


const { bankCard } = mockjs.mock({'bankCard|5': [{
  'id|+1': 1,
  card: '@first',
  bank_name: '@integer(1, 3)',
  address: '@city',
  accountname: '@city',
  state: '@shuffle(["enabled","disabled"])',
  created_time: '@datetime',
  updated_time: '@datetime',
  created: moment().format('YYYY-MM-DD hh:mm:ss'),
  created_uname: '@cname',
  updated: moment().format('YYYY-MM-DD hh:mm:ss'),
  updated_uname: '@cname',
}]});

router.get('/bankCard/:id?', async (req, res, next) => {
  res.json(resultOk(bankCard[0]));
});
router.put('/bankCard/:id?', async (req, res, next) => {
  res.json(resultOk({}));
});
router.delete('/bankCard/:id?', async (req, res, next) => {
  const n = bankCard.findIndex(v => req.params.id === String(v.id));
  bankCard.splice(n, 1);
  res.json(resultOk({}));
});

const {bankName} = mockjs.mock({
  'bankName|3': [{
    'id|+1': 1,
    'name|+1': ['银行名称1', '银行名称2', '银行名称3'],
  }]
});
router.get('/bankName', async (req, res, next) => {
  res.json(resultOk(bankName));
});
const {bankCardState} = mockjs.mock({
  'bankCardState|3': [{
    'id|+1': 1,
    'name|+1': ['状态1', '状态2', '状态3'],
  }]
});
router.get('/bankCardState', async (req, res, next) => {
  res.json(resultOk(bankCardState));
});


const { memberSetting } = mockjs.mock({'memberSetting|5': [{
  'id|+1': 1,
  mtoken: '@zip',
  online: '@integer(1, 2)',
  refuse_withdraw: '@integer(1, 2)',
  refuse_sale: '@integer(1, 2)',
  refuse_rebate: '@integer(1, 2)',
  refuse_exchange: '@integer(1, 2)',
  created: moment().format('YYYY-MM-DD hh:mm:ss'),
  created_uname: '@cname',
  updated: moment().format('YYYY-MM-DD hh:mm:ss'),
  updated_uname: '@cname',
}]});

router.get('/memberSetting/:id?', async (req, res, next) => {
  res.json(resultOk(memberSetting[0]));
});
router.put('/memberSetting/:id?', async (req, res, next) => {
  res.json(resultOk({}));
});
router.delete('/memberSetting/:id?', async (req, res, next) => {
  const n = memberSetting.findIndex(v => req.params.id === String(v.id));
  memberSetting.splice(n, 1);
  res.json(resultOk({}));
});


