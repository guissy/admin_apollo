---
to: src/pages/<%= h.folder(name) %>.page.tsx
inject: true
after: <%- `state = ` %>
---
<% Page = h.Page(name); page = h.page(name); dd = h.dd(name); -%>
    detail: {
      visible: false,
      record: {} as <%= Page %>
    },