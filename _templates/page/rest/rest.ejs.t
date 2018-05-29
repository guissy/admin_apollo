---
to: server/routes/rest_<%= h.dirname(name) %>.js
inject: true
append: true
skip_if: /<%= h.page(name) %>/:id
sh: pm2 restart all
---

<% Page = h.Page(name); page = h.page(name) -%>
const { <%= page %> } = mockjs.mock({'<%= page %>|5': [{
  'id|+1': 1,
<% h.fields().forEach(function(field){
  const value = h.mockValue(field);
  const key = h.key(field.dataIndex);
  let key_value = `${key}: '${value}',`;
  if (Array.isArray(value)) {
    key_value = `'${key}|1': ${JSON.stringify(value)},`; // enabled/disabled
  }
-%>
  <%- key_value %>
<% }) -%>
  created: moment().format('YYYY-MM-DD hh:mm:ss'),
  created_uname: '@cname',
  updated: moment().format('YYYY-MM-DD hh:mm:ss'),
  updated_uname: '@cname',
}]});

router.get('/<%= page %>', async (req, res, next) => {
  res.json(resultOk(<%= page %>));
});
router.put('/<%= page %>/:id?', async (req, res, next) => {
  res.json(resultOk({}));
});
router.delete('/<%= page %>/:id?', async (req, res, next) => {
  const n = <%= page %>.findIndex(v => req.params.id === String(v.id));
  <%= page %>.splice(n, 1);
  res.json(resultOk({}));
});

<% h.form('select', name).forEach(function(field) { -%>
<% Type = h.Page(field.dataIndex);type = h.page(field.dataIndex); -%>
const {<%= type %>} = mockjs.mock({
  '<%= type %>|3': [{
    'id|+1': 1,
    'name|+1': ['<%= field.title %>1', '<%= field.title %>2', '<%= field.title %>3'],
  }]
});
router.get('/<%= type %>', async (req, res, next) => {
  res.json(resultOk(<%= type %>));
});
<% }) -%>
