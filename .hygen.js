const site = (v) => v;
this.props = { site };
const title = '转帐记录';
const config = [
  {
    title: '用户名',
    dataIndex: 'username',
    notInTable: true,
  },
  {
    title: '交易订单号',
    dataIndex: 'no',
    notInTable: true,
  },
  {
    title: '状态',
    dataIndex: 'status',
    notInTable: true,
    form: 'select'
  },
  {
    title: site('转账时间'),
    dataIndex: 'start_time,end_time',
    form: 'date'
  },
  {
    title: site('转出'),
    dataIndex: 'out_id',
    form: 'select'
  },
  {
    title: site('转入'),
    dataIndex: 'in_id',
    form: 'select'
  }
];


const { compose, get, camelCase, upperFirst } = require('lodash/fp');
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
      const { folder } = parsePath(s);
      return folder;
    },
    folder: s => {
      const { folder } = parsePath(s);
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