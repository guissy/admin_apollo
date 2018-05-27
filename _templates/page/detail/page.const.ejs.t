---
to: src/pages/<%= h.folder(name) %>.page.tsx
inject: true
after: <%- `const editFields` %>
skip_if: <%- `const detailFields` %>
---
    const detailFields = fields.detail(this.state.detail.record);