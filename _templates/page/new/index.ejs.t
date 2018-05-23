---
to: src/index.tsx
inject: true
after: typePatcher
skip_if: <%= h.Page(name) %>
---
<% Page = h.Page(name); page = h.page(name) -%>
        ...addTypePatcher('<%= Page %>Result', '<%= Page %>'),