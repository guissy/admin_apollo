const site = (v) => v;
this.props = {site};
let locals = {};
const title = '会员设置';
const config = [
  {
    title: site('M令牌状态'),
    dataIndex: 'mtoken'
  },
  {
    title: site('在线状态'),
    dataIndex: 'online',
    form: 'switch'
  },
  {
    title: site('禁止提款'),
    dataIndex: 'refuse_withdraw',
    form: 'checkbox'
  },
  {
    title: site('禁止优惠'),
    dataIndex: 'refuse_sale',
    form: 'checkbox'
  },
  {
    title: site('禁止返水'),
    dataIndex: 'refuse_rebate',
    form: 'checkbox'
  },
  {
    title: site('禁止额度转换'),
    dataIndex: 'refuse_exchange'
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
    dd: (s) => '../'.repeat(s.split('/').length),
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
    /** 字段有逗号时 */
    key: s => s.includes(',') ? `'${s}'` : s,

    /** 找出 select 字段 */
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
    selectType: (field, name, isUpper) => {
      const typeName = words(field.dataIndex).length === 1
        ? lower(name) + upper(field.dataIndex)
        : lower(field.dataIndex);
      return isUpper ? upperFirst(typeName) : typeName;
    },
    /** 添加 search: 'form' */
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
    },
    /** 根据不同字段，mock数字或文字 */
    mockValue: (field) => {
      const ints = ['num', 'nums', 'total', 'count', 'times', 'code'];
      const intsCn = ['总数', '人数', '次数'];
      const floats = ['money', 'deposit'];
      const floatsCn = ['钱', '款', '额', '费'];
      const desc = ['memo', 'description', 'comment', 'about', 'note'];
      const descCn = ['简介','描述','备注'];
      const email = ['email'];
      const emailCn = ['邮箱'];
      const ip = ['ip'];
      const ipCn = ['ip'];
      const url = ['domain', 'host', 'url', 'link'];
      const urlCn = ['域名', '网址', '链接'];
      const mobile = ['mobile', 'phone'];
      const mobileCn = ['手机', '电话'];
      const time = ['time', 'date', 'birth', 'day'];
      const timeCn = ['日期', '时间', '生日', '出生'];
      const name = ['user', 'nickname', 'truename'];
      const nameCn = ['姓名', '妮称', '用户', '者'];
      const account = ['account', 'username'];
      const accountCn = ['账号', '用户名'];
      const status = ['status'];
      const statusCn = ['状态'];
      const has = (keywords, keywordsCn) => words(field.dataIndex).some(v => keywords.includes(v))
        || keywordsCn.some(v => field.title.includes(v));
      if (has(time, timeCn)) {
        return '@datetime';
      } else if (has(ints, intsCn)) {
        return '@integer(1, 100)';
      } else if (has(floats, floatsCn)) {
        return '@float(100, 999, 1, 2)';
      } else if (has(desc, descCn)) {
        return field.title + '-@cword(2, 5)';
      } else if (has(email, emailCn)) {
        return '@email';
      } else if (has(ip, ipCn)) {
        return '@ip';
      } else if (has(url, urlCn)) {
        return '@url';
      } else if (has(mobile, mobileCn)) {
        return '13567@zip';
      } else if (has(account, accountCn) || field.title.endsWith('人')) {
        return '@first';
      } else if (has(name, nameCn) || field.title.endsWith('人')) {
        return '@cname';
      } else if (has(status, statusCn)) {
        return '@shuffle(["enabled","disabled"])';
      } else if (field.form==='select') {
        return '@integer(1, 3)';
      } else {
        return '@city';
      }
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

