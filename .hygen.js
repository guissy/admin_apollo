const site = (v) => v;
this.props = {site};
let locals = {};
const title = '代理审核';
const config = [
  {
    title: site('代理用户名'),
    dataIndex: 'name',
  },
  {
    title: site('电话号码'),
    dataIndex: 'mobile',
    
  },
  {
    title: site('电子邮箱'),
    dataIndex: 'email',
    
  },
  {
    title: site('姓名'),
    dataIndex: 'truename',
    
  },
  {
    title: site('注册时间'),
    dataIndex: 'created',
    
  },
  {
    title: site('加入来源'),
    dataIndex: 'channel',
  },
  {
    title: site('注册IP'),
    dataIndex: 'ip',
    
  },
  {
    title: site('处理人'),
    dataIndex: 'admin_user',
    
  },
  {
    title: site('审核状态'),
    dataIndex: 'status',
    form: 'select',
  },
  ];


const {compose, get, camelCase, upperFirst, words} = require('lodash/fp');
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
  locals.name = s;
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
    form: (formType, name) => {
      return config.filter(v => v.form === formType)
        .map(v => {
          let dataIndex = v.dataIndex;
          if (formType === 'select' && words(v.dataIndex).length === 1) {
            dataIndex = lower(name) + upperFirst(v.dataIndex);
          }
          return { ...v, dataIndex };
        });
    },

    searchProps: (file) => {
      project.addExistingSourceFiles(file);
      const fieldClass = project.getSourceFileOrThrow(file);
      fieldClass.getExportedDeclarations()[0].getProperties()
        .filter(v => v.getText().includes('form') && !v.getText().includes('id'))
        .forEach(v => {
          v.getChildren()[2].addPropertyAssignment({
            name: 'search',
            initializer: `'form'`,
          });
        });
      project.save();
    }
  }
}

const Project = require('ts-simple-ast').default;
const { IndentationText, NewLineKind, QuoteKind } = require('ts-simple-ast');

// initialize
const project = new Project({
  manipulationSettings: {
    indentationText: IndentationText.TwoSpaces,
    newLineKind: NewLineKind.LineFeed,
    quoteKind: QuoteKind.Single
  }
});

