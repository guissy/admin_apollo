const site = (v) => v;
this.props = { site };
const title = '现金流水';
const config = [
  {
    title: '用户名',
    dataIndex: 'username',
    notInTable: true,
  },
  {
    title: '体系',
    dataIndex: 'no',
    notInTable: true,
  },
  {
    title: '交易类别',
    dataIndex: 'deal_category',
    notInTable: true,
    form: 'select'
  },
  {
    title: site('交易类型'),
    dataIndex: 'deal_type',
    form: 'select'
  },
  {
    title: site('交易时间'),
    dataIndex: 'start_time,end_time',
    form: 'date'
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