const site = (v) => v;
this.props = {site};
const title = '会员层级';
const config = [ {
  title: site('用户名'),
  dataIndex: 'name',
},
  {
    title: site('上级代理'),
    dataIndex: 'agent',
  },
  {
    title: site('总余额'),
    dataIndex: 'total',
  },
  {
    title: site('最后登录时间'),
    dataIndex: 'last_login',
  },
  {
    title: site('总额小于'),
    dataIndex: 'balance',
    notInTable: true,
  },
  ];


const {compose, get, camelCase, upperFirst} = require('lodash/fp');
const parsePath = s => {
  const arr = s.split('/');
  if (arr.length > 1) {
    const module = arr.pop();
    const folder = arr.join('/')
    return {module, folder};
  } else {
    return {
      module: s
    };
  }
}
const lower = compose(camelCase, get('module'), parsePath);
const upper = compose(upperFirst, lower);
module.exports = {
  helpers: {
    Page: upper,
    page: lower,
    title: () => title || locals.Name,
    fields: () => {
      return config;
    },
    dirname: s => {
      const {folder} = parsePath(s);
      return folder;
    },
    folder: s => {
      const {folder} = parsePath(s);
      if (folder) {
        return `${folder}/${lower(s)}/${upper(s)}`
      } else {
        return `${lower(s)}/${upper(s)}`
      }
    },
    key: s => s.includes(',') ? `'${s}'` : s,
    form: (s) => config.filter(v => v.form === s),
  }
}