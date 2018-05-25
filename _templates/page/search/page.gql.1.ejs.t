---
to: src/pages/<%= h.folder(name) %>.page.tsx
inject: true
after: <%- `query ${h.page(name)}Query` %>
---
<%- h.fields().map(field => `                $${field.dataIndex}: String`).join('\n') %>