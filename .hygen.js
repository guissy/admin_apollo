this.props = {
  site: (v) => v,
}
const config = [
  {
    title: this.props.site('地址'),
    dataIndex: 'domain'
  },
  {
    title: this.props.site('备注'),
    dataIndex: 'comment'
  },
  {
    title: this.props.site('状态'),
    dataIndex: 'status',
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