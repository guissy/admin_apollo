---
to: src/pages/<%= h.folder(name) %>.page.tsx
inject: true
after: <%- `const editFields` %>
skip_if: <%- `const searchFields` %>
---
    const searchFields = fields.filterBy('search');