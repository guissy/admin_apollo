---
to: src/pages/<%= h.folder(name) %>.field.tsx
inject: true
before: <% file=`src/pages/${h.folder(name)}.field.tsx`; h.detailProps(file) -%>
skip-if: <%- `<Label \/>` %>
---