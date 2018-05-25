---
to: src/index.tsx
inject: true
after: typePatcher
skip_if: <%= h.Page(name) %>Result
---
<% Page = h.Page(name); page = h.page(name) -%>
        ...addTypePatcher('<%= Page %>Result', '<%= Page %>'),
<%_ h.form('select', name).forEach(function(field) { -%>
<%_ Type = h.Page(field.dataIndex);type = h.page(field.dataIndex); -%>
        ...addTypePatcher('<%= Type %>Result', '<%= Type %>'),
<%_ }) -%>