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
const lower =  compose(camelCase, get('module'), parsePath);
const upper =  compose(upperFirst, lower);
module.exports = {
  helpers: {
    Page: upper,
    page: lower,
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