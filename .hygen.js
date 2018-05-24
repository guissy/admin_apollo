
this.props = {
  site: (v) => v,
}
const config = [
  {
    title: this.props.site('期数名称'),
    dataIndex: 'period_name'
  },
  {
    title: this.props.site('代理用户名'),
    dataIndex: 'uname'
  },
  {
    title: this.props.site('下级佣金'),
    dataIndex: 'settings',
  },
  {
    title: this.props.site('总计'),
    dataIndex: 'total'
  },
  {
    title: this.props.site('状态'),
    dataIndex: 'status'
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
  }
}