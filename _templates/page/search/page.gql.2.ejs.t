---
to: src/pages/<%= h.folder(name) %>.page.tsx
inject: true
before: "page: \\$page"
---
<%- h.fields().map(field => `                  ${field.dataIndex}: $${field.dataIndex}`).join('\n') %>