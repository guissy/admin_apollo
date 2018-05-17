module.exports = [
  {
    id: 0,
    name: '网站',
    icon: 'dianpudanganwangzhan',
    action: ['delete', 'update', 'fetch', 'insert'],
    path: '/index',
    children: [
      {
        id: 1,
        name: '轮播广告',
        action: ['delete', 'update', 'fetch', 'insert'],
        path: '/adList'
      },
      {
        id: 2,
        name: '文案管理',
        action: ['delete', 'update', 'fetch', 'insert'],
        path: '/adHome'
      },
      {
        id: 3,
        name: '代理文案',
        action: ['delete', 'update', 'fetch', 'insert'],
        path: '/proxyCopy'
      },
      {
        id: 4,
        name: '存款文案',
        action: ['delete', 'update', 'fetch', 'insert'],
        path: '/depositCopy'
      },
      {
        id: 5,
        name: '浮动图管理',
        action: ['delete', 'update', 'fetch', 'insert'],
        path: '/floatAd'
      },
      {
        id: 6,
        name: '代理推广资源',
        action: ['delete', 'update', 'fetch', 'insert'],
        path: '/promotionResource'
      },
      {
        id: 7,
        name: '注册设置',
        action: ['delete', 'update', 'fetch', 'insert'],
        path: '/registerSet'
      },
      {
        id: 8,
        name: '站点设置',
        action: ['delete', 'update', 'fetch', 'insert'],
        path: '/webSet'
      },
      {
        id: 9,
        name: '消息',
        action: ['delete', 'update', 'fetch', 'insert'],
        path: '/sysMessage'
      },
      {
        id: 10,
        name: '公告管理',
        action: ['delete', 'update', 'fetch', 'insert'],
        path: '/notice'
      },
      {
        id: 11,
        name: '消息管理',
        action: ['delete', 'update', 'fetch', 'insert'],
        path: '/noticeManage'
      },
      {
        id: 12,
        name: '资源站管理',
        action: ['delete', 'update', 'fetch', 'insert'],
        path: '/resourceManage'
      }
    ]
  },
  {
    id: 25,
    name: '营销',
    icon: 'yingxiao',
    action: ['delete', 'update', 'fetch', 'insert'],
    path: '/index',
    children: [
      {
        id: 26,
        name: '优惠申请',
        action: ['delete', 'update', 'fetch', 'insert'],
        path: '/apply'
      },
      {
        id: 27,
        name: '优惠类型',
        action: ['delete', 'update', 'fetch', 'insert'],
        path: '/typeList'
      },
      {
        id: 28,
        name: '自动优惠模板',
        action: ['delete', 'update', 'fetch', 'insert'],
        path: '/activeSet'
      },
      {
        id: 29,
        name: '返水活动',
        action: ['delete', 'update', 'fetch', 'insert'],
        path: '/discount'
      },
      {
        id: 30,
        name: '返水查询',
        action: ['delete', 'update', 'fetch', 'insert'],
        path: '/discountCounting'
      },
      {
        id: 31,
        name: '优惠模板',
        action: ['delete', 'update', 'fetch', 'insert'],
        path: '/addActiveSet'
      },
      {
        id: 32,
        name: '每日签到模板优惠设置',
        action: ['delete', 'update', 'fetch', 'insert'],
        path: '/activeMode_1',
        hidden: true
      },
      {
        id: 33,
        name: '邮箱验证模板优惠设置',
        action: ['delete', 'update', 'fetch', 'insert'],
        path: '/activeMode_2',
        hidden: true
      },
      {
        id: 34,
        name: '手机验证模板优惠设置',
        action: ['delete', 'update', 'fetch', 'insert'],
        path: '/activeMode_3',
        hidden: true
      },
      {
        id: 35,
        name: '每日抽奖模板优惠设置',
        action: ['delete', 'update', 'fetch', 'insert'],
        path: '/activeMode_4',
        hidden: true
      },
      {
        id: 36,
        name: '救援金模板优惠设置',
        action: ['delete', 'update', 'fetch', 'insert'],
        path: '/activeMode_5',
        hidden: true
      },
      {
        id: 37,
        name: '擂台赛模板优惠设置',
        action: ['delete', 'update', 'fetch', 'insert'],
        path: '/activeMode_6',
        hidden: true
      },
      {
        id: 38,
        name: '奖上奖模板优惠设置',
        action: ['delete', 'update', 'fetch', 'insert'],
        path: '/activeMode_7',
        hidden: true
      },
      {
        id: 39,
        name: '连续闯关模板优惠设置',
        action: ['delete', 'update', 'fetch', 'insert'],
        path: '/activeMode_8',
        hidden: true
      },
      {
        id: 40,
        name: '存款优惠模板优惠设置',
        action: ['delete', 'update', 'fetch', 'insert'],
        path: '/activeMode_9',
        hidden: true
      },
      {
        id: 41,
        name: '模板优惠设置(邮箱验证)',
        action: ['delete', 'update', 'fetch', 'insert'],
        path: '/activeMode_email',
        hidden: true
      },
      {
        id: 42,
        name: '手动优惠',
        action: ['delete', 'update', 'fetch', 'insert'],
        path: '/activityContent'
      },
      {
        id: 43,
        name: '返水优惠查询',
        action: ['delete', 'update', 'fetch', 'insert'],
        path: '/discountQuery'
      },
      {
        id: 44,
        name: '返水优惠设定',
        action: ['delete', 'update', 'fetch', 'insert'],
        path: '/discountSetting'
      }
    ]
  },
  {
    id: 79,
    name: '风控',
    icon: 'shield',
    action: ['delete', 'update', 'fetch', 'insert'],
    path: '/index',
    children: [
      {
        id: 80,
        name: 'IP黑名单',
        action: ['delete', 'update', 'fetch', 'insert'],
        path: '/ipBlacklist'
      },
      {
        id: 81,
        name: '重复账号',
        action: ['delete', 'update', 'fetch', 'insert'],
        path: '/duplicateAccount',
        hidden: true
      }
    ]
  },
  {
    id: 84,
    name: '用户',
    icon: 'yonghuguanli',
    action: ['delete', 'update', 'fetch', 'insert'],
    path: '/index',
    children: [
      {
        id: 85,
        name: '会员管理',
        action: ['delete', 'update', 'fetch', 'insert'],
        path: '/memberManage'
      },
      {
        id: 86,
        name: '会员层级',
        action: ['delete', 'update', 'fetch', 'insert'],
        path: '/memberHierarchy'
      },
      {
        id: 87,
        name: '会员标签',
        action: ['delete', 'update', 'fetch', 'insert'],
        path: '/memberLabel'
      },
      {
        id: 88,
        name: '闲置帐号',
        action: ['delete', 'update', 'fetch', 'insert'],
        path: '/idleAccount'
      },
      {
        id: 89,
        name: '登录查询',
        action: ['delete', 'update', 'fetch', 'insert'],
        path: '/LoginAccount',
        hidden: true
      },
      {
        id: 90,
        name: '代理管理',
        action: ['delete', 'update', 'fetch', 'insert'],
        path: '/agentAccount'
      },
      {
        id: 91,
        name: '有效用户',
        action: ['delete', 'update', 'fetch', 'insert'],
        path: '/validUser'
      },
      {
        id: 92,
        name: '第三方会员查询',
        action: ['delete', 'update', 'fetch', 'insert'],
        path: '/otherMembers'
      },
      {
        id: 93,
        name: '代理审核',
        action: ['delete', 'update', 'fetch', 'insert'],
        path: '/agentAudit'
      },
      {
        id: 94,
        name: '管理员列表',
        action: ['delete', 'update', 'fetch', 'insert'],
        path: '/childAccount'
      },
      {
        id: 95,
        name: '管理员角色',
        action: ['delete', 'update', 'fetch', 'insert'],
        path: '/childRoleAccount'
      },
      {
        id: 96,
        name: '有效投注查询',
        action: ['delete', 'update', 'fetch', 'insert'],
        path: '/effectiveBettingQuery'
      }
    ]
  },
  {
    id: 109,
    name: '订单',
    icon: 'dingdan',
    action: ['delete', 'update', 'fetch', 'insert'],
    path: '/index',
    children: [
      {
        id: 111,
        name: '订单查询',
        action: ['delete', 'update', 'fetch', 'insert'],
        path: '/noteManagement'
      },
      {
        id: 114,
        name: '红包小费',
        action: ['delete', 'update', 'fetch', 'insert'],
        path: '/notePremiumTips',
        hidden: true
      }
    ]
  },
  {
    id: 120,
    name: '现金',
    icon: 'iconfontqian',
    action: ['delete', 'update', 'fetch', 'insert'],
    path: '/index',
    children: [
      {
        id: 121,
        name: '银行管理',
        action: ['delete', 'update', 'fetch', 'insert'],
        path: '/bankManagement'
      },
      {
        id: 122,
        name: '第三方支付平台',
        action: ['delete', 'update', 'fetch', 'insert'],
        path: '/otherPayment'
      },
      {
        id: 123,
        name: '收款帐户',
        action: ['delete', 'update', 'fetch', 'insert'],
        path: '/receivableBank'
      },
      {
        id: 124,
        name: '线上充值',
        action: ['delete', 'update', 'fetch', 'insert'],
        path: '/onLineReceipt'
      },
      {
        id: 125,
        name: '公司入款',
        action: ['delete', 'update', 'fetch', 'insert'],
        path: '/offlineReceipt'
      },
      {
        id: 126,
        name: '会员提现',
        action: ['delete', 'update', 'fetch', 'insert'],
        path: '/memberGetOut'
      },
      {
        id: 127,
        name: '人工存提',
        action: ['delete', 'update', 'fetch', 'insert'],
        path: '/manual'
      },
      {
        id: 128,
        name: '现金流水',
        action: ['delete', 'update', 'fetch', 'insert'],
        path: '/fundDetails'
      },
      {
        id: 129,
        name: '转帐记录',
        action: ['delete', 'update', 'fetch', 'insert'],
        path: '/transferRecord'
      }
    ]
  },
  {
    id: 139,
    name: '佣金',
    icon: 'yongjin',
    action: ['delete', 'update', 'fetch', 'insert'],
    path: '/index',
    children: [
      {
        id: 140,
        name: '退佣手续费',
        action: ['delete', 'update', 'fetch', 'insert'],
        path: '/commissionFeeset'
      },
      {
        id: 141,
        name: '代理退佣比例',
        action: ['delete', 'update', 'fetch', 'insert'],
        path: '/CommissionSet'
      },
      {
        id: 142,
        name: '退佣设定',
        action: ['delete', 'update', 'fetch', 'insert'],
        path: '/agentSettlementSet'
      },
      {
        id: 143,
        name: '退佣期数',
        action: ['delete', 'update', 'fetch', 'insert'],
        path: '/RefundCommissionPeriod'
      },
      {
        id: 144,
        name: '退佣查询',
        action: ['delete', 'update', 'fetch', 'insert'],
        path: '/CommissionIncomeQuery'
      },
      {
        id: 145,
        name: '下级佣金统计',
        action: ['delete', 'update', 'fetch', 'insert'],
        path: '/subAgentRebate'
      },
      {
        id: 146,
        name: '代理统计',
        action: ['delete', 'update', 'fetch', 'insert'],
        path: '/agencyStatistics',
        hidden: true
      },
      {
        id: 147,
        name: '代理推广链接',
        action: ['delete', 'update', 'fetch', 'insert'],
        path: '/agentLink'
      },
      {
        id: 148,
        name: '代理提款',
        action: ['delete', 'update', 'fetch', 'insert'],
        path: '/agentDrawing'
      }
    ]
  },
  {
    id: 158,
    name: '报表',
    icon: 'bingtu',
    action: ['delete', 'update', 'fetch', 'insert'],
    path: '/index',
    children: [
      {
        id: 159,
        name: '总报表',
        action: ['delete', 'update', 'fetch', 'insert'],
        path: '/sumStatement'
      },
      {
        id: 160,
        name: '游戏报表',
        action: ['delete', 'update', 'fetch', 'insert'],
        path: '/gameStatement'
      },
      {
        id: 161,
        name: '交收表',
        action: ['delete', 'update', 'fetch', 'insert'],
        path: '/deliveryStatement'
      },
      {
        id: 162,
        name: '出入款汇总',
        action: ['delete', 'update', 'fetch', 'insert'],
        path: '/fundDetailsSummary'
      },
      {
        id: 163,
        name: '余额汇总',
        action: ['delete', 'update', 'fetch', 'insert'],
        path: '/memberBalance'
      },
      {
        id: 164,
        name: '红包小费',
        action: ['delete', 'update', 'fetch', 'insert'],
        path: '/PremiumTips',
        hidden: true
      }
    ]
  },
  {
    id: 171,
    name: '系统',
    icon: 'xitongguanli1',
    action: ['delete', 'update', 'fetch', 'insert'],
    path: '/index',
    children: [
      {
        id: 172,
        name: '后台操作日志',
        action: ['delete', 'update', 'fetch', 'insert'],
        path: '/backgroundLog'
      },
      {
        id: 173,
        name: '会员操作日志',
        action: ['delete', 'update', 'fetch', 'insert'],
        path: '/memberLog'
      },
      {
        id: 174,
        name: '系统设置',
        action: ['delete', 'update', 'fetch', 'insert'],
        path: '/systemSetting'
      },
      {
        id: 175,
        name: '邮件管理',
        action: ['delete', 'update', 'fetch', 'insert'],
        path: '/emailList'
      },
      {
        id: 176,
        name: '货币设定',
        action: ['delete', 'update', 'fetch', 'insert'],
        path: '/currencySetting'
      },
      {
        id: 177,
        name: '第三方客服',
        action: ['delete', 'update', 'fetch', 'insert'],
        path: '/otherService'
      },
      {
        id: 178,
        name: '邮件服务器',
        action: ['delete', 'update', 'fetch', 'insert'],
        path: '/emailSetting'
      },
      {
        id: 179,
        name: '前台域名设置',
        action: ['delete', 'update', 'fetch', 'insert'],
        path: '/domainSetting'
      },
      {
        id: 180,
        name: '游戏后台帐号',
        action: ['delete', 'update', 'fetch', 'insert'],
        path: '/gameAccount'
      }
    ]
  }
];