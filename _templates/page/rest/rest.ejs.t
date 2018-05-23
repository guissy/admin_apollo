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
<% h.fields().forEach(function(field){ -%>
  <%= field.dataIndex %>: '@cname',
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
